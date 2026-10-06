const gemmaService = require('../services/gemmaService');

exports.getStatus = (req, res) => {
  try {
    const status = gemmaService.getActiveProvider();
    res.json({
      success: true,
      service: 'Gemma Interview Coach Backend',
      ...status
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.startInterview = async (req, res) => {
  try {
    const { role = 'Full Stack Engineer', experienceLevel = 'Mid-Level (3-5 yrs)', mode = 'Mixed', totalQuestions = 3 } = req.body;
    
    console.log(`[Interview] Starting interview for ${experienceLevel} ${role} in ${mode} mode (${totalQuestions} questions)`);

    const initialQuestion = await gemmaService.generateInitialQuestion({
      role,
      experienceLevel,
      mode
    });

    res.json({
      success: true,
      role,
      experienceLevel,
      mode,
      totalQuestions: Number(totalQuestions) || 3,
      currentQuestion: initialQuestion
    });
  } catch (error) {
    console.error('[Interview] Start interview error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.evaluateAnswer = async (req, res) => {
  try {
    const { role, experienceLevel, mode, question, candidateAnswer, questionIndex = 0 } = req.body;

    if (!candidateAnswer || !candidateAnswer.trim()) {
      return res.status(400).json({ success: false, error: 'Candidate answer is required.' });
    }

    console.log(`[Interview] Evaluating answer for Q#${questionIndex + 1}...`);

    const evaluation = await gemmaService.evaluateAnswer({
      role,
      experienceLevel,
      mode,
      question,
      candidateAnswer,
      questionIndex
    });

    res.json({
      success: true,
      evaluation
    });
  } catch (error) {
    console.error('[Interview] Evaluate answer error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getNextQuestion = async (req, res) => {
  try {
    const {
      role,
      experienceLevel,
      mode,
      previousQuestion,
      candidateAnswer,
      previousEvaluation,
      history = [],
      questionIndex = 1,
      totalQuestions = 3
    } = req.body;

    console.log(`[Interview] Generating adaptive Q#${questionIndex + 1} based on previous performance...`);

    const nextQuestion = await gemmaService.generateAdaptiveNextQuestion({
      role,
      experienceLevel,
      mode,
      previousQuestion,
      candidateAnswer,
      previousEvaluation,
      history,
      questionIndex,
      totalQuestions
    });

    res.json({
      success: true,
      nextQuestion
    });
  } catch (error) {
    console.error('[Interview] Get next question error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getFinalReport = async (req, res) => {
  try {
    const { role, experienceLevel, mode, history = [] } = req.body;

    console.log(`[Interview] Compiling final interview assessment report for ${history.length} questions...`);

    const report = await gemmaService.generateInterviewReport({
      role,
      experienceLevel,
      mode,
      history
    });

    res.json({
      success: true,
      report
    });
  } catch (error) {
    console.error('[Interview] Get report error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
