import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SetupView from './components/SetupView';
import InterviewView from './components/InterviewView';
import EvaluationModal from './components/EvaluationModal';
import ReportView from './components/ReportView';
import { 
  fetchStatus, 
  startInterview, 
  evaluateAnswer, 
  getNextQuestion, 
  getFinalReport 
} from './services/api';
import { AlertTriangle, X } from 'lucide-react';

export default function App() {
  const [currentStage, setCurrentStage] = useState('setup'); // 'setup' | 'interview' | 'report'
  const [sessionData, setSessionData] = useState({
    role: 'Full Stack Engineer',
    experienceLevel: 'Mid-Level (3-5 yrs)',
    mode: 'Mixed',
    totalQuestions: 3
  });

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentEvaluation, setCurrentEvaluation] = useState(null);
  const [lastSubmittedAnswer, setLastSubmittedAnswer] = useState('');
  const [history, setHistory] = useState([]);
  const [reportData, setReportData] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [statusInfo, setStatusInfo] = useState(null);

  // Check backend & Gemma provider status on mount
  useEffect(() => {
    fetchStatus()
      .then((data) => setStatusInfo(data))
      .catch((err) => {
        console.warn('Backend status check failed:', err.message);
        setStatusInfo({ provider: 'Local Mock Generator', model: 'gemma-2-9b-fallback', ready: false });
      });
  }, []);

  // 1. Handle Start Interview
  const handleStartInterview = async (config) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      setSessionData(config);
      const res = await startInterview(config);
      if (res.success && res.currentQuestion) {
        setCurrentQuestion(res.currentQuestion);
        setQuestionIndex(0);
        setHistory([]);
        setCurrentEvaluation(null);
        setCurrentStage('interview');
      } else {
        throw new Error('Failed to retrieve initial question from Gemma.');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to start interview. Check backend server.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Handle Candidate Answer Submission
  const handleSubmitAnswer = async (answer) => {
    setIsEvaluating(true);
    setErrorMessage(null);
    setLastSubmittedAnswer(answer);
    try {
      const res = await evaluateAnswer({
        role: sessionData.role,
        experienceLevel: sessionData.experienceLevel,
        mode: sessionData.mode,
        question: currentQuestion.question,
        candidateAnswer: answer,
        questionIndex
      });

      if (res.success && res.evaluation) {
        setCurrentEvaluation(res.evaluation);
      } else {
        throw new Error('Gemma evaluation failed.');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to evaluate answer.');
    } finally {
      setIsEvaluating(false);
    }
  };

  // 3. Handle Proceed (Next Question or Final Report)
  const handleProceedAfterEvaluation = async () => {
    const isLast = questionIndex + 1 >= sessionData.totalQuestions;

    // Record question, answer, and evaluation into history
    const updatedHistory = [
      ...history,
      {
        questionNumber: questionIndex + 1,
        category: currentQuestion.category,
        question: currentQuestion.question,
        candidateAnswer: lastSubmittedAnswer,
        evaluation: currentEvaluation
      }
    ];
    setHistory(updatedHistory);

    if (isLast) {
      // Last question reached -> generate overall report
      setIsLoadingNext(true);
      try {
        const repRes = await getFinalReport({
          role: sessionData.role,
          experienceLevel: sessionData.experienceLevel,
          mode: sessionData.mode,
          history: updatedHistory
        });

        if (repRes.success && repRes.report) {
          setReportData(repRes.report);
          setCurrentEvaluation(null);
          setCurrentStage('report');
        } else {
          throw new Error('Failed to compile final report.');
        }
      } catch (err) {
        console.error(err);
        setErrorMessage(err.message || 'Failed to generate final report.');
      } finally {
        setIsLoadingNext(false);
      }
    } else {
      // Generate adaptive next question
      setIsLoadingNext(true);
      try {
        const nextRes = await getNextQuestion({
          role: sessionData.role,
          experienceLevel: sessionData.experienceLevel,
          mode: sessionData.mode,
          previousQuestion: currentQuestion.question,
          candidateAnswer: lastSubmittedAnswer,
          previousEvaluation: currentEvaluation,
          history: updatedHistory,
          questionIndex: questionIndex + 1,
          totalQuestions: sessionData.totalQuestions
        });

        if (nextRes.success && nextRes.nextQuestion) {
          setCurrentQuestion(nextRes.nextQuestion);
          setQuestionIndex((prev) => prev + 1);
          setCurrentEvaluation(null);
        } else {
          throw new Error('Failed to generate adaptive next question.');
        }
      } catch (err) {
        console.error(err);
        setErrorMessage(err.message || 'Failed to fetch next question.');
      } finally {
        setIsLoadingNext(false);
      }
    }
  };

  // 4. Reset Session
  const handleResetSession = () => {
    if (currentStage === 'interview' && !window.confirm('Are you sure you want to abandon the current interview and start over?')) {
      return;
    }
    setCurrentStage('setup');
    setCurrentQuestion(null);
    setQuestionIndex(0);
    setCurrentEvaluation(null);
    setHistory([]);
    setReportData(null);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-primary)]">
      
      {/* Top Navigation */}
      <Header 
        currentStage={currentStage} 
        onReset={handleResetSession} 
        statusInfo={statusInfo} 
      />

      {/* Error Toast / Alert */}
      {errorMessage && (
        <div className="max-w-4xl mx-auto px-4 mt-4 w-full">
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button 
              onClick={() => setErrorMessage(null)} 
              className="text-rose-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center">
        {currentStage === 'setup' && (
          <SetupView 
            onStart={handleStartInterview} 
            isLoading={isLoading} 
          />
        )}

        {currentStage === 'interview' && currentQuestion && (
          <InterviewView
            sessionData={sessionData}
            currentQuestion={currentQuestion}
            questionIndex={questionIndex}
            totalQuestions={sessionData.totalQuestions}
            onSubmitAnswer={handleSubmitAnswer}
            isEvaluating={isEvaluating}
          />
        )}

        {currentStage === 'report' && (
          <ReportView
            reportData={reportData}
            sessionData={sessionData}
            history={history}
            onRestart={handleResetSession}
          />
        )}
      </main>

      {/* Post-Answer Evaluation Modal */}
      {currentEvaluation && (
        <EvaluationModal
          evaluation={currentEvaluation}
          question={currentQuestion?.question}
          candidateAnswer={lastSubmittedAnswer}
          isLastQuestion={questionIndex + 1 >= sessionData.totalQuestions}
          onProceed={handleProceedAfterEvaluation}
          isLoadingNext={isLoadingNext}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-[var(--border-subtle)] py-4 text-center text-xs text-[var(--text-muted)] no-print">
        <p>Built with Google Gemma • React • Node.js & Express • Hackathon Edition</p>
      </footer>

    </div>
  );
}
