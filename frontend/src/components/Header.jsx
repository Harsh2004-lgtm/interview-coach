import React from 'react';
import { Sparkles, Brain, Award, RotateCcw, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function Header({ currentStage, onReset, statusInfo }) {
  return (
    <header className="border-b border-[var(--border-subtle)] bg-[rgba(11,15,25,0.8)] backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-[#0E1322] rounded-[11px] flex items-center justify-center">
              <Brain className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Interview Coach
              </span>
              <span className="badge badge-indigo text-[10px] py-0.5 px-2">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                Gemma 2 Powered
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] hidden sm:block">
              AI-Powered Adaptive Mock Interviews & Evaluation
            </p>
          </div>
        </div>

        {/* Center: Stage Indicator */}
        <div className="hidden md:flex items-center gap-2 text-xs font-semibold">
          <span className={`px-3 py-1 rounded-full transition-all ${
            currentStage === 'setup' 
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40' 
              : 'text-slate-500'
          }`}>
            1. Configure
          </span>
          <span className="text-slate-700">→</span>
          <span className={`px-3 py-1 rounded-full transition-all ${
            currentStage === 'interview' 
              ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/40' 
              : 'text-slate-500'
          }`}>
            2. Mock Interview
          </span>
          <span className="text-slate-700">→</span>
          <span className={`px-3 py-1 rounded-full transition-all ${
            currentStage === 'report' 
              ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40' 
              : 'text-slate-500'
          }`}>
            3. Final Report
          </span>
        </div>

        {/* Right Actions & Status */}
        <div className="flex items-center gap-3">
          {statusInfo && (
            <div 
              className={`hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border ${
                statusInfo.ready 
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' 
                  : 'border-amber-500/30 bg-amber-500/10 text-amber-300'
              }`}
              title={statusInfo.ready ? 'Live Gemma API Active' : 'Running in local fallback mock mode'}
            >
              <span className={`w-2 h-2 rounded-full ${statusInfo.ready ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="font-mono text-[11px]">
                {statusInfo.model || 'gemma-2-9b'}
              </span>
            </div>
          )}

          {currentStage !== 'setup' && (
            <button
              onClick={onReset}
              className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 text-slate-300 hover:text-white"
              title="Start a new interview session"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Session</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
