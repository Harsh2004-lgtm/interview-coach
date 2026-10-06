import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Calendar, 
  Code, 
  MessageSquare, 
  CheckSquare, 
  Zap,
  BookOpen
} from 'lucide-react';

export default function ReportView({ reportData, sessionData, history, onRestart }) {
  const [openQuestionIndex, setOpenQuestionIndex] = useState(0);

  useEffect(() => {
    // Launch celebratory confetti if overall score is 70+
    if (reportData?.overallScore >= 70) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  }, [reportData]);

  if (!reportData) return null;

  const {
    overallScore = 80,
    hiringRecommendation = 'Hire',
    performanceBadge = 'Ready for Role',
    averages = {},
    executiveSummary = '',
    keyStrengths = [],
    areasForImprovement = [],
    recommendedActionPlan = []
  } = reportData;

  const getRecommendationBadge = (rec) => {
    if (rec.toLowerCase().includes('strong hire')) {
      return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
    if (rec.toLowerCase().includes('hire')) {
      return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
    }
    if (rec.toLowerCase().includes('leaning')) {
      return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    }
    return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-indigo">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Interview Assessment Report
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              Powered by Google Gemma 2
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Overall Interview Assessment
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Candidate: <span className="text-white font-semibold">{sessionData?.role}</span> • Level: <span className="text-white font-semibold">{sessionData?.experienceLevel}</span> • Mode: <span className="text-white font-semibold">{sessionData?.mode}</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 no-print">
          <button
            onClick={handlePrint}
            className="btn-secondary text-xs sm:text-sm py-2 px-3.5 flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Save / Print PDF</span>
          </button>
          <button
            onClick={onRestart}
            className="btn-primary text-xs sm:text-sm py-2 px-4 flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>New Mock Interview</span>
          </button>
        </div>
      </div>

      {/* Top Banner: Score & Hiring Recommendation */}
      <div className="glass-panel-glow p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        
        {/* Left: Overall Score Dial */}
        <div className="flex items-center gap-5 justify-center md:justify-start">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-1 flex items-center justify-center shadow-xl shadow-indigo-500/20 flex-shrink-0">
            <div className="w-full h-full bg-[#0E1322] rounded-full flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-white font-mono leading-none">
                {overallScore}
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">/ 100</span>
            </div>
          </div>
          <div>
            <span className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider block">
              Cumulative Rating
            </span>
            <div className={`mt-1 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${getRecommendationBadge(hiringRecommendation)}`}>
              <Award className="w-3.5 h-3.5" />
              <span>{hiringRecommendation}</span>
            </div>
            {performanceBadge && (
              <div className="text-xs text-slate-400 mt-1.5 font-medium">
                {performanceBadge}
              </div>
            )}
          </div>
        </div>

        {/* Middle & Right: Tri-Score Breakdown Cards */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          <div className="p-3.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)]">
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-bold uppercase mb-1">
              <Code className="w-3.5 h-3.5" />
              Technical
            </div>
            <div className="text-2xl font-extrabold text-white font-mono">
              {averages?.technicalKnowledge || '—'}<span className="text-xs text-slate-500 font-normal"> / 10</span>
            </div>
            <div className="w-full h-1 bg-black/40 rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-indigo-500" 
                style={{ width: `${((averages?.technicalKnowledge || 0) / 10) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)]">
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-bold uppercase mb-1">
              <MessageSquare className="w-3.5 h-3.5" />
              Communication
            </div>
            <div className="text-2xl font-extrabold text-white font-mono">
              {averages?.communication || '—'}<span className="text-xs text-slate-500 font-normal"> / 10</span>
            </div>
            <div className="w-full h-1 bg-black/40 rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-cyan-400" 
                style={{ width: `${((averages?.communication || 0) / 10) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)]">
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold uppercase mb-1">
              <CheckSquare className="w-3.5 h-3.5" />
              Answer Quality
            </div>
            <div className="text-2xl font-extrabold text-white font-mono">
              {averages?.answerQuality || '—'}<span className="text-xs text-slate-500 font-normal"> / 10</span>
            </div>
            <div className="w-full h-1 bg-black/40 rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-emerald-400" 
                style={{ width: `${((averages?.answerQuality || 0) / 10) * 100}%` }}
              />
            </div>
          </div>

        </div>

      </div>

      {/* Executive Summary */}
      {executiveSummary && (
        <div className="glass-panel p-6 sm:p-8 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Executive Assessment Summary
          </div>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
            {executiveSummary}
          </p>
        </div>
      )}

      {/* Strengths & Improvement Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Key Strengths */}
        <div className="glass-panel p-6 sm:p-7 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-400 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            Top Core Strengths
          </div>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
            {keyStrengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                  ✓
                </span>
                <span className="leading-relaxed">{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Growth Opportunities */}
        <div className="glass-panel p-6 sm:p-7 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-amber-400 uppercase tracking-wider">
            <AlertCircle className="w-4 h-4" />
            High-Impact Growth Areas
          </div>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
            {areasForImprovement.map((imp, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                  !
                </span>
                <span className="leading-relaxed">{imp}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* 30-Day Preparation Roadmap */}
      {recommendedActionPlan && recommendedActionPlan.length > 0 && (
        <div className="glass-panel p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
            <Calendar className="w-4 h-4 text-cyan-400" />
            Personalized 30-Day Preparation Roadmap
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedActionPlan.map((plan, i) => (
              <div key={i} className="p-4 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="badge badge-cyan text-[10px]">{plan.phase}</span>
                </div>
                <h4 className="text-sm font-bold text-white">{plan.focus}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{plan.action}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Question-by-Question Deep Dive (Accordion) */}
      <div className="glass-panel p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-purple-400" />
            Detailed Question & Answer Transcript ({history?.length || 0} Questions)
          </div>
        </div>

        <div className="space-y-3">
          {(history || []).map((item, idx) => {
            const isOpen = openQuestionIndex === idx;
            const evalItem = item.evaluation;

            return (
              <div 
                key={idx}
                className="border border-[var(--border-subtle)] rounded-xl overflow-hidden bg-[var(--bg-card-subtle)] transition-all"
              >
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => setOpenQuestionIndex(isOpen ? -1 : idx)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-[var(--bg-card-hover)] transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center font-mono">
                      Q{idx + 1}
                    </span>
                    <div>
                      <span className="text-xs text-[var(--text-muted)] font-mono uppercase mr-2">
                        {item.category || 'Question'}
                      </span>
                      <h4 className="text-sm font-bold text-white line-clamp-1">
                        {item.question}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {evalItem?.scores?.overall && (
                      <span className="text-xs font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
                        Score: {evalItem.scores.overall}/10
                      </span>
                    )}
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </button>

                {/* Accordion Content */}
                {isOpen && (
                  <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-card)] space-y-4 text-xs sm:text-sm">
                    {/* Full Question */}
                    <div>
                      <span className="text-slate-400 font-bold uppercase text-[11px] block mb-1">Question:</span>
                      <p className="text-white font-medium">{item.question}</p>
                    </div>

                    {/* Candidate's Answer */}
                    <div className="p-3.5 rounded-lg bg-black/40 border border-slate-800 text-slate-300">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Your Answer:</span>
                      <p className="italic">"{item.candidateAnswer}"</p>
                    </div>

                    {/* Tri-Scores */}
                    {evalItem?.scores && (
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="p-2 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                          <span className="text-[10px] block text-slate-400">Technical</span>
                          <span className="font-bold font-mono text-white">{evalItem.scores.technicalKnowledge}/10</span>
                        </div>
                        <div className="p-2 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
                          <span className="text-[10px] block text-slate-400">Communication</span>
                          <span className="font-bold font-mono text-white">{evalItem.scores.communication}/10</span>
                        </div>
                        <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                          <span className="text-[10px] block text-slate-400">Quality</span>
                          <span className="font-bold font-mono text-white">{evalItem.scores.answerQuality}/10</span>
                        </div>
                      </div>
                    )}

                    {/* Gemma Rewrite */}
                    {evalItem?.betterVersion && (
                      <div className="p-3.5 rounded-lg bg-indigo-950/30 border border-indigo-500/30 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-indigo-300 font-bold text-xs uppercase">
                          <Zap className="w-3.5 h-3.5 text-indigo-400" />
                          Gemma's Enhanced Model Answer
                        </div>
                        <p className="text-indigo-100 text-xs sm:text-sm leading-relaxed">
                          {evalItem.betterVersion}
                        </p>
                      </div>
                    )}

                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Start New Interview CTA */}
      <div className="text-center pt-4 pb-8 no-print">
        <button
          onClick={onRestart}
          className="btn-primary px-8 py-3.5 text-base flex items-center justify-center gap-2 mx-auto"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Practice Another Role or Mode</span>
        </button>
      </div>

    </div>
  );
}
