'use client';

import { useMemo, useState } from 'react';
import { useAppStore } from '@/lib/store';

export default function ComponentPreview() {
  const { activeSession } = useAppStore();
  const [showCode, setShowCode] = useState(false);

  // Create a simple HTML representation from the React component
  const createHTMLPreview = (tsxCode: string): string => {
    if (!tsxCode) return '';
    
    try {
      // Extract component content for preview
      let previewHTML = '';
      
      // Look for JSX return statement content
      const returnMatch = tsxCode.match(/return\s*\(([\s\S]*?)\);?\s*}[^}]*$/);
      if (returnMatch) {
        const jsxContent = returnMatch[1].trim();
        
        // Simple JSX to HTML conversion
        previewHTML = jsxContent
          .replace(/className=/g, 'class=')
          .replace(/onClick=/g, 'onclick=')
          .replace(/\{[^}]*\}/g, '') // Remove JSX expressions for now
          .replace(/\/>/g, '>'); // Self-closing tags
      } else {
        // Fallback: create a sample representation
        const componentName = tsxCode.match(/(?:const|function)\s+(\w+)/)?.[1] || 'Component';
        previewHTML = `
          <div class="component-container">
            <h3>${componentName}</h3>
            <p>Interactive component preview</p>
            <button onclick="handleInteraction()">Click me!</button>
          </div>
        `;
      }
      
      return previewHTML;
    } catch (error) {
      console.error('Error creating HTML preview:', error);
      return `
        <div class="error-preview">
          <h3>Preview Error</h3>
          <p>Unable to render component preview</p>
        </div>
      `;
    }
  };

  const iframeContent = useMemo(() => {
    if (!activeSession?.generated_code?.tsx && !activeSession?.generated_code?.css) {
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 40px;
              font-family: system-ui, -apple-system, sans-serif;
              background: #f9fafb;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              color: #6b7280;
            }
            .placeholder {
              text-align: center;
              max-width: 400px;
            }
            .placeholder svg {
              width: 64px;
              height: 64px;
              margin: 0 auto 16px;
              opacity: 0.6;
            }
          </style>
        </head>
        <body>
          <div class="placeholder">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            <h3>Component Preview</h3>
            <p>Your generated component will appear here. Start chatting to create your first component!</p>
          </div>
        </body>
        </html>
      `;
    }

    const tsxCode = activeSession.generated_code.tsx;
    const cssCode = activeSession.generated_code.css;
    
    // Create HTML preview from React code
    const htmlPreview = createHTMLPreview(tsxCode);

    // Create a live interactive preview
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            box-sizing: border-box;
          }
          
          body {
            margin: 0;
            padding: 20px;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #ffffff;
            line-height: 1.6;
          }
          
          /* Apply the generated CSS */
          ${cssCode || ''}
          
          /* Additional preview styles */
          .preview-container {
            min-height: 200px;
            padding: 20px;
          }
          
          .live-indicator {
            position: fixed;
            top: 10px;
            right: 10px;
            background: #10b981;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
            z-index: 1000;
          }
          
          .error-preview {
            background: #fef2f2;
            border: 1px solid #fecaca;
            color: #dc2626;
            padding: 16px;
            border-radius: 8px;
            text-align: center;
          }
          
          /* Default component styles */
          .component-container {
            padding: 20px;
            border-radius: 8px;
            background: #f9fafb;
            border: 1px solid #e5e7eb;
          }
          
          /* Button styles for interaction */
          button {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.2s;
          }
          
          button:hover {
            background: #2563eb;
          }
          
          button:active {
            background: #1d4ed8;
          }
        </style>
      </head>
      <body>
        <div class="live-indicator">● LIVE</div>
        
        <div class="preview-container">
          <div id="component-root">
            ${htmlPreview}
          </div>
        </div>
        
        <script>
          // Add basic interactivity
          function handleInteraction() {
            alert('Component interaction works!');
          }
          
          // Add click handlers to all buttons if not already defined
          document.addEventListener('DOMContentLoaded', function() {
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
              if (!button.onclick) {
                button.onclick = function() {
                  console.log('Button clicked:', this.textContent);
                  this.style.transform = 'scale(0.95)';
                  setTimeout(() => {
                    this.style.transform = 'scale(1)';
                  }, 100);
                };
              }
            });
          });
          
          // Log preview status
          console.log('Live preview loaded successfully');
          console.log('Component HTML:', ${JSON.stringify(htmlPreview)});
        </script>
      </body>
      </html>
    `;
  }, [activeSession?.generated_code]);

  return (
    <div className="h-full flex flex-col">
      {/* Preview Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Component Preview</h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowCode(!showCode)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                showCode 
                  ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {showCode ? 'Hide Code' : 'Show Code'}
            </button>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span>Live Preview</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Frame */}
      <div className="flex-1 bg-gray-100 p-4">
        <div className="h-full bg-white rounded-lg shadow-sm border overflow-hidden">
          <iframe
            srcDoc={iframeContent}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin"
            title="Live Component Preview"
          />
        </div>
      </div>

      {/* Code Panel - Overlay when toggled */}
      {showCode && activeSession?.generated_code && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl max-h-[80vh] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Generated Code</h3>
              <button
                onClick={() => setShowCode(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <div className="space-y-4">
                {activeSession.generated_code.tsx && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">TypeScript/JSX Component:</h4>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{activeSession.generated_code.tsx}</code>
                    </pre>
                  </div>
                )}
                {activeSession.generated_code.css && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">CSS Styles:</h4>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{activeSession.generated_code.css}</code>
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
