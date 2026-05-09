import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import type { Question } from '@/types';

interface QuestionsCardProps {
  questions: Question[];
  onUpdate?: (questions: Question[]) => void;
  index?: number;
}

export function QuestionsCard({ questions, onUpdate, index = 0 }: QuestionsCardProps) {
  const [localQuestions, setLocalQuestions] = useState(questions);

  const updateAnswer = useCallback((qId: string, answer: string) => {
    const updated = localQuestions.map((q) =>
      q.id === qId ? { ...q, answer } : q
    );
    setLocalQuestions(updated);
    onUpdate?.(updated);
  }, [localQuestions, onUpdate]);

  if (localQuestions.length === 0) return null;

  return (
    <motion.div
      initial={{ y: 16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: index * 0.1 }}
      className="bg-white rounded-2xl p-5 shadow-[0_4px_16px_rgba(155,142,199,0.06)]"
    >
      <div className="flex items-center gap-2">
        <HelpCircle size={14} className="text-[#9B8EC7]" />
        <span className="text-[13px] font-bold text-[#9B8EC7] tracking-[0.06em] uppercase">
          Open Questions
        </span>
      </div>
      <div className="mt-3 space-y-4">
        {localQuestions.map((q) => (
          <div key={q.id}>
            <p className="text-[15px] text-[#1E1E24] italic leading-relaxed">
              {q.text}
            </p>
            <input
              type="text"
              value={q.answer || ''}
              onChange={(e) => updateAnswer(q.id, e.target.value)}
              placeholder="Add an answer..."
              className="mt-2 w-full h-11 bg-[#F2EAE0] rounded-xl px-4 text-[14px] text-[#1E1E24] placeholder:text-[#6B6875] outline-none focus:ring-2 focus:ring-[#9B8EC7] focus:ring-opacity-20 transition-shadow"
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
