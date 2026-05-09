import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Recorder } from '@/features/recorder/components/Recorder';
import { NoteCard } from '@/components/NoteCard';
import { SkeletonCard } from '@/components/SkeletonCard';
import { EmptyState } from '@/components/EmptyState';
import { SearchBar } from '@/components/SearchBar';
import { useNotes } from '@/hooks/useNotes';
import { useToast } from '@/hooks/useToast';
import { structureNoteWithFallback } from '@/features/ai/services/geminiService';
import { getStoredApiKey } from '@/features/ai/services/geminiService';
import type { Note } from '@/types';

export default function HomePage() {
  const { notes, isLoading, addNote } = useNotes();
  const { addToast } = useToast();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;
    const q = searchQuery.toLowerCase();
    return notes.filter((note) => {
      const inTitle = note.title.toLowerCase().includes(q);
      const inSummary = note.summary.toLowerCase().includes(q);
      const inTasks = note.tasks.some((t) => t.text.toLowerCase().includes(q));
      const inFacts = note.facts.some((f) => f.text.toLowerCase().includes(q));
      const inQuestions = note.questions.some((qst) => qst.text.toLowerCase().includes(q));
      return inTitle || inSummary || inTasks || inFacts || inQuestions;
    });
  }, [notes, searchQuery]);

  const handleTranscriptionComplete = useCallback(async (text: string) => {
    const apiKey = getStoredApiKey();
    if (!apiKey) {
      addToast({
        type: 'error',
        message: 'Please add your Gemini API key in Settings',
      });
      return;
    }

    try {
      const structured = await structureNoteWithFallback(text);
      const note: Note = {
        id: crypto.randomUUID(),
        ...structured,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      await addNote(note);
      addToast({
        type: 'success',
        message: 'Note created!',
      });
    } catch {
      addToast({
        type: 'error',
        message: 'Failed to create note. Check your API key.',
      });
    } finally {
      // Processing complete
    }
  }, [addNote, addToast]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-10 bg-[#F2EAE0] px-5 py-4">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <h1 className="text-[20px] font-semibold text-[#9B8EC7] tracking-[-0.01em] font-serif">
            Voice Notes
          </h1>
          <SearchBar
            isOpen={searchOpen}
            onToggle={() => setSearchOpen(!searchOpen)}
            onSearch={handleSearch}
            onClear={handleClearSearch}
          />
        </div>
      </header>

      <main className="px-5 max-w-3xl mx-auto">
        <Recorder
          onTranscriptionComplete={handleTranscriptionComplete}
        />

        <div className="mt-6">
          <span className="text-[11px] font-semibold text-[#6B6875] tracking-[0.08em] uppercase">
            Recent Notes
          </span>

          {isLoading ? (
            <div className="mt-3 space-y-3">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : filteredNotes.length === 0 ? (
            <EmptyState
              title={searchQuery ? 'No matching notes' : 'Your organized thoughts will appear here'}
              subtitle={searchQuery ? 'Try a different search term' : 'Tap the mic to capture your first note'}
            />
          ) : (
            <motion.div className="mt-3 space-y-3" layout>
              <AnimatePresence mode="popLayout">
                {filteredNotes.map((note, index) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    index={index}
                    highlight={searchQuery.length > 0}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
