import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { Note } from '@/types';

interface VoiceNotesDB extends DBSchema {
  notes: {
    key: string;
    value: Note;
    indexes: {
      'by-created': number;
    };
  };
}

const DB_NAME = 'VoiceNotesDB';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<VoiceNotesDB>> | null = null;

function getDB(): Promise<IDBPDatabase<VoiceNotesDB>> {
  if (!dbPromise) {
    dbPromise = openDB<VoiceNotesDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const notesStore = db.createObjectStore('notes', { keyPath: 'id' });
        notesStore.createIndex('by-created', 'createdAt', { unique: false });
      },
    });
  }
  return dbPromise;
}

export async function saveNote(note: Note): Promise<void> {
  const db = await getDB();
  await db.put('notes', note);
}

export async function getAllNotes(): Promise<Note[]> {
  const db = await getDB();
  const notes = await db.getAllFromIndex('notes', 'by-created');
  return notes.reverse();
}

export async function getNoteById(id: string): Promise<Note | undefined> {
  const db = await getDB();
  return db.get('notes', id);
}

export async function deleteNote(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('notes', id);
}

export async function updateNote(note: Note): Promise<void> {
  const db = await getDB();
  note.updatedAt = Date.now();
  await db.put('notes', note);
}
