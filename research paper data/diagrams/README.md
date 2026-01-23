# 📊 Interview.ai Research Paper Diagrams

This folder contains Mermaid diagram source files for the research paper. These can be converted to high-quality PNG images for publication.

---

## 📁 Files Included

| File | Description | Figure No. |
|------|-------------|------------|
| `METHODOLOGY_DIAGRAM.mmd` | 9-Step Methodology Workflow | Fig. 1 |
| `SYSTEM_ARCHITECTURE_DIAGRAM.mmd` | Complete 3-Tier System Architecture | Fig. 2 |
| `DATA_FLOW_DIAGRAM.mmd` | Input → Processing → Analysis → Output | Fig. 3 |
| `AI_ENGINE_DIAGRAM.mmd` | AI Engine Internal Architecture | Fig. 4 |

---

## 🖼️ How to Convert to PNG (HD Quality)

### Method 1: Mermaid Live Editor (Recommended)
1. Go to **[mermaid.live](https://mermaid.live)**
2. Copy the content of any `.mmd` file
3. Paste in the editor (left panel)
4. Click **"Actions"** → **"PNG"**
5. Select resolution: **4x** for HD quality
6. Download the image

### Method 2: VS Code Extension
1. Install **"Mermaid Preview"** extension in VS Code
2. Open any `.mmd` file
3. Press `Ctrl+Shift+P` → "Mermaid: Export"
4. Select PNG format

### Method 3: Mermaid CLI (For Developers)
```bash
# Install mermaid-cli
npm install -g @mermaid-js/mermaid-cli

# Convert to PNG
mmdc -i METHODOLOGY_DIAGRAM.mmd -o methodology.png -s 4

# Convert all files
for file in *.mmd; do mmdc -i "$file" -o "${file%.mmd}.png" -s 4; done
```

### Method 4: GitHub README
GitHub automatically renders Mermaid in markdown:
```markdown
```mermaid
<paste mermaid code here>
```                           
```

---

## 🎨 Diagram Previews

### 1. Methodology Workflow
```
User Registration → Resume Upload → Skill Analysis → Practice Module → AI Interview
                                                                           ↓
Continuous Improve ← Time Machine ← Feedback Report ← Real-time Analysis ←─┘
```

### 2. System Architecture
```
┌─────────────────┐
│     USERS       │
└────────┬────────┘
         ↓
┌─────────────────┐
│  CLERK AUTH     │
└────────┬────────┘
         ↓
┌─────────────────────────────────────────┐
│     FRONTEND (Next.js 14)               │
│  Dashboard | Resume | Interview | Games │
└────────────────────┬────────────────────┘
                     ↓
┌─────────────────────────────────────────┐
│     BACKEND (Node.js + AI Engine)       │
│  Services | Retell AI | OpenAI | Fusion │
└────────────────────┬────────────────────┘
                     ↓
┌─────────────────────────────────────────┐
│     DATABASE (Supabase PostgreSQL)      │
│  Profiles | Resumes | Results | Scores  │
└─────────────────────────────────────────┘
```

---

## 📐 Recommended Image Sizes for Research Paper

| Diagram | Recommended Size | DPI |
|---------|-----------------|-----|
| Methodology | 1600 x 800 px | 300 |
| System Architecture | 1800 x 1200 px | 300 |
| Data Flow | 1400 x 600 px | 300 |
| AI Engine | 1600 x 1000 px | 300 |

---

## 🎯 Color Scheme Used

| Layer | Primary Color | Hex Code |
|-------|--------------|----------|
| Frontend | Blue | `#3B82F6` |
| Backend | Purple | `#A855F7` |
| AI Engine | Pink | `#EC4899` |
| Database | Green | `#22C55E` |
| Auth | Yellow | `#F59E0B` |
| External | Red | `#EF4444` |

---

## ✅ Checklist Before Export

- [ ] Check all text is readable at export size
- [ ] Verify color contrast meets accessibility standards
- [ ] Ensure no overlapping elements
- [ ] Test PNG on both light and dark backgrounds
- [ ] Compress final PNG if file size > 1MB

---

**Created for:** Interview.ai Research Paper  
**Last Updated:** January 2026
