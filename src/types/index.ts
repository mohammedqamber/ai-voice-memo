export interface Task {
  id: string;
  text: string;
  completed: boolean;
  deadline: string | null;
}

export interface Fact {
  id: string;
  text: string;
  confidence: number;
}

export interface Question {
  id: string;
  text: string;
  answer: string | null;
}

export interface Note {
  id: string;
  title: string;
  summary: string;
  tasks: Task[];
  facts: Fact[];
  questions: Question[];
  createdAt: number;
  updatedAt: number;
}

export type RecordingState = 'idle' | 'recording' | 'processing' | 'complete';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export type View = 'notes' | 'settings';

export interface GeminiStructuredResponse {
  summary: string;
  tasks: Array<{
    text: string;
    deadline: string | null;
  }>;
  facts: Array<{
    text: string;
    confidence: number;
  }>;
  questions: Array<{
    text: string;
  }>;
}
