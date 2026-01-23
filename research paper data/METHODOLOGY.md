# III. METHODOLOGY

The methodology of Interview.ai follows a structured 9-step approach from user registration to continuous improvement through AI-driven assessment and feedback.

---

### 1. User Registration and Profile Setup
Candidates create accounts via Clerk authentication, providing basic information and preferred interview domains. The system creates secure profiles in Supabase database for personalized progress tracking.

### 2. Resume Upload and Parsing
Users upload PDF resumes which undergo automated parsing to extract personal details, qualifications, work experience, technical skills, and achievements for structured analysis.

### 3. Skill Analysis and Mapping
Extracted data undergoes automated analysis using a comprehensive skills database (100+ skills). The system identifies, categorizes, and maps skills against industry requirements, generating targeted improvement recommendations.

### 4. Practice Module Selection
Based on skill analysis, candidates access five practice modules:
- **Aptitude Practice:** 1000+ quantitative and logical questions
- **Verbal Ability:** 500+ communication and language skills questions  
- **Company-Specific Preparation:** 6 company modules (TCS, Infosys, Wipro, Cognizant, Accenture, CapGemini)
- **Interactive Games:** 5 gamified learning experiences
- **Soft Skills Training:** 5 modules covering communication, leadership, and teamwork

### 5. AI Interview Session
Core functionality involves Retell AI-powered mock interviews with real-time WebSocket connections. Candidates select interview types (Technical/HR/Behavioral), respond via voice input, and the system captures timing and delivery through Speech-to-Text conversion.

### 6. Real-time Analysis and Scoring
Multiple pipelines analyze responses simultaneously through NLP (semantic analysis, keyword extraction, grammar assessment) and communication evaluation (clarity, structure, confidence). The fusion module applies weighted scoring:

Overall Score = (Content Relevance × 0.35) + (Communication × 0.25) + (Soft Skills × 0.20) + (Technical Accuracy × 0.20)

### 7. Feedback Report Generation
Post-interview reports include overall performance scores (0-100), question-wise analysis, strength identification, improvement areas, communication metrics, and comparative benchmarking.

### 8. Time Machine Feature
Unique feature enabling candidates to revisit past interviews, access complete transcripts, review AI feedback, track improvement across attempts, and identify recurring patterns.

### 9. Continuous Improvement and Retry
The system encourages iterative learning through multiple retakes, progress tracking, personalized recommendations, adaptive difficulty adjustment, and comprehensive skill development monitoring.

---

This methodology ensures comprehensive interview preparation through skill assessment, practice modules, AI-driven interviews, and detailed feedback for placement drive success.
