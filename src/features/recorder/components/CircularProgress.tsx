import { motion } from 'framer-motion';

interface CircularProgressProps {
  progress: number;
}

export function CircularProgress({ progress }: CircularProgressProps) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - progress * circumference;

  return (
    <svg
      width="92"
      height="92"
      viewBox="0 0 92 92"
      className="absolute -rotate-90"
    >
      <circle
        cx="46"
        cy="46"
        r={radius}
        fill="none"
        stroke="#DDD8F0"
        strokeWidth="3"
      />
      <motion.circle
        cx="46"
        cy="46"
        r={radius}
        fill="none"
        stroke="#9B8EC7"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={circumference}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.5, ease: 'linear' }}
      />
    </svg>
  );
}
