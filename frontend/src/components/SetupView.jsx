import React, { useState } from 'react';
import { 
  Briefcase, 
  Layers, 
  Sliders, 
  Sparkles, 
  Code2, 
  Users, 
  GitMerge, 
  HelpCircle,
  ArrowRight,
  Target,
  Zap,
  TrendingUp
} from 'lucide-react';

const PRESET_ROLES = [
  'Full Stack Engineer',
  'Frontend Engineer',
  'Backend Engineer',
  'AI / Machine Learning Engineer',
  'DevOps & Cloud Engineer',
  'Data Scientist',
  'Product Manager',
  'Other / Custom Role'
];

const EXPERIENCE_LEVELS = [
  { id: 'Junior (0-2 yrs)', title: 'Junior / Entry', desc: 'Core fundamentals, code mechanics & eager problem solving' },
  { id: 'Mid-Level (3-5 yrs)', title: 'Mid-Level', desc: 'Feature architecture, trade-offs & production best practices' },
  { id: 'Senior (5+ yrs)', title: 'Senior Engineer', desc: 'System design, scalability, edge cases & technical leadership' },
  { id: 'Staff / Principal (8+ yrs)', title: 'Staff / Principal', desc: 'Org-wide strategy, distributed systems & technical vision' }
];

const INTERVIEW_MODES = [
  {
    id: 'Mixed',
    title: 'Mixed (Recommended)',
    desc: 'Balanced combination of deep technical design and behavioral STAR questions.',
    icon: GitMerge,
    color: 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300'
  },
  {
    id: 'Technical',
    title: 'Technical Deep Dive',
    desc: 'System design, architecture, edge cases, trade-offs, and conceptual accuracy.',
    icon: Code2,
    color: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300'
  },
  {
    id: 'HR',
    title: 'HR & Behavioral',
    desc: 'Situational leadership, conflict resolution, prioritization, and culture fit.',
    icon: Users,
    color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
  }
];

export default function SetupView({ onStart, isLoading }) {
  const [selectedRole, setSelectedRole] = useState('Full Stack Engineer');
  const [customRole, setCustomRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Mid-Level (3-5 yrs)');
  const [mode, setMode] = useState('Mixed');
  const [questionCount, setQuestionCount] = useState(3);

  const effectiveRole = selectedRole === 'Other / Custom Role' ? (customRole.trim() || 'Software Engineer') : selectedRole;

  const handleSubmit = (e) => {
    e.preventDefault();
    onStart({
      role: effectiveRole,
      experienceLevel,
      mode,
      totalQuestions: questionCount
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Hero Heading */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Next-Gen AI Interview Prep
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
          Conduct Adaptive Mock Interviews with <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Google Gemma</span>
        </h1>
        <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
          Tailored questions, speech-to-text answers, granular multi-dimensional scoring, and real-time answer rewrites tailored to your target role.
        </p>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="glass-panel p-4 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Tri-Score Rubric</h4>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Separate marks for Technical Knowledge, Communication, & Answer Quality.
            </p>
          </div>
        </div>

        <div className="glass-panel p-4 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Gemma Rewrites</h4>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Generates an upgraded, high-impact version of your exact answer.
            </p>
          </div>
        </div>

        <div className="glass-panel p-4 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Adaptive Follow-ups</h4>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Gemma analyzes gaps or strength in prior answers to adapt the next question.
            </p>
          </div>
        </div>
      </div>

      {/* Main Configuration Card */}
      <form onSubmit={handleSubmit} className="glass-panel-glow p-6 sm:p-8 space-y-8">
        
        {/* 1. Role Selection */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider mb-3">
            <Briefcase className="w-4 h-4 text-indigo-400" />
            1. Select Target Role
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {PRESET_ROLES.map((role) => (
              <button
                type="button"
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`p-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all text-left flex items-center justify-between ${
                  selectedRole === role
                    ? 'border-indigo-500 bg-indigo-500/20 text-white shadow-md shadow-indigo-500/10'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:border-slate-600 hover:text-white'
                }`}
              >
                <span>{role}</span>
                {selectedRole === role && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
              </button>
            ))}
          </div>

          {selectedRole === 'Other / Custom Role' && (
            <div className="mt-3">
              <input
                type="text"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                placeholder="Enter custom role title (e.g. iOS Engineer, Security Architect)..."
                className="w-full bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition"
                autoFocus
              />
            </div>
          )}
        </div>

        {/* 2. Experience Level */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider mb-3">
            <Layers className="w-4 h-4 text-cyan-400" />
            2. Experience Level
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {EXPERIENCE_LEVELS.map((lvl) => (
              <div
                key={lvl.id}
                onClick={() => setExperienceLevel(lvl.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  experienceLevel === lvl.id
                    ? 'border-cyan-500 bg-cyan-500/15 text-white shadow-md shadow-cyan-500/10'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-white">{lvl.title}</span>
                  <span className="text-[11px] text-cyan-400 font-mono">{lvl.id.split(' ')[1] || ''}</span>
                </div>
                <p className="text-xs text-[var(--text-muted)]">{lvl.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Interview Mode */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider mb-3">
            <Sliders className="w-4 h-4 text-emerald-400" />
            3. Interview Focus Mode
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {INTERVIEW_MODES.map((item) => {
              const Icon = item.icon;
              const isSelected = mode === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setMode(item.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? `${item.color} shadow-lg`
                      : 'border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <Icon className="w-4 h-4" />
                    <span className="font-bold text-sm text-white">{item.title}</span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Number of Questions */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider mb-3">
            <HelpCircle className="w-4 h-4 text-purple-400" />
            4. Session Length
          </label>
          <div className="flex flex-wrap gap-3">
            {[
              { count: 3, label: '3 Questions', desc: 'Express practice (~10 mins)' },
              { count: 5, label: '5 Questions', desc: 'Standard mock (~20 mins)' },
              { count: 8, label: '8 Questions', desc: 'In-depth simulation (~35 mins)' }
            ].map((opt) => (
              <button
                type="button"
                key={opt.count}
                onClick={() => setQuestionCount(opt.count)}
                className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                  questionCount === opt.count
                    ? 'border-purple-500 bg-purple-500/20 text-white shadow-md shadow-purple-500/10'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:border-slate-600 hover:text-white'
                }`}
              >
                <div>{opt.label}</div>
                <div className="text-[10px] text-[var(--text-muted)] font-normal">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[var(--text-muted)] text-center sm:text-left">
            Candidate: <span className="text-white font-semibold">{effectiveRole}</span> ({experienceLevel}) in <span className="text-white font-semibold">{mode}</span> mode.
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full sm:w-auto px-8 py-3 text-base flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Gemma is generating question #1...</span>
              </>
            ) : (
              <>
                <span>Begin Mock Interview</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
