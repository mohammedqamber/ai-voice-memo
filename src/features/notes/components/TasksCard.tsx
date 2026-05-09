import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Check } from 'lucide-react';
import type { Task } from '@/types';

interface TasksCardProps {
  tasks: Task[];
  onUpdate?: (tasks: Task[]) => void;
  index?: number;
}

export function TasksCard({ tasks, onUpdate, index = 0 }: TasksCardProps) {
  const [localTasks, setLocalTasks] = useState(tasks);

  const toggleTask = useCallback((taskId: string) => {
    const updated = localTasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    setLocalTasks(updated);
    onUpdate?.(updated);
  }, [localTasks, onUpdate]);

  if (localTasks.length === 0) return null;

  return (
    <motion.div
      initial={{ y: 16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: index * 0.1 }}
      className="bg-white rounded-2xl p-5 shadow-[0_4px_16px_rgba(155,142,199,0.06)]"
    >
      <div className="flex items-center gap-2">
        <CheckSquare size={14} className="text-[#9B8EC7]" />
        <span className="text-[13px] font-bold text-[#9B8EC7] tracking-[0.06em] uppercase">
          Action Items
        </span>
      </div>
      <div className="mt-3 space-y-3">
        {localTasks.map((task) => (
          <div key={task.id} className="flex items-start gap-3">
            <button
              onClick={() => toggleTask(task.id)}
              className="mt-0.5 shrink-0"
              aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
            >
              {task.completed ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                  className="w-5 h-5 rounded-md bg-[#9B8EC7] flex items-center justify-center"
                >
                  <Check size={12} className="text-white" />
                </motion.div>
              ) : (
                <div className="w-5 h-5 rounded-md border-2 border-[#BDA6CE]" />
              )}
            </button>
            <div className="flex-1 min-w-0">
              <span
                className={`text-[15px] leading-relaxed ${
                  task.completed ? 'text-[#6B6875] line-through' : 'text-[#1E1E24]'
                }`}
              >
                {task.text}
              </span>
              {task.deadline && (
                <span className="ml-2 inline-block bg-[#F2EAE0] rounded-lg px-2 py-0.5 text-[12px] text-[#6B6875]">
                  {formatDeadline(task.deadline)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function formatDeadline(deadline: string): string {
  try {
    const date = new Date(deadline);
    if (isNaN(date.getTime())) return deadline;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return deadline;
  }
}
