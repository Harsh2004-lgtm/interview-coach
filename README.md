# Interview Coach — AI-Powered Adaptive Interviewer with Google Gemma

> **Google Gemma Hackathon Project**  
> An AI-driven adaptive interview simulation platform that conducts role-specific mock interviews, evaluates candidate answers across three core rubrics, generates enhanced model answers, dynamically adapts follow-up questions, and compiles comprehensive performance reports.

---

## 🚀 Key Features

1. **Role & Seniority Customization**:
   - Supports preset roles (Frontend, Backend, Full Stack, AI/ML, DevOps/Cloud, Data Scientist, Product Manager) and custom roles.
   - Tailors depth across 4 experience levels: Junior (0-2 yrs), Mid-Level (3-5 yrs), Senior (5+ yrs), and Lead/Principal (8+ yrs).

2. **Specialized Interview Modes**:
   - **Technical**: System architecture, coding paradigms, trade-off analysis, latency/scalability.
   - **HR / Behavioral**: STAR framework stories, conflict resolution, ownership, cross-functional collaboration.
   - **Mixed**: Alternating blend of technical depth and behavioral leadership.

3. **Powered by Google Gemma**:
   - Primary: Google AI Studio (`gemma-2-9b-it`, `gemma-2-27b-it`) via `@google/generative-ai`.
   - Alternative Providers: Groq (`gemma2-9b-it`), local Ollama (`gemma2`), or smart demo fallback.

4. **Speech-to-Text & Real-Time Stopwatch**:
   - Candidates can type or speak their answers using the browser's native Web Speech API.
   - Real-time elapsed response timer and word count.

5. **Granular Tri-Score Rubric (0–10)**:
   - **Technical Knowledge**: Conceptual accuracy, depth, edge cases, trade-offs.
   - **Communication**: Articulation, structure, conciseness, tone.
   - **Answer Quality**: Relevance, completeness, concrete examples.

6. **Gemma's Enhanced Model Answer**:
   - For every answer submitted, Gemma generates a polished, top-tier model version of the candidate's exact ideas, demonstrating how a 1% engineer would frame it with quantifiable impact and trade-offs.

7. **Adaptive Questioning Engine**:
   - Not a canned question bank! Gemma inspects prior answer evaluations (shallow vs strong, identified gaps) to formulate the next follow-up, drill into edge cases, or escalate difficulty.

8. **Executive Final Assessment Report**:
   - Cumulative score (0-100%) and hiring recommendation badge ("Strong Hire", "Hire", "Leaning Hire", "Needs Work").
   - Dimension averages (Technical, Communication, Quality).
   - Executive summary and top 3 candidate superpowers & growth opportunities.
   - Personalized 30-Day Preparation Roadmap.
   - Detailed Question-by-Question review transcript.
   - One-click Clean PDF Export / Print.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 18, Vite, Lucide Icons, Canvas Confetti, Custom Modern Dark/Light Design System.
- **Backend**: Node.js, Express, CORS, Dotenv, `@google/generative-ai`.
- **AI Core**: Google Gemma (`gemma-2-9b-it`).
- **Security**: Zero API keys exposed on frontend. All keys safely encapsulated in backend `.env`.

```
                    +---------------------------+
                    |    React 18 + Vite UI     |
                    | (Setup, Mock Stage, Rep)  |
                    +-------------+-------------+
                                  |
                                  | REST API (/api/interview)
                                  v
                    +---------------------------+
                    |    Node.js Express API    |
                    |  (Backend Controller/Svc) |
                    +-------------+-------------+
                                  |
            +---------------------+---------------------+
            |                                           |
            v                                           v
+-----------------------+                   +-----------------------+
|   Google AI Studio    |                   |  High-Fidelity Smart  |
|  (gemma-2-9b-it API)  |                   |  Fallback Generator   |
+-----------------------+                   +-----------------------+
```

---

## 🏃 Quick Start Guide

### 1. Prerequisites
- Node.js (v18+ recommended, v24 tested)
- npm (v9+)

### 2. Configure Backend
1. Open `backend/.env` (or copy from `backend/.env.example`).
2. Add your Google AI Studio API key (free at [aistudio.google.com](https://aistudio.google.com/)):
   ```env
   PORT=5000
   GEMINI_API_KEY=your_google_ai_studio_key_here
   GEMMA_MODEL=gemma-2-9b-it
   ```
   *(Note: If no key is set, the app will run in smart demo mock mode so you can preview all features immediately!)*

### 3. Start the Backend Server
```bash
cd backend
npm install
npm start
```
The server will start on `http://localhost:5000`.

### 4. Start the Frontend
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🏆 Hackathon Submission Highlights
- **Not a generic chatbot**: Structured interview simulation with authentic recruiter rubrics and candidate telemetry.
- **Adaptive progression**: Demonstrates dynamic reasoning where Gemma references previous answers when generating follow-ups.
- **Explainable feedback**: Every score includes clear strengths, improvement areas, and a rewritten model answer.
