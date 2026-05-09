import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface SummaryCardProps {
  summary: string;
  index?: number;
}

export function SummaryCard({ summary, index = 0 }: SummaryCardProps) {
  return (
    <motion.div
      initial={{ y: 16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: index * 0.1 }}
      className="bg-white rounded-2xl p-5 shadow-[0_4px_16px_rgba(155,142,199,0.06)]"
    >
      <div className="flex items-center gap-2">
        <Sparkles size={14} className="text-[#9B8EC7]" />
        <span className="text-[13px] font-bold text-[#9B8EC7] tracking-[0.06em] uppercase">
          Summary
        </span>
      </div>
      <p className="text-[15px] text-[#1E1E24] leading-relaxed mt-3">
        {summary}
      </p>
    </motion.div>
  );
}
