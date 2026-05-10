import { lazy, Suspense, useState, useCallback } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { NotesProvider } from "@/hooks/useNotes";
import { ToastProvider } from "@/hooks/useToast";
import { Toast } from "@/components/Toast";
import { BottomNav } from "@/components/BottomNav";
import type { View } from "@/types";

const HomePage = lazy(() => import("@/pages/HomePage"));
const NoteDetailPage = lazy(() => import("@/pages/NoteDetailPage"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));

function AppShell({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<View>("notes");

  const isNoteDetail = location.pathname.startsWith("/note/");

  const handleViewChange = useCallback(
    (view: View) => {
      setActiveView(view);
      if (view === "notes") {
        navigate("/");
      } else if (view === "settings") {
        navigate("/settings");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [navigate],
  );

  const handleRecordClick = useCallback(() => {
    navigate("/");
    setActiveView("notes");
    // Scroll to top to show the recorder
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#F2EAE0]">
      {children}
      <Toast />
      {!isNoteDetail && (
        <BottomNav
          activeView={activeView}
          onViewChange={handleViewChange}
          onRecordClick={handleRecordClick}
        />
      )}
    </div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <NotesProvider>
      <ToastProvider>
        <AppShell>
          <Suspense
            fallback={
              <div className="min-h-screen bg-[#F2EAE0] flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-[#9B8EC7] border-t-transparent animate-spin" />
              </div>
            }
          >
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<HomePage />} />
                <Route path="/note/:id" element={<NoteDetailPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </AnimatePresence>
          </Suspense>
        </AppShell>
      </ToastProvider>
    </NotesProvider>
  );
}
