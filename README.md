# Voice Notes

A cognitive offloading tool that transforms unstructured speech into organized, actionable notes.

## What It Does

1. **Tap the mic** and start talking naturally
2. **Real-time transcription** using your browser's built-in speech recognition
3. **AI structuring** — sends text to Gemini to extract: summary, action items, key facts, open questions
4. **Organized notes** stored locally in your browser (IndexedDB)

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Framer Motion (animations)
- Google Gemini SDK
- IndexedDB (local storage)
- Web Speech API (browser-native transcription)

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Button.tsx
│   ├── BottomNav.tsx
│   ├── BottomSheet.tsx
│   ├── EmptyState.tsx
│   ├── NoteCard.tsx
│   ├── SearchBar.tsx
│   ├── SkeletonCard.tsx
│   └── Toast.tsx
├── features/            # Feature-based modules
│   ├── ai/
│   │   └── services/
│   │       └── geminiService.ts
│   ├── notes/
│   │   ├── components/
│   │   │   ├── FactsCard.tsx
│   │   │   ├── QuestionsCard.tsx
│   │   │   ├── SummaryCard.tsx
│   │   │   └── TasksCard.tsx
│   │   └── storage.ts
│   └── recorder/
│       ├── components/
│       │   ├── CircularProgress.tsx
│       │   ├── ProcessingIndicator.tsx
│       │   ├── PulseRings.tsx
│       │   ├── Recorder.tsx
│       │   └── TranscriptionPreview.tsx
│       └── hooks/
│           └── useSpeechRecognition.ts
├── hooks/               # Global hooks
│   ├── useNotes.tsx
│   └── useToast.tsx
├── pages/               # Route-level pages
│   ├── HomePage.tsx
│   ├── NoteDetailPage.tsx
│   └── SettingsPage.tsx
├── types/               # Shared TypeScript types
│   └── index.ts
├── App.tsx
├── main.tsx
└── index.css
```

## Getting Started

### Option 1: API Key via Settings (Recommended)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the dev server:
   ```bash
   npm run dev
   ```

3. Open the app, go to **Settings**, and paste your Gemini API key

### Option 2: API Key via .env File

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Add your Gemini API key to `.env`:
   ```
   VITE_GEMINI_API_KEY=your_key_here
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the dev server:
   ```bash
   npm run dev
   ```

### Building for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

## How It Works

1. **Voice Capture**: Uses the browser's native Web Speech API (`SpeechRecognition`) — no audio is stored or sent anywhere.

2. **AI Processing**: Only the transcribed text is sent to Google's Gemini API with a specialized structuring prompt.

3. **Local Storage**: All notes are stored in your browser's IndexedDB. Nothing is stored on any server.

4. **Privacy**: Your API key and notes never leave your device except for the Gemini API call.

## Requirements

- Modern browser with SpeechRecognition support (Chrome, Edge recommended)
- A Google Gemini API key (free tier available)

## Keyboard Shortcuts (Desktop)

| Key | Action |
|-----|--------|
| `Cmd/Ctrl + K` | Focus search |
| `Escape` | Close sheets |
