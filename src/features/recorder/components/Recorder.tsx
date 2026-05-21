import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square } from "lucide-react";
import { useSpeechRecognition } from "@/features/recorder/hooks/useSpeechRecognition";
import { PulseRings } from "./PulseRings";
import { TranscriptionPreview } from "./TranscriptionPreview";
import { CircularProgress } from "./CircularProgress";
import { ProcessingIndicator } from "./ProcessingIndicator";
import type { RecordingState } from "@/types";

interface RecorderProps {
  onTranscriptionComplete: (text: string) => Promise<void>;
}

const MAX_RECORDING_SECONDS = 300;

export function Recorder({ onTranscriptionComplete }: RecorderProps) {
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const handleStopRef = useRef<() => Promise<void>>(async () => {});

  const {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    error,
  } = useSpeechRecognition();

  // Fix Bug 2: stop mic on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      stopListening();
    };
  }, []);

  useEffect(() => {
    if (isListening) {
      setRecordingState("recording");
      setElapsedSeconds(0);
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => {
          // Fix Bug 1: use ref instead of direct handleStop to avoid stale closure
          if (prev >= MAX_RECORDING_SECONDS - 1) {
            handleStopRef.current();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isListening]);

  // Fix Bug 5: ignore errors during processing to avoid race condition
  useEffect(() => {
    if (error && recordingState === "recording") {
      setRecordingState("idle");
      resetTranscript();
      setElapsedSeconds(0);
    }
  }, [error, recordingState, resetTranscript]);

  const handleStart = useCallback(() => {
    resetTranscript();
    setElapsedSeconds(0);
    startListening();
  }, [resetTranscript, startListening]);

  const handleStop = useCallback(async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    stopListening();
    const fullText = transcript + interimTranscript;
    if (fullText.trim()) {
      // used try/finally so state always resets even if throws
      try {
        setRecordingState("processing");
        await onTranscriptionComplete(fullText.trim());
      } finally {
        setRecordingState("idle");
        resetTranscript();
      }
    } else {
      setRecordingState("idle");
    }
  }, [stopListening, transcript, interimTranscript, onTranscriptionComplete]);

  // Fix Bug 1: keep ref in sync with latest handleStop
  useEffect(() => {
    handleStopRef.current = handleStop;
  }, [handleStop]);

  const handleToggle = useCallback(() => {
    if (recordingState === "idle") {
      handleStart();
    } else if (recordingState === "recording") {
      handleStop();
    }
  }, [recordingState, handleStart, handleStop]);

  const progress = elapsedSeconds / MAX_RECORDING_SECONDS;
  const isRecording = recordingState === "recording";
  const isProcessing = recordingState === "processing";

  if (!isSupported) {
    return (
      <div className="text-center py-8">
        <p className="text-[14px] text-[#6B6875]">
          Speech recognition is not supported in this browser.
        </p>
        <p className="text-[12px] text-[#6B6875] mt-1">Try Chrome or Edge.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-8">
      <div className="relative flex items-center justify-center w-[120px] h-[120px]">
        <PulseRings isRecording={isRecording} />

        {isRecording && <CircularProgress progress={progress} />}

        {/* Fix Bug 4: z-9 → z-10 */}
        <motion.button
          onClick={handleToggle}
          whileHover={!isProcessing ? { scale: 1.08 } : {}}
          whileTap={!isProcessing ? { scale: 0.92 } : {}}
          animate={{
            backgroundColor: isRecording ? "#E07A5F" : "#9B8EC7",
          }}
          transition={{ duration: 0.3 }}
          className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center shadow-[0_4px_24px_rgba(155,142,199,0.3)]"
          aria-label={isRecording ? "Stop recording" : "Start recording"}
          disabled={isProcessing}
        >
          <AnimatePresence mode="wait">
            {isRecording ? (
              <motion.div
                key="stop"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Square size={24} className="text-white" fill="white" />
              </motion.div>
            ) : (
              <motion.div
                key="mic"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Mic size={24} className="text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {isProcessing ? (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4"
          >
            <ProcessingIndicator />
          </motion.div>
        ) : (
          <TranscriptionPreview
            transcript={transcript}
            interimTranscript={interimTranscript}
            isRecording={isRecording}
          />
        )}
      </AnimatePresence>

      {isRecording && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[11px] text-[#6B6875] mt-3"
        >
          {formatTime(elapsedSeconds)} / {formatTime(MAX_RECORDING_SECONDS)}
        </motion.p>
      )}

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[12px] text-[#E07A5F] mt-3 text-center px-4"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
