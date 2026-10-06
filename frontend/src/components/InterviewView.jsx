import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Send, 
  Clock, 
  Sparkles, 
  HelpCircle, 
  Lightbulb, 
  RotateCcw, 
  BrainCircuit, 
  Check, 
  Flame,
  FileEdit
} from 'lucide-react';

export default function InterviewView({
  sessionData,
  currentQuestion,
  questionIndex,
  totalQuestions,
  onSubmitAnswer,
  isEvaluating
}) {
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState(null);
  const recognitionRef = useRef(null);

  // Timer
  useEffect(() => {
    setSecondsElapsed(0);
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [questionIndex]);

  // Speech Recognition setup (Web Speech API)
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setCandidateAnswer((prev) => {
          // If interim, append smoothly
          return prev ? `${prev} ${currentTranscript}`.replace(/\s+/g, ' ') : currentTranscript;
        });
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setSpeechError('Microphone permission denied. You can continue typing your answer.');
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechError('Speech recognition is not supported in this browser. Please type your response.');
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please type your answer.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setSpeechError(null);
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    }
  };

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const wordCount = candidateAnswer.trim() ? candidateAnswer.trim().split(/\s+/).length : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!candidateAnswer.trim() || isEvaluating) return;
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    onSubmitAnswer(candidateAnswer);
  };

  // Quick helper to fill a sample answer for testing
  const fillSampleAnswer = () => {
    const sample = `In my previous role, we designed a high-throughput caching and sync service using Redis and WebSocket connections. When users updated their profile, we used optimistic client-side updates to immediately reflect the state in the UI, while sending an asynchronous event via an Apache Kafka queue to propagate updates to our PostgreSQL database. To avoid race conditions, we utilized distributed idempotency keys and version-based optimistic locking. This brought our average response latency down from 480ms to 45ms while maintaining 99.99% data consistency during high-load traffic surges.`;
    setCandidateAnswer(sample);
  };

  const progressPercentage = Math.round(((questionIndex + 1) / totalQuestions) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      
      {/* Top Session Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] mb-2 font-mono">
          <div className="flex items-center gap-2">
            <span className="badge badge-indigo">
              {sessionData.role}
            </span>
            <span className="badge badge-cyan">
              {sessionData.mode} Mode
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">
              Question {questionIndex + 1} of {totalQuestions}
            </span>
            <span>({progressPercentage}%)</span>
          </div>
        </div>
        <div className="w-full h-2 bg-[var(--bg-card-subtle)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Gemma Adaptive Reason Banner (If present) */}
      {currentQuestion?.adaptiveReason && (
        <div className="mb-4 p-3.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn">
          <BrainCircuit className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white mr-1.5">Gemma Adaptive Reasoning:</span>
            <span>{currentQuestion.adaptiveReason}</span>
          </div>
        </div>
      )}

      {/* Question Card */}
      <div className="glass-panel-glow p-6 sm:p-8 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <span className="badge badge-cyan text-xs">
            {currentQuestion?.category || 'Interview Question'}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Time Elapsed: {formatTimer(secondsElapsed)}</span>
          </div>
        </div>

        {/* Question Text */}
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-relaxed mb-6">
          {currentQuestion?.question}
        </h2>

        {/* Interviewer Intent & Tip */}
        <div className="space-y-2.5 pt-4 border-t border-[var(--border-subtle)]">
          {currentQuestion?.interviewerIntent && (
            <div className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
              <HelpCircle className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-300">Interviewer Intent: </strong>
                {currentQuestion.interviewerIntent}
              </div>
            </div>
          )}

          {currentQuestion?.tipForCandidate && (
            <div className="flex items-start gap-2 text-xs text-emerald-400/90">
              <Lightbulb className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-300">Coach Tip: </strong>
                {currentQuestion.tipForCandidate}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Answer Formulation Area */}
      <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 space-y-4">
        
        {/* Answer Controls & Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileEdit className="w-4 h-4 text-indigo-400" />
            <label className="text-sm font-bold text-white uppercase tracking-wider">
              Your Answer
            </label>
          </div>

          <div className="flex items-center gap-2">
            {/* Sample filler for hackathon testing */}
            <button
              type="button"
              onClick={fillSampleAnswer}
              className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1"
              title="Paste a demo answer to quickly test Gemma evaluation"
            >
              <Sparkles className="w-3 h-3" />
              Demo Answer
            </button>

            {/* Clear */}
            {candidateAnswer && (
              <button
                type="button"
                onClick={() => setCandidateAnswer('')}
                className="text-xs text-slate-500 hover:text-slate-400 flex items-center gap-1 ml-2"
              >
                <RotateCcw className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            value={candidateAnswer}
            onChange={(e) => setCandidateAnswer(e.target.value)}
            disabled={isEvaluating}
            rows={7}
            placeholder="Type your response here, or click 'Start Voice Answer' below to speak your answer directly..."
            className="w-full bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] focus:border-indigo-500 rounded-xl p-4 text-sm sm:text-base text-white placeholder-slate-500 outline-none transition leading-relaxed resize-y font-sans"
          />

          {/* Floating Recording Banner inside textarea if active */}
          {isListening && (
            <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-rose-500 recording-pulse" />
              <span>Transcribing your speech in real-time...</span>
            </div>
          )}
        </div>

        {speechError && (
          <p className="text-xs text-amber-400">
            {speechError}
          </p>
        )}

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          
          {/* Left: Speech to Text button + Stats */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={toggleListening}
              disabled={isEvaluating}
              className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
                isListening
                  ? 'border-rose-500 bg-rose-500/20 text-rose-300 shadow-md shadow-rose-500/20'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-card-subtle)] text-slate-300 hover:border-slate-500 hover:text-white'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4 text-rose-400" />
                  <span>Stop Recording</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 text-cyan-400" />
                  <span>Start Voice Answer</span>
                </>
              )}
            </button>

            <span className="text-xs text-[var(--text-muted)] font-mono">
              {wordCount} words ({candidateAnswer.length} chars)
            </span>
          </div>

          {/* Right: Submit Button */}
          <button
            type="submit"
            disabled={!candidateAnswer.trim() || isEvaluating}
            className="btn-primary w-full sm:w-auto px-6 py-2.5 text-sm flex items-center justify-center gap-2"
          >
            {isEvaluating ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Gemma is evaluating your answer...</span>
              </>
            ) : (
              <>
                <span>Submit for Evaluation</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
