# IV. SYSTEM ARCHITECTURE

The Interview.ai platform is built on a modern, scalable three-tier architecture comprising Frontend Layer, Backend Layer, and Data Layer. The system leverages cloud-based services for AI processing and real-time communication capabilities. Figure 3 illustrates the complete system architecture.

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    INTERVIEW.AI SYSTEM ARCHITECTURE                              │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘

                                         ┌─────────────┐
                                         │   USERS     │
                                         │ (Candidates)│
                                         └──────┬──────┘
                                                │
                                    ┌───────────▼───────────┐
                                    │     CLERK AUTH        │
                                    │   (Authentication)    │
                                    └───────────┬───────────┘
                                                │
┌───────────────────────────────────────────────┼───────────────────────────────────────────────┐
│                                    FRONTEND LAYER (Next.js 14)                                 │
├───────────────────────────────────────────────┼───────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌────────┴───────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Dashboard   │  │   Resume     │  │   Interview    │  │   Practice   │  │   Feedback   │  │
│  │     UI       │  │   Builder    │  │      UI        │  │   Modules    │  │     View     │  │
│  │              │  │              │  │                │  │              │  │              │  │
│  │ • Profile    │  │ • Upload     │  │ • Voice Chat   │  │ • Aptitude   │  │ • Scores     │  │
│  │ • Progress   │  │ • Templates  │  │ • AI Agent     │  │ • Verbal     │  │ • Reports    │  │
│  │ • History    │  │ • Export     │  │ • Recording    │  │ • Games      │  │ • Analysis   │  │
│  └──────────────┘  └──────────────┘  └────────────────┘  └──────────────┘  └──────────────┘  │
└───────────────────────────────────────────────┬───────────────────────────────────────────────┘
                                                │
                                    ┌───────────▼───────────┐
                                    │    REST API / WebSocket│
                                    │      (Next.js API)     │
                                    └───────────┬───────────┘
                                                │
┌───────────────────────────────────────────────┼───────────────────────────────────────────────┐
│                                     BACKEND LAYER (Node.js)                                    │
├───────────────────────────────────────────────┼───────────────────────────────────────────────┤
│                                               │                                                │
│  ┌────────────────────────────────────────────┴────────────────────────────────────────────┐  │
│  │                              API GATEWAY / MIDDLEWARE                                    │  │
│  │    • Request Validation  • Rate Limiting  • Session Management  • Error Handling        │  │
│  └────────────────────────────────────────────┬────────────────────────────────────────────┘  │
│                                               │                                                │
│  ┌──────────────────┬─────────────────────────┼─────────────────────────┬──────────────────┐  │
│  │                  │                         │                         │                  │  │
│  ▼                  ▼                         ▼                         ▼                  ▼  │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────────┐  ┌──────────┐  ┌──────────────┐  │
│  │ Resume   │  │ Practice │  │    AI ENGINE MODULE      │  │ Feedback │  │  Scheduler   │  │
│  │ Service  │  │ Service  │  │                          │  │ Service  │  │  (Cron)      │  │
│  │          │  │          │  │  ┌────────┐ ┌────────┐   │  │          │  │              │  │
│  │ • Parse  │  │ • Games  │  │  │ Retell │ │ OpenAI │   │  │ • Score  │  │ • Job Alerts │  │
│  │ • Skills │  │ • Quiz   │  │  │   AI   │ │  API   │   │  │ • Report │  │ • Scrapers   │  │
│  │ • Map    │  │ • Track  │  │  │ (Voice)│ │ (NLP)  │   │  │ • Store  │  │ • Notify     │  │
│  └──────────┘  └──────────┘  │  └────────┘ └────────┘   │  └──────────┘  └──────────────┘  │
│                              │                          │                                   │
│                              │  ┌────────────────────┐  │                                   │
│                              │  │  Analysis Engine   │  │                                   │
│                              │  │  • NLP Processing  │  │                                   │
│                              │  │  • Score Fusion    │  │                                   │
│                              │  │  • Communication   │  │                                   │
│                              │  └────────────────────┘  │                                   │
│                              └──────────────────────────┘                                   │
└───────────────────────────────────────────────┬───────────────────────────────────────────────┘
                                                │
