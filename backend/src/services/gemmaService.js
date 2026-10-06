const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Service to interface with Google Gemma / Google AI for Interview Coach
 * Powered directly by Google AI Studio API Key
 */

// Helper to safely extract JSON from LLM responses
function extractJson(text) {
  if (!text) throw new Error('Empty response from model');
  
  let cleaned = text.trim();
  
  // Strip markdown code fences: ```json ... ``` or ``` ... ```
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(json)?\n?/, '').replace(/\n?```$/, '').trim();
  } else {
    // Look for first '{' and last '}'
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    }
  }

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    // Secondary attempt: fix trailing commas or whitespace anomalies
    try {
      const sanitized = cleaned.replace(/,\s*([\]}])/g, '$1');
      return JSON.parse(sanitized);
    } catch (e) {
      console.error('Failed to parse JSON. Raw output:', text);
      throw new Error(`Invalid JSON format: ${err.message}`);
    }
  }
}

class GemmaService {
  constructor() {
    this.geminiApiKey = process.env.GEMINI_API_KEY || '';
    // Priority order of Google AI models to ensure high availability and speed
    this.preferredModel = process.env.GEMMA_MODEL || 'gemma-4-31b-it';
    this.candidateModels = [
      this.preferredModel,
      'gemma-4-26b-a4b-it',
      'gemini-3.5-flash-lite',
      'gemini-3.1-flash-lite',
      'gemini-3.8-flash'
    ];
    this.activeModel = this.preferredModel;
  }

  getActiveProvider() {
    if (this.geminiApiKey) {
      return { 
        provider: 'Google AI (Gemma Engine)', 
        model: this.activeModel, 
        ready: true 
      };
    }
    return { 
      provider: 'High-Fidelity Demo Engine', 
      model: 'gemma-2-9b-demo', 
      ready: false 
    };
  }

  async callGemma(systemPrompt, userPrompt) {
    const combinedPrompt = `${systemPrompt}\n\nIMPORTANT: You must output ONLY a valid JSON object matching the requested schema. Do not write any conversational text, explanations, or notes outside of the JSON block.\n\nUser request:\n${userPrompt}`;

    if (this.geminiApiKey) {
      const genAI = new GoogleGenerativeAI(this.geminiApiKey);

      // Attempt models in candidate list for 100% reliable execution
      for (const modelName of this.candidateModels) {
        try {
          const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: {
              temperature: 0.7,
              topP: 0.9,
            },
          });
          const result = await model.generateContent(combinedPrompt);
          const response = await result.response;
          const text = response.text();
          const parsed = extractJson(text);
          this.activeModel = modelName;
          return parsed;
        } catch (err) {
          console.warn(`[GemmaService] Model '${modelName}' returned: ${err.message}. Trying next available model...`);
        }
      }
    }

    // High-Fidelity Fallback if key missing or network issues
    console.log('[GemmaService] Using high-fidelity structured fallback response');
    return null;
  }

  /**
   * 1. Generate the initial interview question based on role, level, and mode
   */
  async generateInitialQuestion({ role, experienceLevel, mode }) {
    const systemPrompt = `You are Google Gemma, acting as an elite, empathetic, yet rigorous technical & behavioral interviewer.
Your task is to generate the OPENING interview question for a candidate.
Role: ${role}
Experience Level: ${experienceLevel}
Interview Mode: ${mode} (Technical, HR, or Mixed)

Guidelines:
- If Technical: Ask a realistic, scenario-based technical concept or architecture question fitting the role and level. Avoid trivial trivia.
- If HR: Ask a behavioral or situational question tailored to ${experienceLevel} level (e.g. conflict, prioritization, ownership, leadership).
- If Mixed: Start with a strong foundational question that touches on how they apply technical judgment in team contexts.
- Include a brief 'interviewerIntent' explaining what an interviewer evaluates with this question.

Return JSON in this format:
{
  "questionNumber": 1,
  "category": "Technical | Behavioral | Architectural | System Design | Situational",
  "question": "The question text",
  "interviewerIntent": "What skills, instincts, or competencies this question evaluates",
  "expectedKeyPoints": ["Key point 1", "Key point 2", "Key point 3"],
  "tipForCandidate": "A brief encouraging tip on how to structure their answer"
}`;

    const userPrompt = `Generate question #1 for a ${experienceLevel} ${role} in ${mode} interview mode.`;

    const result = await this.callGemma(systemPrompt, userPrompt);
    if (result && result.question) return result;

    return this.getMockInitialQuestion(role, experienceLevel, mode);
  }

  /**
   * 2. Evaluate candidate's answer with tri-score, strengths, suggestions, and improved answer
   */
  async evaluateAnswer({ role, experienceLevel, mode, question, candidateAnswer, questionIndex }) {
    const systemPrompt = `You are Google Gemma, an expert interview assessor and coach.
Evaluate the candidate's answer rigorously, constructively, and objectively.
Target Role: ${role}
Candidate Level: ${experienceLevel}
Interview Mode: ${mode}
Question: "${question}"
Candidate Answer: "${candidateAnswer}"

Grading Criteria:
1. Technical Knowledge (0-10): Technical correctness, conceptual depth, appropriate terminology, awareness of edge cases or trade-offs.
2. Communication (0-10): Clarity, conciseness, structured thinking (e.g. STAR method), articulation, tone.
3. Answer Quality (0-10): Completeness, relevance to the specific question asked, concrete examples, logical flow.

Also produce:
- strengths: 2 to 3 specific positive aspects of their answer.
- improvements: 2 to 3 constructive, actionable suggestions for what was missing or how to elevate the response.
- betterVersion: A rewritten, high-impact model answer preserving the candidate's real core ideas, but formatted for maximum interview impact (e.g. professional vocabulary, crisp structure, quantifiable metrics, trade-offs).

Return JSON in this exact structure:
{
  "scores": {
    "technicalKnowledge": 8.5,
    "communication": 7.5,
    "answerQuality": 8.0,
    "overall": 8.0
  },
  "feedbackSummary": "A 1-2 sentence executive verdict on this answer.",
  "strengths": [
    "Specific strength 1",
    "Specific strength 2"
  ],
  "improvements": [
    "Actionable improvement 1",
    "Actionable improvement 2"
  ],
  "betterVersion": "The polished, upgraded version of the candidate's answer that would impress senior hiring managers.",
  "depthAssessment": "shallow | adequate | strong | exceptional"
}`;

    const userPrompt = `Evaluate this answer for question #${questionIndex + 1}.`;

    const result = await this.callGemma(systemPrompt, userPrompt);
    if (result && result.scores && result.betterVersion) return result;

    return this.getMockEvaluation(role, experienceLevel, question, candidateAnswer);
  }

  /**
   * 3. Adaptively generate the next question based on candidate's previous response and history
   */
  async generateAdaptiveNextQuestion({
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
    const systemPrompt = `You are Google Gemma, conducting an ADAPTIVE interview.
Do not ask generic canned questions. Your next question MUST dynamically adapt to the candidate's previous answer and evaluation.

Role: ${role}
Experience Level: ${experienceLevel}
Mode: ${mode}
Question Index: ${questionIndex + 1} of ${totalQuestions}

Candidate's Last Performance:
- Last Question: "${previousQuestion}"
- Candidate Answer: "${candidateAnswer}"
- Assessed Depth: "${previousEvaluation?.depthAssessment || 'adequate'}"
- Scores: Technical: ${previousEvaluation?.scores?.technicalKnowledge}, Comm: ${previousEvaluation?.scores?.communication}, Quality: ${previousEvaluation?.scores?.answerQuality}
- Identified Gaps/Improvements: ${JSON.stringify(previousEvaluation?.improvements || [])}

Interview History so far:
${JSON.stringify((history || []).map(h => ({ q: h.question, cat: h.category, score: h.evaluation?.scores?.overall })))}

Adaptation Logic:
1. If the candidate had a shallow or incomplete answer: Follow up directly on the missing detail or edge case to give them an opportunity to elaborate.
2. If the candidate gave a strong or exceptional answer: Escalate the difficulty, present a complex architectural trade-off, or pivot to scalability or cross-functional team leadership.
3. If mode is Mixed: Balance between technical and behavioral questions across the session.
4. Ensure no repetitive questions.

Return JSON in this format:
{
  "questionNumber": ${questionIndex + 1},
  "category": "Technical | Behavioral | Deep Dive | System Design | Situational",
  "adaptiveReason": "Brief explanation of why this question was chosen based on the candidate's prior answer (e.g. 'Since you mentioned caching in the last answer, let's explore cache invalidation strategies under distributed load...')",
  "question": "The adaptive question text",
  "interviewerIntent": "What this follow-up specifically tests",
  "expectedKeyPoints": ["Point 1", "Point 2", "Point 3"],
  "tipForCandidate": "Encouraging tip tailored to this question"
}`;

    const userPrompt = `Generate adaptive question #${questionIndex + 1} for this candidate.`;

    const result = await this.callGemma(systemPrompt, userPrompt);
    if (result && result.question) return result;

    return this.getMockAdaptiveQuestion(role, experienceLevel, mode, questionIndex, previousEvaluation);
  }

  /**
   * 4. Generate comprehensive final interview report
   */
  async generateInterviewReport({ role, experienceLevel, mode, history }) {
    const systemPrompt = `You are Google Gemma, writing a comprehensive, executive-level Mock Interview Assessment Report.
Role: ${role}
Experience Level: ${experienceLevel}
Mode: ${mode}
Interview Transcript & Evaluations:
${JSON.stringify(history, null, 2)}

Provide an in-depth analysis:
1. Overall Weighted Score (0-100)
2. Hiring Recommendation: "Strong Hire" (>=85), "Hire" (75-84), "Leaning Hire" (65-74), or "Needs Work" (<65)
3. Average scores across:
   - Technical Knowledge (0-10)
   - Communication (0-10)
   - Answer Quality (0-10)
4. Executive Summary (2-3 paragraphs assessing overall readiness, domain mastery, and professionalism)
5. Top 3 Candidate Superpowers / Core Strengths
6. Top 3 High-Impact Growth Opportunities
7. Personalized 30-Day Preparation Roadmap (targeted topics to study, books, or interview techniques)

Return JSON in this exact structure:
{
  "overallScore": 84,
  "hiringRecommendation": "Hire | Strong Hire | Leaning Hire | Needs Work",
  "performanceBadge": "Senior Ready | High Potential | Solid Contributor | Needs Practice",
  "averages": {
    "technicalKnowledge": 8.4,
    "communication": 8.0,
    "answerQuality": 8.2
  },
  "executiveSummary": "Detailed summary paragraph of overall performance and readiness...",
  "keyStrengths": [
    "Strength 1 with context",
    "Strength 2 with context",
    "Strength 3 with context"
  ],
  "areasForImprovement": [
    "Area 1 with practical fix",
    "Area 2 with practical fix",
    "Area 3 with practical fix"
  ],
  "recommendedActionPlan": [
    { "phase": "Week 1", "focus": "System Design / Core Concepts", "action": "Deep dive into..." },
    { "phase": "Week 2", "focus": "STAR Framing & Storytelling", "action": "Refine leadership stories..." },
    { "phase": "Week 3", "focus": "Edge Cases & Optimization", "action": "Practice articulating trade-offs..." }
  ]
}`;

    const userPrompt = `Generate the final interview report based on the completed session.`;

    const result = await this.callGemma(systemPrompt, userPrompt);
    if (result && result.overallScore && result.hiringRecommendation) return result;

    return this.getMockReport(role, experienceLevel, mode, history);
  }

  // --- Fallback Mock Generators ---

  getMockInitialQuestion(role, experienceLevel, mode) {
    if (mode === 'HR') {
      return {
        questionNumber: 1,
        category: 'Behavioral & Leadership',
        question: `Tell me about a challenging situation in your past experience as a ${role} where project priorities suddenly changed or you faced conflicting stakeholder requirements. How did you adapt and ensure successful delivery?`,
        interviewerIntent: 'Assesses adaptability, stakeholder management, conflict navigation, and emotional intelligence under pressure.',
        expectedKeyPoints: [
          'Clear context and specific conflict (STAR method)',
          'Proactive communication with stakeholders',
          'Data-driven trade-off prioritization',
          'Outcome and key takeaway'
        ],
        tipForCandidate: 'Frame your story using Situation-Task-Action-Result (STAR) with an emphasis on proactive communication.'
      };
    }

    return {
      questionNumber: 1,
      category: 'Core Architecture & Technical Judgment',
      question: `As a ${experienceLevel} ${role}, how do you evaluate architectural and state/data management trade-offs when designing a feature that requires both high responsiveness and consistent data synchronization? Walk me through a concrete system you worked with.`,
      interviewerIntent: 'Evaluates architectural clarity, understanding of trade-offs (latency vs consistency), and real-world engineering judgment.',
      expectedKeyPoints: [
        'Selection of communication protocol or caching layer',
        'Optimistic updates vs server confirmation',
        'Handling network partitions or failure degradation',
        'Monitoring and observability'
      ],
      tipForCandidate: 'Anchor your answer in a specific real project or design pattern rather than speaking only abstractly.'
    };
  }

  getMockEvaluation(role, experienceLevel, question, candidateAnswer) {
    const length = (candidateAnswer || '').trim().split(/\s+/).length;
    let base = length > 80 ? 8.5 : length > 35 ? 7.5 : 6.0;
    
    return {
      scores: {
        technicalKnowledge: Math.min(10, +(base + (Math.random() * 0.8)).toFixed(1)),
        communication: Math.min(10, +(base - 0.2 + (Math.random() * 0.7)).toFixed(1)),
        answerQuality: Math.min(10, +(base + 0.1 + (Math.random() * 0.6)).toFixed(1)),
        overall: Math.min(10, +(base + 0.2).toFixed(1))
      },
      feedbackSummary: length > 50 
        ? "Strong foundational response with relevant context; can be enhanced with clearer quantitative outcomes and explicit trade-off comparisons."
        : "Concise start, but lacks technical depth and concrete structural examples to stand out in a senior review.",
      strengths: [
        "Directly addressed the core question without deflecting.",
        "Demonstrated clear familiarity with standard industry workflows.",
        "Maintained a professional, pragmatic problem-solving attitude."
      ],
      improvements: [
        "Include concrete metrics or outcomes (e.g. latency reduced by X%, throughput improved).",
        "Explicitly discuss alternative approaches and why your chosen path was superior.",
        "Structure with the STAR framework to clearly highlight your personal contributions."
      ],
      betterVersion: `\"In my previous project, we faced a similar challenge where balancing responsiveness and data integrity was critical. I approached this by decoupling the immediate user interaction from asynchronous processing using optimistic client updates backed by an event-driven queue. For example, we implemented a dual-layer caching strategy with Redis for read-heavy traffic and an idempotency key pattern for distributed state writes. This allowed us to keep latency under 120ms while guaranteeing zero duplicate transactions during traffic spikes. If I were doing this again at a higher scale, I would also establish automated circuit breakers to protect downstream microservices.\"`,
      depthAssessment: length > 70 ? 'strong' : length > 30 ? 'adequate' : 'shallow'
    };
  }

  getMockAdaptiveQuestion(role, experienceLevel, mode, questionIndex, previousEvaluation) {
    const isFollowup = previousEvaluation?.depthAssessment === 'shallow';

    if (isFollowup) {
      return {
        questionNumber: questionIndex + 1,
        category: 'Targeted Deep Dive',
        adaptiveReason: 'Your previous response touched upon the general approach, so let us drill deeper into specific failure modes and resilience.',
        question: `Building on your previous point: when that system encounters an unexpected failure or third-party service outage, how specifically do you handle fallback mechanisms, error logging, and user-facing graceful degradation?`,
        interviewerIntent: 'Probes resilience engineering, observability, and defensive system design under error conditions.',
        expectedKeyPoints: [
          'Circuit breakers or retry with exponential backoff',
          'Dead letter queues / idempotency',
          'User experience during partial degradation'
        ],
        tipForCandidate: 'Focus on what happens when things go wrong and how you protect the end user experience.'
      };
    }

    return {
      questionNumber: questionIndex + 1,
      category: mode === 'Mixed' && questionIndex % 2 === 1 ? 'Behavioral & Team Impact' : 'Scalability & Optimization',
      adaptiveReason: 'You demonstrated solid baseline proficiency, so let us elevate the scope to team leadership and system scalability.',
      question: mode === 'Mixed' && questionIndex % 2 === 1
        ? `Tell me about a time you had to mentor a junior engineer or persuade a team to adopt a technical best practice that met initial resistance. How did you build consensus?`
        : `Imagine the traffic on that feature grows 20x over a holiday weekend. What are the first performance bottlenecks you anticipate, and how would you profile and scale the architecture preemptively?`,
      interviewerIntent: 'Evaluates senior engineering judgment, system scaling instincts, and cross-functional leadership.',
      expectedKeyPoints: [
        'Profiling database queries and memory allocation',
        'Horizontal scaling vs vertical scaling trade-offs',
        'Consensus building and engineering culture'
      ],
      tipForCandidate: 'Articulate the decision framework you use to evaluate trade-offs under constraints.'
    };
  }

  getMockReport(role, experienceLevel, mode, history) {
    const overall = 82;
    return {
      overallScore: overall,
      hiringRecommendation: "Hire",
      performanceBadge: "Strong Senior Contributor",
      averages: {
        technicalKnowledge: 8.4,
        communication: 8.1,
        answerQuality: 8.2
      },
      executiveSummary: `The candidate showed a commendable grasp of modern ${role} principles and demonstrated thoughtful engineering problem solving throughout the session. Their answers were articulated clearly with relevant real-world context. While their technical foundation is solid, incorporating more explicit quantitative metrics and edge-case handling will elevate their presentation to the Top 5% caliber. Overall, they demonstrated the readiness and technical maturity expected for a ${experienceLevel} role.`,
      keyStrengths: [
        "Pragmatic architectural reasoning and familiarity with modern production ecosystems.",
        "Clear, structured communication without excessive jargon or hesitation.",
        "Demonstrated accountability and customer-first focus during problem-solving."
      ],
      areasForImprovement: [
        "Include more concrete numerical outcomes (e.g. latency, throughput, error rates).",
        "Proactively discuss error boundaries, circuit breakers, and failure isolation.",
        "Refine behavioral stories with crisper Situation-Task-Action-Result (STAR) structure."
      ],
      recommendedActionPlan: [
        {
          phase: "Week 1: Quantitative Storytelling",
          focus: "Impact Metrics & STAR Refinement",
          action: "Document 4 core career projects with exact metrics (e.g., % speedup, $ cost reduction, sprint velocity)."
        },
        {
          phase: "Week 2: Deep System Architecture",
          focus: "Distributed Systems & Scalability",
          action: "Practice designing resilient data pipelines, caching tiers, and event-driven architectures under failure scenarios."
        },
        {
          phase: "Week 3: Mock Polish & Follow-ups",
          focus: "Live Technical Articulation",
          action: "Practice speaking out loud through trade-offs and edge cases before jumping straight to the happy path solution."
        }
      ]
    };
  }
}

module.exports = new GemmaService();
