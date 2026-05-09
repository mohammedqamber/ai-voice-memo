import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showHandle?: boolean;
}

export function BottomSheet({ isOpen, onClose, title, children, showHandle = true }: BottomSheetProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-[rgba(30,30,36,0.4)] backdrop-blur-[4px] z-40"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[24px] z-50 max-h-[70vh] overflow-y-auto"
          >
            {showHandle && (
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-9 h-1 bg-[#DDD8F0] rounded-full" />
              </div>
            )}
            {title && (
              <div className="flex items-center justify-between px-5 pt-3 pb-2">
                <h3 className="text-[16px] font-semibold text-[#1E1E24]">{title}</h3>
                <button onClick={onClose} aria-label="Close" className="p-1">
                  <X size={20} className="text-[#6B6875]" />
                </button>
              </div>
            )}
            <div className="px-5 pb-8 pt-2">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
