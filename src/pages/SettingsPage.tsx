import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/Button';
import { BottomSheet } from '@/components/BottomSheet';
import { useToast } from '@/hooks/useToast';
import { setApiKey, getStoredApiKey } from '@/features/ai/services/geminiService';

export default function SettingsPage() {
  const { addToast } = useToast();
  const [apiKey, setApiKeyState] = useState(getStoredApiKey() || '');
  const [showKey, setShowKey] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const handleSave = useCallback(() => {
    if (apiKey.trim()) {
      setApiKey(apiKey.trim());
      addToast({ type: 'success', message: 'API key saved!' });
    }
  }, [apiKey, addToast]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="min-h-screen pb-24"
    >
      <header className="sticky top-0 z-10 bg-[#F2EAE0] px-5 py-4">
        <h1 className="text-[28px] font-bold text-[#1E1E24] tracking-[-0.02em] max-w-3xl mx-auto">
          Settings
        </h1>
      </header>

      <main className="px-5 max-w-3xl mx-auto space-y-6">
        {/* API Key Section */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_4px_16px_rgba(155,142,199,0.06)]">
          <span className="text-[11px] font-semibold text-[#6B6875] tracking-[0.08em] uppercase">
            Gemini API Key
          </span>
          <p className="text-[12px] text-[#6B6875] mt-1 leading-relaxed">
            Your API key is stored locally in your browser. It never leaves your device except to call Gemini.
          </p>
          <div className="relative mt-3">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKeyState(e.target.value)}
              placeholder="Enter your Gemini API key..."
              className="w-full h-[52px] bg-[#F2EAE0] rounded-xl px-4 pr-12 text-[15px] text-[#1E1E24] placeholder:text-[#6B6875] outline-none focus:ring-2 focus:ring-[#9B8EC7] focus:ring-opacity-20 transition-shadow"
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
              aria-label={showKey ? 'Hide API key' : 'Show API key'}
            >
              {showKey ? (
                <EyeOff size={18} className="text-[#6B6875]" />
              ) : (
                <Eye size={18} className="text-[#6B6875]" />
              )}
            </button>
          </div>
          <Button fullWidth className="mt-3" onClick={handleSave}>
            Save Key
          </Button>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(155,142,199,0.06)] overflow-hidden">
          <div className="p-5 pb-2">
            <span className="text-[11px] font-semibold text-[#6B6875] tracking-[0.08em] uppercase">
              About
            </span>
          </div>
          <div>
            <div className="flex items-center justify-between h-12 px-5 border-b border-[#F2EAE0]">
              <span className="text-[15px] text-[#1E1E24]">Version</span>
              <span className="text-[15px] text-[#6B6875]">1.0.0</span>
            </div>
            <button
              onClick={() => setShowHowItWorks(true)}
              className="w-full flex items-center justify-between h-12 px-5 border-b border-[#F2EAE0] hover:bg-[#F2EAE0] transition-colors"
            >
              <span className="text-[15px] text-[#1E1E24]">How It Works</span>
              <ChevronRight size={16} className="text-[#6B6875]" />
            </button>
            <button
              onClick={() => setShowPrivacy(true)}
              className="w-full flex items-center justify-between h-12 px-5 hover:bg-[#F2EAE0] transition-colors"
            >
              <span className="text-[15px] text-[#1E1E24]">Privacy</span>
              <ChevronRight size={16} className="text-[#6B6875]" />
            </button>
          </div>
        </div>
      </main>

      <BottomSheet
        isOpen={showHowItWorks}
        onClose={() => setShowHowItWorks(false)}
        title="How Voice Notes Works"
      >
        <p className="text-[15px] text-[#1E1E24] leading-relaxed">
          Voice Notes uses your browser&apos;s built-in speech recognition to transcribe audio in real-time. The audio is never stored or sent anywhere. Only the transcribed text is sent to Google&apos;s Gemini AI to extract structure — summaries, tasks, facts, and questions. Everything stays in your browser.
        </p>
      </BottomSheet>

      <BottomSheet
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
        title="Privacy"
      >
        <div className="space-y-4 text-[15px] text-[#1E1E24] leading-relaxed">
          <p>
            Voice Notes is designed with privacy at its core:
          </p>
          <ul className="space-y-2 list-disc pl-5">
            <li>Your voice is processed entirely in your browser using the Web Speech API.</li>
            <li>Audio is never recorded, stored, or transmitted.</li>
            <li>Only transcribed text is sent to Gemini for structuring.</li>
            <li>Your API key is stored locally in your browser.</li>
            <li>All notes are stored in your browser&apos;s IndexedDB — no server, no cloud.</li>
          </ul>
        </div>
      </BottomSheet>
    </motion.div>
  );
}