┌───────────────────────────────────────────────┼───────────────────────────────────────────────┐
│                                      DATA LAYER (Supabase)                                     │
├───────────────────────────────────────────────┼───────────────────────────────────────────────┤
│                                               │                                                │
│  ┌──────────────┐  ┌──────────────┐  ┌───────┴───────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   PROFILES   │  │   RESUMES    │  │  INTERVIEWS   │  │  RESPONSES   │  │   RESULTS    │   │
│  │              │  │              │  │               │  │              │  │              │   │
│  │ • user_id    │  │ • resume_id  │  │ • session_id  │  │ • response_id│  │ • result_id  │   │
│  │ • name       │  │ • user_id    │  │ • user_id     │  │ • session_id │  │ • scores     │   │
│  │ • email      │  │ • parsed_data│  │ • type        │  │ • question   │  │ • feedback   │   │
│  │ • skills     │  │ • skills     │  │ • status      │  │ • answer     │  │ • timestamp  │   │
│  │ • progress   │  │ • created_at │  │ • created_at  │  │ • analysis   │  │ • report     │   │
│  └──────────────┘  └──────────────┘  └───────────────┘  └──────────────┘  └──────────────┘   │
│                                                                                               │
│  ┌────────────────────────────────────┐    ┌──────────────────────────────────────────────┐  │
│  │        PRACTICE DATA               │    │              COMPANY DATA                    │  │
│  │  • aptitude_questions              │    │  • TCS, Infosys, Wipro, Cognizant,          │  │
│  │  • verbal_questions                │    │    Accenture, CapGemini                      │  │
│  │  • logical_questions               │    │  • job_listings, eligibility_criteria        │  │
│  │  • game_scores                     │    │  • placement_drives, notifications           │  │
│  └────────────────────────────────────┘    └──────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Fig. 3.** Interview.ai System Architecture

---

## Architecture Components Description

### A. Frontend Layer

The frontend is built using **Next.js 14** with React 18 and TypeScript, providing a modern, responsive user interface with server-side rendering capabilities.

| Component | Technology | Functionality |
|-----------|------------|---------------|
| **Dashboard UI** | React + Tailwind CSS | User profile, progress tracking, interview history |
| **Resume Builder** | Custom Components | Resume upload, template selection, PDF export |
| **Interview UI** | WebSocket + WebRTC | Real-time voice communication with AI agent |
| **Practice Modules** | React Context | Aptitude, verbal, logical, games, soft skills |
| **Feedback View** | Charts.js + Custom | Score visualization, detailed reports |

**Key Frontend Features:**
- **Theme Toggle:** Dark/Light mode support
- **Responsive Design:** Mobile-first approach
- **Real-time Updates:** WebSocket for live interview sessions
- **Progressive Loading:** Optimized component lazy loading

### B. Backend Layer

The backend combines **Next.js API Routes** for primary endpoints and a separate **Node.js server** for background services.

#### API Gateway / Middleware
```
Request → Validation → Authentication → Rate Limiting → Route Handler → Response
```

#### Core Services:

**1. Resume Service**
- PDF parsing using custom parser (`parse-pdf.ts`)
- Skill extraction and mapping
- Resume data structuring
- Template-based resume generation

**2. Practice Service**
- Question bank management (1000+ questions)
- Progress tracking across modules
- Score calculation and storage
- Adaptive difficulty management

**3. AI Engine Module**
- **Retell AI Integration:** Voice-based conversational AI
- **OpenAI API:** Natural language processing and response analysis
- **Analysis Engine:** Multi-metric scoring and fusion

**4. Feedback Service**
- Score aggregation from multiple metrics
- Report generation with visualizations
- Historical comparison analysis
- Improvement recommendations

**5. Scheduler Service (Cron Jobs)**
- Automated job scraping from 6 companies
- Eligibility notifications
- Placement drive alerts
- Database maintenance

