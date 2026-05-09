import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TranscriptionPreviewProps {
  transcript: string;
  interimTranscript: string;
  isRecording: boolean;
}

export function TranscriptionPreview({ transcript, interimTranscript, isRecording }: TranscriptionPreviewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const fullText = transcript + interimTranscript;
  const words = fullText.split(' ').filter(Boolean);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript, interimTranscript]);

  if (!isRecording && !fullText) {
    return (
      <p className="text-[12px] text-[#6B6875] text-center mt-4">
        Tap the mic and start talking...
      </p>
    );
  }

  return (
    <motion.div
      initial={{ y: 12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      ref={scrollRef}
      className="mt-4 max-h-[120px] overflow-y-auto px-2"
    >
      <p className="text-[17px] text-[#1E1E24] text-center leading-relaxed">
        <AnimatePresence mode="popLayout">
          {words.map((word, i) => (
            <motion.span
              key={`${i}-${word}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.08 }}
            >
              {word}{' '}
            </motion.span>
          ))}
        </AnimatePresence>
        {isRecording && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            className="text-[#9B8EC7]"
          >
            |
          </motion.span>
        )}
      </p>
    </motion.div>
  );
}
