import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ArrowRight, 
  Award, 
  Eye, 
  Code, 
  MessageSquare, 
  CheckSquare, 
  Zap,
  TrendingUp,
  BrainCircuit
} from 'lucide-react';

export default function EvaluationModal({
  evaluation,
  question,
  candidateAnswer,
  isLastQuestion,
  onProceed,
  isLoadingNext
}) {
  const [showOriginal, setShowOriginal] = useState(false);

  if (!evaluation) return null;

  const { scores, feedbackSummary, strengths = [], improvements = [], betterVersion, depthAssessment } = evaluation;

  const getScoreColor = (score) => {
    if (score >= 8.0) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (score >= 6.5) return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
    if (score >= 5.0) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  const getScoreBarColor = (score) => {
    if (score >= 8.0) return 'bg-emerald-400';
    if (score >= 6.5) return 'bg-cyan-400';
    if (score >= 5.0) return 'bg-amber-400';
    return 'bg-rose-400';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-panel-glow w-full max-w-4xl my-8 p-6 sm:p-8 space-y-6 animate-fadeIn">
        
        {/* Header with Overall Score */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[var(--border-subtle)]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge badge-indigo">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Gemma Evaluation
              </span>
              {depthAssessment && (
                <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  Depth: {depthAssessment}
                </span>
              )}
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">Answer Evaluation & Feedback</h3>
          </div>

          {/* Overall Score Badge */}
          <div className="flex items-center gap-3 bg-[var(--bg-card-subtle)] px-4 py-2.5 rounded-2xl border border-[var(--border-subtle)]">
            <Award className="w-7 h-7 text-indigo-400" />
            <div>
              <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-bold">Overall Score</div>
              <div className="text-2xl font-extrabold text-white leading-none font-mono">
                {scores?.overall || '—'}<span className="text-xs text-slate-500"> / 10</span>
              </div>
            </div>
          </div>
        </div>

        {/* 1. Tri-Score Dimension Breakdown */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Core Evaluation Rubric
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Technical Knowledge */}
            <div className={`p-4 rounded-xl border ${getScoreColor(scores?.technicalKnowledge || 0)}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Technical Knowledge</span>
                </div>
                <span className="text-lg font-extrabold font-mono">{scores?.technicalKnowledge || 0}</span>
              </div>
              <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden mb-2">
                <div 
                  className={`h-full ${getScoreBarColor(scores?.technicalKnowledge || 0)}`}
                  style={{ width: `${((scores?.technicalKnowledge || 0) / 10) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-300">Technical depth, terminology & trade-offs</p>
            </div>

            {/* Communication */}
            <div className={`p-4 rounded-xl border ${getScoreColor(scores?.communication || 0)}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Communication</span>
                </div>
                <span className="text-lg font-extrabold font-mono">{scores?.communication || 0}</span>
              </div>
              <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden mb-2">
                <div 
                  className={`h-full ${getScoreBarColor(scores?.communication || 0)}`}
                  style={{ width: `${((scores?.communication || 0) / 10) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-300">Structure, articulation & conciseness</p>
            </div>

            {/* Answer Quality */}
            <div className={`p-4 rounded-xl border ${getScoreColor(scores?.answerQuality || 0)}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Answer Quality</span>
                </div>
                <span className="text-lg font-extrabold font-mono">{scores?.answerQuality || 0}</span>
              </div>
              <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden mb-2">
                <div 
                  className={`h-full ${getScoreBarColor(scores?.answerQuality || 0)}`}
                  style={{ width: `${((scores?.answerQuality || 0) / 10) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-300">Relevance, completeness & real examples</p>
            </div>

          </div>
        </div>

        {/* Executive Verdict */}
        {feedbackSummary && (
          <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs sm:text-sm text-slate-300">
            <span className="font-bold text-white">Gemma Verdict: </span>
            {feedbackSummary}
          </div>
        )}

        {/* Strengths & Improvements Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Strengths */}
          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2.5">
              <CheckCircle2 className="w-4 h-4" />
              Key Strengths
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {strengths.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Improvements */}
          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2.5">
              <AlertCircle className="w-4 h-4" />
              Growth Opportunities
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {improvements.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* 2. Better Version of Answer (Gemma Rewrite) */}
        {betterVersion && (
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-slate-900 border border-indigo-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-indigo-400" />
                <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                  Gemma's Enhanced Model Answer
                </h4>
              </div>

              <button
                type="button"
                onClick={() => setShowOriginal(!showOriginal)}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{showOriginal ? 'Hide Original' : 'Compare Original'}</span>
              </button>
            </div>

            {/* Comparison view if toggled */}
            {showOriginal && (
              <div className="p-3.5 rounded-xl bg-black/40 border border-slate-700/60 text-xs text-slate-400">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Your Original Answer:</span>
                <p className="italic">"{candidateAnswer}"</p>
              </div>
            )}

            {/* Enhanced Answer */}
            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-xs sm:text-sm text-indigo-100 leading-relaxed font-sans">
              <p>{betterVersion}</p>
            </div>
            
            <p className="text-[11px] text-[var(--text-muted)] flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Gemma retained your core narrative while elevating technical rigor, structured metrics, and clarity.</span>
            </p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-end gap-3">
          <button
            onClick={onProceed}
            disabled={isLoadingNext}
            className="btn-primary w-full sm:w-auto px-7 py-3 text-sm flex items-center justify-center gap-2"
          >
            {isLoadingNext ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Gemma is preparing the next adaptive question...</span>
              </>
            ) : isLastQuestion ? (
              <>
                <span>Generate Overall Interview Report</span>
                <Award className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Next Adaptive Question</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
