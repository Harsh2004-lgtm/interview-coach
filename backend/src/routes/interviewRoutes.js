const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');

// Status & Gemma provider info
router.get('/status', interviewController.getStatus);

// Start an interview session & get first Gemma question
router.post('/start', interviewController.startInterview);

// Submit candidate answer & evaluate via Gemma
router.post('/evaluate', interviewController.evaluateAnswer);

// Get adaptively adjusted next question
router.post('/next', interviewController.getNextQuestion);

// Generate final assessment report
router.post('/report', interviewController.getFinalReport);

module.exports = router;
