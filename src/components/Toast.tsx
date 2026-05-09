import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const bgMap = {
  success: 'bg-[#5FB8A2]',
  error: 'bg-[#E07A5F]',
  info: 'bg-[#9B8EC7]',
};

export function Toast() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex flex-col items-center gap-2 pointer-events-none px-4">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const Icon = iconMap[toast.type];
          return (
            <motion.div
              key={toast.id}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className={`pointer-events-auto flex items-center gap-2 ${bgMap[toast.type]} text-white rounded-[14px] px-5 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.15)] max-w-[320px] w-full`}
            >
              <Icon size={18} className="shrink-0" />
              <span className="text-[15px] flex-1">{toast.message}</span>
              {toast.action ? (
                <button
                  onClick={() => {
                    toast.action?.onClick();
                    removeToast(toast.id);
                  }}
                  className="text-[13px] font-semibold underline underline-offset-2 shrink-0"
                >
                  {toast.action.label}
                </button>
              ) : (
                <button
                  onClick={() => removeToast(toast.id)}
                  aria-label="Dismiss"
                  className="shrink-0"
                >
                  <X size={14} />
                </button>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
