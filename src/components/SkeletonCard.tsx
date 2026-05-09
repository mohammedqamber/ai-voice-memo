import { motion } from 'framer-motion';

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-[0_4px_16px_rgba(155,142,199,0.06)] overflow-hidden relative">
      <div className="h-4 bg-[#F2EAE0] rounded w-3/4 mb-2" />
      <div className="h-3 bg-[#F2EAE0] rounded w-full mb-1" />
      <div className="h-3 bg-[#F2EAE0] rounded w-2/3 mb-3" />
      <div className="h-3 bg-[#F2EAE0] rounded w-20" />
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F2EAE0] to-transparent opacity-60"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}
