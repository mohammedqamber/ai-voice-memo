import { motion } from 'framer-motion';

interface PulseRingsProps {
  isRecording: boolean;
}

export function PulseRings({ isRecording }: PulseRingsProps) {
  const color = isRecording ? '#E07A5F' : '#9B8EC7';
  const duration = isRecording ? 1.0 : 2.0;
  const scaleTo = isRecording ? 1.12 : 1.08;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <motion.div
        animate={{
          scale: [1, scaleTo],
          opacity: [0.15, 0],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'easeOut',
        }}
        className="absolute w-[120px] h-[120px] rounded-full"
        style={{ backgroundColor: color }}
      />
      <motion.div
        animate={{
          scale: [1, scaleTo],
          opacity: [0.12, 0],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'easeOut',
          delay: 0.3,
        }}
        className="absolute w-[90px] h-[90px] rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}
