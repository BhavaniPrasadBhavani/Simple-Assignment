'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { api } from '@/lib/api';

export default function CodeEditor() {
  const { activeSession } = useAppStore();
  const [activeTab, setActiveTab] = useState<'tsx' | 'css'>('tsx');
  const [copied, setCopied] = useState<'tsx' | 'css' | null>(null);

  const copyToClipboard = async (code: string, type: 'tsx' | 'css') => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadCode = async () => {
    if (!activeSession) return;
    
    try {
      const blob = await api.downloadSession(activeSession.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${activeSession.name.replace(/\s+/g, '-').toLowerCase()}-component.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const tsxCode = activeSession?.generated_code?.tsx || '';
  const cssCode = activeSession?.generated_code?.css || '';

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Code Editor Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('tsx')}
            className={`px-3 py-1 text-sm font-medium rounded ${
              activeTab === 'tsx'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
          >
            component.tsx
          </button>
          <button
            onClick={() => setActiveTab('css')}
            className={`px-3 py-1 text-sm font-medium rounded ${
              activeTab === 'css'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
          >
            styles.css
          </button>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => copyToClipboard(activeTab === 'tsx' ? tsxCode : cssCode, activeTab)}
            disabled={!(activeTab === 'tsx' ? tsxCode : cssCode)}
            className="px-3 py-1 text-sm bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {copied === activeTab ? '✓ Copied!' : 'Copy'}
          </button>
          <button
            onClick={downloadCode}
            disabled={!tsxCode && !cssCode}
            className="px-3 py-1 text-sm bg-green-700 text-white hover:bg-green-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Download ZIP
          </button>
        </div>
      </div>

      {/* Code Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'tsx' ? (
          <div className="h-full">
            {tsxCode ? (
              <pre className="h-full overflow-auto p-4 text-sm text-gray-100 bg-gray-900 font-mono">
                <code>{tsxCode}</code>
              </pre>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  <p>No TSX code generated yet</p>
                  <p className="text-sm mt-1">Start a conversation to generate component code</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full">
            {cssCode ? (
              <pre className="h-full overflow-auto p-4 text-sm text-gray-100 bg-gray-900 font-mono">
                <code>{cssCode}</code>
              </pre>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                  </svg>
                  <p>No CSS code generated yet</p>
                  <p className="text-sm mt-1">Start a conversation to generate styles</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
