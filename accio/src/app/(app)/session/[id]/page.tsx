'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { api } from '@/lib/api';
import ChatPanel from '@/components/ChatPanel';
import ComponentPreview from '@/components/ComponentPreview';
import CodeEditor from '@/components/CodeEditor';

export default function SessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;
  
  const {
    activeSession,
    setActiveSession,
    user,
    logout,
  } = useAppStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const loadSession = useCallback(async () => {
    try {
      const session = await api.getSession(sessionId);
      setActiveSession(session);
    } catch (err: unknown) {
      console.error('Failed to load session:', err);
      const error = err as { response?: { status?: number } };
      if (error.response?.status === 404) {
        setError('Session not found');
      } else {
        setError('Failed to load session');
      }
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, setActiveSession]);

  useEffect(() => {
    if (sessionId) {
      loadSession();
    }
  }, [sessionId, loadSession]);

  const goBack = () => {
    router.push('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={goBack}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white shadow-sm border-b flex-shrink-0">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center space-x-4">
              <button
                onClick={goBack}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                {activeSession?.name || 'Component Session'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="lg:hidden bg-gray-100 p-2 rounded-md text-gray-600 hover:text-gray-900"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <span className="text-sm text-gray-600">{user?.email}</span>
              <button
                onClick={() => logout()}
                className="text-sm bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Sidebar */}
        <div className={`${
          sidebarCollapsed ? 'hidden' : 'block'
        } lg:block w-full lg:w-80 xl:w-96 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col`}>
          <ChatPanel />
        </div>

        {/* Main Workspace */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Component Preview */}
          <div className="flex-1 bg-white">
            <ComponentPreview />
          </div>

          {/* Code Editor */}
          <div className="h-1/3 border-t border-gray-200">
            <CodeEditor />
          </div>
        </div>
      </div>
    </div>
  );
}