### C. AI Engine Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        AI ENGINE                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐        │
│   │   RETELL    │    │   OPENAI    │    │  ANALYSIS   │        │
│   │     AI      │    │    API      │    │   ENGINE    │        │
│   ├─────────────┤    ├─────────────┤    ├─────────────┤        │
│   │ • Voice STT │    │ • GPT-4     │    │ • NLP Score │        │
│   │ • TTS       │    │ • Embedding │    │ • Comm Score│        │
│   │ • Converse  │    │ • Analysis  │    │ • Fusion    │        │
│   └──────┬──────┘    └──────┬──────┘    └──────┬──────┘        │
│          │                  │                  │                 │
│          └──────────────────┼──────────────────┘                │
│                             ▼                                    │
│                  ┌─────────────────┐                            │
│                  │  FUSION MODULE  │                            │
│                  │   • Weighted    │                            │
│                  │     Scoring     │                            │
│                  │   • Final Score │                            │
│                  └─────────────────┘                            │
└─────────────────────────────────────────────────────────────────┘
```

**Fig. 4.** AI Engine Internal Architecture

### D. Data Layer

The data layer uses **Supabase** (PostgreSQL-based) for persistent storage with real-time capabilities.

#### Database Schema Overview:

**Core Tables:**
| Table | Purpose | Key Fields |
|-------|---------|------------|
| `profiles` | User information | user_id, name, email, skills |
| `resumes` | Parsed resume data | resume_id, user_id, parsed_json |
| `interviews` | Interview sessions | session_id, type, status |
| `responses` | Individual answers | question, answer, analysis |
| `results` | Final scores | overall_score, feedback |

**Practice Tables:**
- `aptitude_progress` - Quantitative/logical tracking
- `game_scores` - Interactive games performance
- `soft_skills_progress` - Module completion tracking

**Company Tables:**
- `job_listings` - Scraped job postings
- `placement_drives` - Campus drive information
- `eligibility_criteria` - Company-wise requirements

### E. External Integrations

```
┌─────────────────────────────────────────────────────────────┐
│                   EXTERNAL SERVICES                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   CLERK     │  │   RETELL    │  │   OPENAI    │         │
│  │   AUTH      │  │     AI      │  │    API      │         │
│  │             │  │             │  │             │         │
│  │ • Sign Up   │  │ • Voice AI  │  │ • GPT-4     │         │
│  │ • Sign In   │  │ • Real-time │  │ • Analysis  │         │
│  │ • Sessions  │  │ • WebSocket │  │ • Embedding │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐                          │
│  │  SUPABASE   │  │  VERCEL     │                          │
│  │  (Database) │  │  (Hosting)  │                          │
│  │             │  │             │                          │
│  │ • PostgreSQL│  │ • Edge      │                          │
│  │ • Real-time │  │ • Serverless│                          │
│  │ • Storage   │  │ • CDN       │                          │
│  └─────────────┘  └─────────────┘                          │
└─────────────────────────────────────────────────────────────┘
```

**Fig. 5.** External Service Integrations

---

## Technology Stack Summary

| Layer | Technology | Version |
|-------|------------|---------|
| **Frontend** | Next.js | 14.x |
| **UI Library** | React | 18.x |
| **Language** | TypeScript | 5.x |
| **Styling** | Tailwind CSS | 3.x |
| **Authentication** | Clerk | Latest |
| **Database** | Supabase (PostgreSQL) | Latest |
| **Voice AI** | Retell AI | Latest |
| **NLP** | OpenAI API (GPT-4) | Latest |
| **Hosting** | Vercel | - |

---

## Data Flow Architecture

```
User Action → Frontend (Next.js) → API Route → Service Layer → External AI → Database → Response
     ▲                                                                                    │
     └────────────────────────────────────────────────────────────────────────────────────┘
```

The architecture ensures:
- **Scalability:** Serverless deployment handles variable load
- **Security:** Clerk authentication + Supabase RLS policies
- **Real-time:** WebSocket connections for live interviews
- **Reliability:** Cloud-based services with high availability
- **Performance:** Edge functions and CDN for fast response times

---

This modular architecture allows for easy maintenance, feature additions, and independent scaling of components based on usage patterns.
