import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface Session {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  chat_history?: ChatMessage[];
  generated_code?: {
    tsx: string;
    css: string;
  };
  ui_editor_state?: Record<string, unknown>;
}

interface AppState {
  // Authentication
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  
  // Sessions
  sessions: Session[];
  activeSession: Session | null;
  
  // UI State
  isGenerating: boolean;
  
  // Actions
  login: (token: string, user: User) => void;
  logout: () => void;
  setSessions: (sessions: Session[]) => void;
  setActiveSession: (session: Session | null) => void;
  updateActiveSession: (updates: Partial<Session>) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  addChatMessage: (message: ChatMessage) => void;
  updateLastMessage: (content: string) => void;
  setGeneratedCode: (code: { tsx: string; css: string }) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      sessions: [],
      activeSession: null,
      isGenerating: false,

      // Actions
      login: (token: string, user: User) => {
        set({
          token,
          user,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          sessions: [],
          activeSession: null,
        });
      },

      setSessions: (sessions: Session[]) => {
        set({ sessions });
      },

      setActiveSession: (session: Session | null) => {
        set({ activeSession: session });
      },

      updateActiveSession: (updates: Partial<Session>) => {
        const { activeSession } = get();
        if (activeSession) {
          const updatedSession = { ...activeSession, ...updates };
          set({ activeSession: updatedSession });
        }
      },

      setIsGenerating: (isGenerating: boolean) => {
        set({ isGenerating });
      },

      addChatMessage: (message: ChatMessage) => {
        const { activeSession } = get();
        if (activeSession) {
          const updatedSession = {
            ...activeSession,
            chat_history: [...(activeSession.chat_history || []), message],
          };
          set({ activeSession: updatedSession });
        }
      },

      updateLastMessage: (content: string) => {
        const { activeSession } = get();
        if (activeSession && activeSession.chat_history) {
          const chatHistory = [...activeSession.chat_history];
          if (chatHistory.length > 0) {
            chatHistory[chatHistory.length - 1] = {
              ...chatHistory[chatHistory.length - 1],
              content,
            };
            const updatedSession = {
              ...activeSession,
              chat_history: chatHistory,
            };
            set({ activeSession: updatedSession });
          }
        }
      },

      setGeneratedCode: (code: { tsx: string; css: string }) => {
        const { activeSession } = get();
        if (activeSession) {
          const updatedSession = {
            ...activeSession,
            generated_code: code,
          };
          set({ activeSession: updatedSession });
        }
      },
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
