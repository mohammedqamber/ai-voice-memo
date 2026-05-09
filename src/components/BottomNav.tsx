import { motion } from 'framer-motion';
import { FileText, Mic, Settings } from 'lucide-react';
import type { View } from '@/types';

interface BottomNavProps {
  activeView: View;
  onViewChange: (view: View) => void;
  onRecordClick: () => void;
}

export function BottomNav({ activeView, onViewChange, onRecordClick }: BottomNavProps) {
  const tabs: { id: View; label: string; icon: typeof FileText }[] = [
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[72px] bg-white rounded-t-[24px] shadow-[0_-2px_12px_rgba(30,30,36,0.06)] z-30 flex items-center justify-around px-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onViewChange(tab.id)}
          className="flex flex-col items-center gap-1 relative py-2 px-4 min-w-[64px]"
          aria-label={tab.label}
        >
          <tab.icon
            size={22}
            className={activeView === tab.id ? 'text-[#9B8EC7]' : 'text-[#6B6875]'}
            strokeWidth={activeView === tab.id ? 2 : 1.5}
          />
          <span
            className={`text-[11px] font-medium ${
              activeView === tab.id ? 'text-[#9B8EC7]' : 'text-[#6B6875]'
            }`}
          >
            {tab.label}
          </span>
          {activeView === tab.id && (
            <motion.div
              layoutId="bottom-tab-indicator"
              className="absolute bottom-1 left-1/2 -translate-x-1/2 w-6 h-[3px] bg-[#9B8EC7] rounded-full"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
        </button>
      ))}

      <motion.button
        onClick={onRecordClick}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="flex items-center justify-center w-12 h-12 bg-[#9B8EC7] rounded-full shadow-[0_4px_20px_rgba(155,142,199,0.35)] -mt-3"
        aria-label="Start recording"
      >
        <Mic size={22} className="text-white" />
      </motion.button>
    </nav>
  );
}
