import React, { useState } from 'react';
import { 
  FileCode, 
  Copy, 
  Check, 
  Server, 
  Smartphone, 
  Container, 
  Database 
} from 'lucide-react';
import { codeSnippets } from '../data/codeSnippets';

export default function CodeExporter() {
  
  // States
  const [activeCategory, setActiveCategory] = useState<'laravel' | 'flutter' | 'docker'>('laravel');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Trigger copy
  const triggerCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const selectedSnippets = codeSnippets[activeCategory] || [];

  return (
    <div className="space-y-6" id="code-exporter">
      {/* Title */}
      <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
          <FileCode className="h-5 w-5 text-indigo-600 animate-pulse" />
          Production-Ready Code &amp; API Exporter
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Export full-featured backend schemas, secure JWT validation pipelines, Flutter SFA models, and containerized deployment infrastructure.
        </p>
      </div>

      {/* Categories Toggle tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-xl text-xs font-bold gap-2 max-w-lg">
        <button 
          onClick={() => setActiveCategory('laravel')}
          className={`flex-1 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all ${
            activeCategory === 'laravel' ? 'bg-white text-indigo-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Server className="h-4 w-4" /> Laravel API Backend
        </button>

        <button 
          onClick={() => setActiveCategory('flutter')}
          className={`flex-1 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all ${
            activeCategory === 'flutter' ? 'bg-white text-indigo-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Smartphone className="h-4 w-4" /> Flutter Mobile SFA
        </button>

        <button 
          onClick={() => setActiveCategory('docker')}
          className={`flex-1 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all ${
            activeCategory === 'docker' ? 'bg-white text-indigo-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Container className="h-4 w-4" /> Cloud Deployment (AWS)
        </button>
      </div>

      {/* Code Blocks Container */}
      <div className="space-y-6">
        {selectedSnippets.map((snip, index) => {
          const uniqueId = `${activeCategory}-${index}`;
          const isCopied = copiedId === uniqueId;

          return (
            <div key={index} className="bg-slate-950 rounded-2xl border border-slate-800 shadow-lg overflow-hidden flex flex-col">
              
              {/* Header */}
              <div className="bg-slate-900 px-5 py-3.5 border-b border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <h5 className="font-black text-slate-100">{snip.title}</h5>
                  <span className="font-mono text-slate-500 block mt-0.5">{snip.filename}</span>
                </div>
                <button 
                  onClick={() => triggerCopy(uniqueId, snip.code)}
                  className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-all ${
                    isCopied 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="h-3.5 w-3.5" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" /> Copy Code
                    </>
                  )}
                </button>
              </div>

              {/* Code Pre container */}
              <div className="p-5 overflow-auto max-h-[450px]">
                <pre className="text-xs font-mono text-emerald-400 leading-relaxed select-all">
                  <code>{snip.code}</code>
                </pre>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
