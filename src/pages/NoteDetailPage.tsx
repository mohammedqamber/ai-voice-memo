import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Share2, Trash2 } from 'lucide-react';
import { SummaryCard } from '@/features/notes/components/SummaryCard';
import { TasksCard } from '@/features/notes/components/TasksCard';
import { FactsCard } from '@/features/notes/components/FactsCard';
import { QuestionsCard } from '@/features/notes/components/QuestionsCard';
import { BottomSheet } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { useNotes } from '@/hooks/useNotes';
import { useToast } from '@/hooks/useToast';
import type { Note } from '@/types';
import { getRelativeTime } from '@/lib/utils';

export default function NoteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { notes, removeNote, editNote } = useNotes();
  const { addToast } = useToast();
  const [note, setNote] = useState<Note | null>(null);
  const [showShare, setShowShare] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (id) {
      const found = notes.find((n) => n.id === id);
      if (found) {
        setNote(found);
      }
    }
  }, [id, notes]);

  const handleDelete = useCallback(async () => {
    if (!note) return;
    await removeNote(note.id);
    setShowDelete(false);
    addToast({
      type: 'success',
      message: 'Note deleted',
      action: {
        label: 'Undo',
        onClick: () => {
          // Undo would require caching the deleted note
        },
      },
    });
    navigate(-1);
  }, [note, removeNote, addToast, navigate]);

  const handleCopy = useCallback(() => {
    if (!note) return;
    const text = `${note.title}\n\n${note.summary}\n\n${note.tasks.map((t) => `[${t.completed ? 'x' : ' '}] ${t.text}`).join('\n')}\n\n${note.facts.map((f) => `• ${f.text}`).join('\n')}\n\n${note.questions.map((q) => `? ${q.text}`).join('\n')}`;
    navigator.clipboard.writeText(text).then(() => {
      addToast({ type: 'success', message: 'Copied to clipboard!' });
      setShowShare(false);
    });
  }, [note, addToast]);

  const handleExport = useCallback(() => {
    if (!note) return;
    const text = `${note.title}\n\n${note.summary}\n\nTasks:\n${note.tasks.map((t) => `- [${t.completed ? 'x' : ' '}] ${t.text}${t.deadline ? ` (Due: ${t.deadline})` : ''}`).join('\n')}\n\nFacts:\n${note.facts.map((f) => `- ${f.text} (Confidence: ${f.confidence}%)`).join('\n')}\n\nQuestions:\n${note.questions.map((q) => `- ${q.text}${q.answer ? `\n  Answer: ${q.answer}` : ''}`).join('\n')}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title.substring(0, 30).replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    addToast({ type: 'success', message: 'Note exported!' });
    setShowShare(false);
  }, [note, addToast]);

  const handleTasksUpdate = useCallback((tasks: Note['tasks']) => {
    if (!note) return;
    const updated = { ...note, tasks, updatedAt: Date.now() };
    setNote(updated);
    editNote(updated);
  }, [note, editNote]);

  const handleQuestionsUpdate = useCallback((questions: Note['questions']) => {
    if (!note) return;
    const updated = { ...note, questions, updatedAt: Date.now() };
    setNote(updated);
    editNote(updated);
  }, [note, editNote]);

  if (!note) {
    return (
      <div className="min-h-screen bg-[#F2EAE0] flex items-center justify-center">
        <p className="text-[#6B6875]">Note not found</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0.7 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="min-h-screen bg-[#F2EAE0]"
    >
      <header className="sticky top-0 z-10 bg-[#F2EAE0] h-14 flex items-center justify-between px-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2"
          aria-label="Go back"
        >
          <ChevronLeft size={24} className="text-[#1E1E24]" />
        </button>
        <span className="text-[11px] font-semibold text-[#6B6875] tracking-[0.08em] uppercase">
          Note
        </span>
        <button
          onClick={() => setShowShare(true)}
          className="p-2 -mr-2"
          aria-label="Share note"
        >
          <Share2 size={20} className="text-[#6B6875]" />
        </button>
      </header>

      <main className="px-5 pb-8 max-w-3xl mx-auto">
        <h2 className="text-[28px] font-bold text-[#1E1E24] tracking-[-0.02em] leading-tight">
          {note.title}
        </h2>
        <p className="text-[12px] text-[#6B6875] mt-1">
          {getRelativeTime(note.createdAt)}
        </p>

        <div className="mt-5 space-y-3">
          <SummaryCard summary={note.summary} index={0} />
          <TasksCard tasks={note.tasks} onUpdate={handleTasksUpdate} index={1} />
          <FactsCard facts={note.facts} index={2} />
          <QuestionsCard questions={note.questions} onUpdate={handleQuestionsUpdate} index={3} />
        </div>

        <button
          onClick={() => setShowDelete(true)}
          className="mt-8 w-full py-3 text-[15px] text-[#E07A5F] text-center flex items-center justify-center gap-2"
        >
          <Trash2 size={16} />
          Delete Note
        </button>
      </main>

      <BottomSheet isOpen={showShare} onClose={() => setShowShare(false)} title="Share">
        <div className="space-y-1">
          <button
            onClick={handleCopy}
            className="w-full flex items-center gap-3 h-[52px] px-2 rounded-xl hover:bg-[#F2EAE0] transition-colors text-left"
          >
            <Share2 size={20} className="text-[#9B8EC7]" />
            <span className="text-[15px] text-[#1E1E24]">Copy to Clipboard</span>
          </button>
          <button
            onClick={handleExport}
            className="w-full flex items-center gap-3 h-[52px] px-2 rounded-xl hover:bg-[#F2EAE0] transition-colors text-left"
          >
            <Share2 size={20} className="text-[#9B8EC7]" />
            <span className="text-[15px] text-[#1E1E24]">Export as Text</span>
          </button>
        </div>
      </BottomSheet>

      <BottomSheet isOpen={showDelete} onClose={() => setShowDelete(false)}>
        <div className="text-center py-4">
          <h3 className="text-[16px] font-semibold text-[#1E1E24]">
            Delete this note?
          </h3>
          <p className="text-[12px] text-[#6B6875] mt-1">
            This can&apos;t be undone
          </p>
          <div className="flex gap-3 mt-6">
            <Button variant="secondary" fullWidth onClick={() => setShowDelete(false)}>
              Cancel
            </Button>
            <Button variant="danger" fullWidth onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </BottomSheet>
    </motion.div>
  );
}
