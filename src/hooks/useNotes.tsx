import { useState, useEffect, useCallback, useContext, createContext } from 'react';
import type { Note } from '@/types';
import { saveNote, getAllNotes, getNoteById, deleteNote, updateNote } from '@/features/notes/storage';

interface NotesContextValue {
  notes: Note[];
  isLoading: boolean;
  addNote: (note: Note) => Promise<void>;
  removeNote: (id: string) => Promise<void>;
  editNote: (note: Note) => Promise<void>;
  getNote: (id: string) => Promise<Note | undefined>;
  refreshNotes: () => Promise<void>;
}

const NotesContext = createContext<NotesContextValue | null>(null);

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshNotes = useCallback(async () => {
    setIsLoading(true);
    try {
      const allNotes = await getAllNotes();
      setNotes(allNotes);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshNotes();
  }, [refreshNotes]);

  const addNote = useCallback(async (note: Note) => {
    await saveNote(note);
    setNotes((prev) => [note, ...prev]);
  }, []);

  const removeNote = useCallback(async (id: string) => {
    await deleteNote(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const editNote = useCallback(async (note: Note) => {
    await updateNote(note);
    setNotes((prev) => prev.map((n) => (n.id === note.id ? note : n)));
  }, []);

  const getNote = useCallback(async (id: string) => {
    const found = notes.find((n) => n.id === id);
    if (found) return found;
    return getNoteById(id);
  }, [notes]);

  return (
    <NotesContext.Provider value={{ notes, isLoading, addNote, removeNote, editNote, getNote, refreshNotes }}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes(): NotesContextValue {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error('useNotes must be used within NotesProvider');
  return ctx;
}
