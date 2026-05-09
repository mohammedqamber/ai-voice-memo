import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Note } from '@/types';
import { getRelativeTime } from '@/lib/utils';

interface NoteCardProps {
  note: Note;
  index: number;
  highlight?: boolean;
}

export function NoteCard({ note, index, highlight = false }: NoteCardProps) {
  const navigate = useNavigate();

  const hasTasks = note.tasks.length > 0;
  const hasFacts = note.facts.length > 0;
  const hasQuestions = note.questions.length > 0;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0, scale: 0.97 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ x: -100, opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut', delay: index * 0.06 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => navigate(`/note/${note.id}`)}
      layout
      className={`bg-white rounded-2xl p-4 shadow-[0_4px_16px_rgba(155,142,199,0.06)] cursor-pointer ${
        highlight ? 'bg-[rgba(155,142,199,0.04)]' : ''
      }`}
    >
      <h3 className="text-[16px] font-semibold text-[#1E1E24] truncate leading-tight">
        {note.title}
      </h3>
      <p className="text-[14px] text-[#6B6875] mt-1 line-clamp-2 leading-relaxed">
        {note.summary.length > 80 ? note.summary.substring(0, 80) + '...' : note.summary}
      </p>
      <div className="flex items-center justify-between mt-3">
        <span className="text-[12px] text-[#6B6875]">{getRelativeTime(note.createdAt)}</span>
        <div className="flex items-center gap-1">
          {hasTasks && <Dot color="#9B8EC7" />}
          {hasFacts && <Dot color="#B4D3D9" />}
          {hasQuestions && <Dot color="#BDA6CE" />}
        </div>
      </div>
    </motion.div>
  );
}

function Dot({ color }: { color: string }) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 15 }}
      className="w-1.5 h-1.5 rounded-full"
      style={{ backgroundColor: color }}
    />
  );
}
