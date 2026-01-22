# ⚡ Time Machine - AI Future Self Predictor

> **"Meet Your Future Self — Powered by AI Time Machine"**

The Time Machine feature uses AI to predict your career trajectory based on your resume and selected goals. Get detailed insights into your future skills, salary, projects, and career growth in 30-90 days.

---

## 🎯 Overview

Time Machine is an innovative AI-powered career prediction system that analyzes:
- Your current resume (skills, experience, projects)
- Your target role aspirations
- Time goals (30, 60, or 90 days)

And generates a comprehensive **future prediction** including:
- 📈 Skill progression forecasts
- 💰 Salary predictions (in LPA)
- 🚀 Project recommendations
- 🏆 Achievement milestones
- 🗺️ Learning roadmap

---

## 🔄 User Flow

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Step 1: Input  │───▶│  Step 2: Goals  │───▶│  Step 3: Result │
│  Upload Resume  │    │  Select Target  │    │  View Prediction│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Step 1: Upload Resume
- **Supported formats**: PDF, DOCX
- **Max file size**: 10MB
- Drag & drop or click to upload
- Real-time parsing with progress indicator

### Step 2: Select Goals
- **Target Role**: Choose from predefined roles
  - Frontend Developer
  - Backend Developer
  - Full Stack Developer
  - Data Scientist
  - DevOps Engineer
  - Product Manager
  - And more...
- **Time Goal**: 30, 60, or 90 days

### Step 3: View Results
- Comprehensive AI-generated prediction
- Visual skill progression charts
- Salary comparison (current vs future)
- Recommended projects
- Achievement timeline
- Learning roadmap

---

## 📁 File Structure

```
src/
├── app/
│   ├── (client)/
│   │   └── time-machine/
│   │       ├── page.tsx          # Landing page with hero section
│   │       ├── layout.tsx        # Layout wrapper
│   │       ├── data/
│   │       │   └── page.tsx      # Upload & goal selection page
│   │       └── result/
│   │           └── page.tsx      # Results & prediction display
│   │
│   └── api/
│       └── time-machine/
│           ├── analyze/
│           │   └── route.ts      # Main AI analysis endpoint
│           └── analyze-fixed/
│               └── route.ts      # Deterministic analysis endpoint
│
├── stores/
│   └── timeMachineStore.ts       # Zustand state management
│
├── hooks/
│   └── useTimeMachine.ts         # Custom hook for Time Machine logic
│
├── types/
│   └── time-machine.ts           # TypeScript type definitions
│
└── lib/
    └── pdf-parser-deterministic.ts  # Resume parsing logic
```

---

## 🛠️ Technical Implementation

### State Management (Zustand)

```typescript
// timeMachineStore.ts
interface TimeMachineState {
  resumeData: ResumeData | null;
  goalData: GoalData;
  analysisData: FuturePrediction | null;
  currentStep: number;
  isUploading: boolean;
  isAnalyzing: boolean;
}
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/time-machine/analyze` | POST | Main AI analysis endpoint |
| `/api/time-machine/analyze-fixed` | POST | Deterministic analysis |
| `/api/parse-pdf` | POST | PDF text extraction |

### Request Body (Analyze)

```json
{
  "resumeText": "Full resume text...",
  "targetRole": "Full Stack Developer",
  "timeGoal": 90,
  "interviewScores": {},
  "strengths": [],
  "weaknesses": []
}
```

### Response (Prediction)

```json
{
  "success": true,
  "prediction": {
    "targetRole": "Full Stack Developer",
    "timeframe": "90 days",
    "confidence": 85,
    "skills": {
      "React": { "current": 70, "future": 90, "improvement": 20 },
      "Node.js": { "current": 60, "future": 85, "improvement": 25 }
    },
    "salary": {
      "current": 8,
      "future": 12,
      "growth": 50
    },
    "projects": [...],
    "achievements": [...],
    "roadmap": {...}
  }
}
```

---

## 📊 Key Features

