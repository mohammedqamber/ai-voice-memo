import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import type { Fact } from '@/types';

interface FactsCardProps {
  facts: Fact[];
  index?: number;
}

export function FactsCard({ facts, index = 0 }: FactsCardProps) {
  if (facts.length === 0) return null;

  return (
    <motion.div
      initial={{ y: 16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: index * 0.1 }}
      className="bg-white rounded-2xl p-5 shadow-[0_4px_16px_rgba(155,142,199,0.06)]"
    >
      <div className="flex items-center gap-2">
        <Lightbulb size={14} className="text-[#9B8EC7]" />
        <span className="text-[13px] font-bold text-[#9B8EC7] tracking-[0.06em] uppercase">
          Key Facts
        </span>
      </div>
      <div className="mt-3 space-y-4">
        {facts.map((fact) => (
          <div key={fact.id}>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#B4D3D9] mt-2 shrink-0" />
              <p className="text-[15px] text-[#1E1E24] leading-relaxed flex-1">
                {fact.text}
              </p>
            </div>
            <div className="ml-5 mt-1.5 h-[3px] bg-[#F2EAE0] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${fact.confidence}%` }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                className="h-full bg-[#B4D3D9] rounded-full"
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
