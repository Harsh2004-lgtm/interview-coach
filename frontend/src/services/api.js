const BASE_URL = '/api/interview';

export async function fetchStatus() {
  const res = await fetch(`${BASE_URL}/status`);
  if (!res.ok) throw new Error(`Status check failed: ${res.statusText}`);
  return res.json();
}

export async function startInterview({ role, experienceLevel, mode, totalQuestions }) {
  const res = await fetch(`${BASE_URL}/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role, experienceLevel, mode, totalQuestions })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to start interview (${res.status})`);
  }
  return res.json();
}

export async function evaluateAnswer({ role, experienceLevel, mode, question, candidateAnswer, questionIndex }) {
  const res = await fetch(`${BASE_URL}/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role, experienceLevel, mode, question, candidateAnswer, questionIndex })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to evaluate answer (${res.status})`);
  }
  return res.json();
}

export async function getNextQuestion({
  role,
  experienceLevel,
  mode,
  previousQuestion,
  candidateAnswer,
  previousEvaluation,
  history,
  questionIndex,
  totalQuestions
}) {
  const res = await fetch(`${BASE_URL}/next`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      role,
      experienceLevel,
      mode,
      previousQuestion,
      candidateAnswer,
      previousEvaluation,
      history,
      questionIndex,
      totalQuestions
    })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to generate next question (${res.status})`);
  }
  return res.json();
}

export async function getFinalReport({ role, experienceLevel, mode, history }) {
  const res = await fetch(`${BASE_URL}/report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role, experienceLevel, mode, history })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to compile final report (${res.status})`);
  }
  return res.json();
}