### 1. Resume Parsing
- Multi-library fallback system (pdf-parse → pdf2json → unpdf)
- Extracts: Skills, Experience, Projects, Education
- Handles text-based and some complex PDFs

### 2. Skill Progression Analysis
- Current skill level assessment (0-100)
- Future skill prediction based on time goal
- Market relevance scoring
- Learning path recommendations

### 3. Salary Prediction
- Based on current experience and skills
- Role-specific salary ranges (in LPA)
- Growth trajectory calculation
- Market rate consideration

### 4. Project Recommendations
- Role-specific project suggestions
- Difficulty progression
- Technology stack recommendations
- Timeline estimates

### 5. Achievement Milestones
- Time-bound goals
- Skill acquisition targets
- Career milestones
- Learning achievements

### 6. Visual Dashboard
- Skill progression charts
- Before/After comparison
- Interactive roadmap
- Export capabilities

---

## 🎨 UI Components

### Landing Page (`/time-machine`)
- Hero section with animated icons
- Feature showcase cards
- CTA buttons: "Start Prediction", "Upload Resume"

### Data Collection (`/time-machine/data`)
- Drag & drop file upload zone
- Progress indicator
- Role selection dropdown
- Time goal selector (30/60/90 days)
- Step navigation

### Results Page (`/time-machine/result`)
- Tab-based navigation
- Skill cards with progress bars
- Salary comparison chart
- Project cards
- Achievement timeline
- Roadmap visualization

---

## 🔧 Configuration

### Target Roles
```typescript
export const TARGET_ROLES = [
  'Frontend Developer',
  'Backend Developer', 
  'Full Stack Developer',
  'Data Scientist',
  'DevOps Engineer',
  'Product Manager',
  'UI/UX Designer',
  'Mobile Developer',
  'Cloud Architect',
  'ML Engineer'
];
```

### Time Goals
```typescript
type TimeGoal = 30 | 60 | 90; // days
```

---

## 📈 Prediction Algorithm

### Skill Growth Calculation
```
Future Skill = Current Skill + (Growth Rate × Time Factor × Role Relevance)
```

### Salary Prediction
```
Future Salary = Current Salary × (1 + Growth Rate)
Growth Rate = Base Rate + Skill Premium + Experience Factor
```

### Confidence Score
```
Confidence = (Resume Completeness × 0.4) + (Skill Match × 0.3) + (Experience Match × 0.3)
```

---

## 🚀 Usage

### Access Time Machine
1. Navigate to `/time-machine` or click "Time Machine" in sidebar
2. Click "Start Prediction" button

### Upload Resume
1. Drag & drop PDF/DOCX file
2. Wait for parsing to complete
3. Verify extracted data

### Set Goals
1. Select target role from dropdown
2. Choose time frame (30/60/90 days)
3. Click "Analyze" button

### View Results
1. Review skill predictions
2. Check salary forecast
3. Explore recommended projects
4. Follow the learning roadmap

---

## ⚠️ Limitations

1. **PDF Parsing**: Some scanned/image PDFs may not parse correctly
2. **Prediction Accuracy**: Results are AI-generated estimates
3. **Data Privacy**: Resume data is processed server-side
4. **Market Factors**: External market conditions not fully considered

---

## 🔮 Future Enhancements

- [ ] Integration with interview performance data
- [ ] LinkedIn profile import
- [ ] GitHub contribution analysis
- [ ] Real-time market salary data
- [ ] PDF report export
- [ ] Progress tracking over time
- [ ] Peer comparison analytics

---

## 📝 Dependencies

```json
{
  "pdf-parse": "^1.1.4",
  "pdf2json": "^3.x",
  "unpdf": "^0.x",
  "zustand": "^4.x",
  "lucide-react": "^0.x",
  "@radix-ui/react-select": "^1.x"
}
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/time-machine-enhancement`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/time-machine-enhancement`
5. Submit pull request

---

## 📄 License

This feature is part of the Interview.ai platform. All rights reserved.

---

<div align="center">
  <strong>⚡ Powered by AI | Built with Next.js | Styled with Tailwind CSS</strong>
</div>
