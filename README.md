# ProjectPulse AI

> **Make project communication intelligent, not overwhelming.**

ProjectPulse AI is an AI-assisted project communication intelligence platform that turns unstructured project conversations into useful, actionable project information.

It analyzes communication from sources such as client messages, WhatsApp-style updates, email, supplier updates, and site updates, then organizes the information into:

- Summaries
- Decisions
- Action items
- Responsible people
- Deadlines
- Risks
- Project tasks
- Searchable project memory

The goal is to reduce communication overload and help project teams understand **what was decided, who needs to do what, and when it is due**.

---

## 🚀 Live Demo

**Frontend:** https://projectpulse-ai-frontend.onrender.com/

**Backend API:** https://projectpulse-ai-backend.onrender.com/api/communications/

**Dashboard API:** https://projectpulse-ai-backend.onrender.com/api/communications/dashboard/

## 📦 Source Code

**GitHub:** https://github.com/bhanu-developer5161/projectpulse-ai

---

## 🎯 Problem Statement

Project communication is often spread across messages, emails, client updates, supplier conversations, and site discussions. Important information can easily become difficult to track.

A project team may need to manually identify:

- What was decided?
- What actions need to be completed?
- Who is responsible for each action?
- What is the deadline?
- Are there any risks or possible delays?
- What happened in earlier conversations?

ProjectPulse AI is designed to convert this unstructured communication into structured project intelligence.

---

## 💡 Solution

ProjectPulse AI follows a simple workflow:

```text
Project Communication
        ↓
Communication Analysis
        ↓
Summary + Decisions + Action Items + People + Deadlines + Risks
        ↓
Project Dashboard
        ↓
Project Tasks + Project Memory
```

Instead of reading every message repeatedly, a project member can use the analyzed information as a quick project reference.

---

## ✨ Key Features

### 1. Communication Capture

Users can add project communication and identify its source, including:

- WhatsApp
- Email
- Site Update
- Client
- Supplier

### 2. Intelligent Summarization

The system produces a concise summary from the submitted communication.

### 3. Decision Extraction

Important decisions and approvals are identified from project conversations.

Example:

```text
The client approved the revised office layout.
```

Result:

```text
Decision: Revised office layout approved.
```

### 4. Action Item Extraction

The system identifies work that needs to be completed and connects it with a responsible person and deadline when available.

Example:

```text
Ravi will update the frontend screens by Friday.
```

Result:

```text
Responsible: Ravi
Task: update the frontend screens
Deadline: Friday
```

### 5. Responsibility Detection

The analysis identifies the person or project role associated with an action item.

Examples include:

- Ravi
- Priya
- Contractor
- Client
- Developer
- Manager

### 6. Deadline Detection

The system extracts deadlines such as days of the week and phrases such as `by Friday` or `before Monday`.

### 7. Risk Detection

Potential project risks are identified from statements about delays, schedule impact, or other issues.

Example:

```text
Any delay in receiving materials could affect the project schedule.
```

### 8. Conversation-to-Task Conversion

Extracted action items automatically appear in the **Project Tasks** section.

### 9. Project Dashboard

The dashboard provides quick counts for:

- Communications
- Decisions
- Action Items
- Risks

### 10. Project Memory

Analyzed communications are stored so project information can be searched and referenced later.

---

## 🧪 Example

### Input Communication

```text
The client approved the revised office layout. Ravi will update the frontend screens by Friday. Priya will provide the final project images by Wednesday. The contractor must confirm material availability before Monday. Any delay in receiving materials could affect the project schedule.
```

### Extracted Result

**Decision**

```text
Revised office layout approved.
```

**Action Items**

| Responsible | Task | Deadline |
|---|---|---|
| Ravi | Update the frontend screens | Friday |
| Priya | Provide the final project images | Wednesday |
| Contractor | Confirm material availability | Monday |

**Risk**

```text
Any delay in receiving materials could affect the project schedule.
```

### Dashboard Result

```text
Communications: 1
Decisions: 1
Action Items: 3
Risks: 1
```

---

## 🏗️ Architecture

```text
                    ┌──────────────────────────┐
                    │       React Frontend      │
                    │     React + Vite UI       │
                    └────────────┬─────────────┘
                                 │ REST API
                                 ↓
                    ┌──────────────────────────┐
                    │    Django REST Backend   │
                    │   Django + DRF + APIs    │
                    └────────────┬─────────────┘
                                 │
                    ┌────────────┴─────────────┐
                    ↓                          ↓
          ┌──────────────────┐       ┌──────────────────┐
          │ Analysis Layer   │       │   SQLite DB      │
          │ Summary /        │       │ Communications   │
          │ Decisions /      │       │ Tasks / Analysis │
          │ Tasks / Risks    │       └──────────────────┘
          └──────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend

- React
- Vite
- JavaScript
- HTML5
- CSS3

### Backend

- Python
- Django
- Django REST Framework

### Database

- SQLite

### Deployment

- Render Static Site — frontend
- Render Web Service — backend

### Version Control

- Git
- GitHub

---

## 🤖 AI / Analysis Approach

The application is designed around an analysis layer that converts unstructured communication into structured project intelligence.

During development, an external OpenAI API integration was tested. Because the API account was not available for continued API usage, a local analysis fallback was implemented so that the complete application workflow could continue running without depending on external API availability.

The current prototype therefore uses local pattern-based analysis for the demonstrated extraction flow, including:

- Summary extraction
- Decision detection
- Action-item detection
- Responsible-person detection
- Deadline detection
- Risk detection

This approach keeps the prototype functional while maintaining a clear architecture for a future production AI model or external LLM integration.

---

## 🔌 API Endpoints

### Communications

```http
GET /api/communications/
```

Returns stored project communications.

### Add Communication

```http
POST /api/communications/
```

Creates a new communication record.

### Analyze Communication

```http
POST /api/communications/{id}/analyze/
```

Analyzes a communication and stores the resulting project intelligence.

### Dashboard

```http
GET /api/communications/dashboard/
```

Returns dashboard totals for communications, decisions, action items, and risks.

---

## 📁 Project Structure

```text
projectpulse-ai/
│
├── backend/
│   ├── backend/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   │
│   ├── communications/
│   │   ├── analyzer.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── views.py
│   │
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## ⚙️ Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/bhanu-developer5161/projectpulse-ai.git
cd projectpulse-ai
```

### 2. Backend setup

```bash
cd backend
python -m venv venv
```

Windows:

```powershell
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run migrations:

```bash
python manage.py migrate
```

Start the backend:

```bash
python manage.py runserver
```

Backend will run at:

```text
http://127.0.0.1:8000
```

### 3. Frontend setup

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Start the frontend:

```bash
npm run dev
```

Frontend will normally run at:

```text
http://localhost:5173
```

---

## 🔐 Environment Variables

The frontend uses:

```env
VITE_API_BASE_URL=<backend-url>
```

Do not commit secret keys or `.env` files containing credentials.

The repository is configured to ignore `.env` files and local SQLite database files.

---

## ✅ End-to-End Demo Flow

1. Open the ProjectPulse AI dashboard.
2. Select a communication source.
3. Paste a project communication.
4. Click **Add Communication**.
5. Click **Analyze**.
6. Review the generated summary, decisions, action items, and risks.
7. Verify that extracted action items appear under **Project Tasks**.
8. Use the stored communications as project memory/history.

---

## 📊 Current Prototype Status

ProjectPulse AI currently demonstrates a complete working prototype from communication capture through structured project intelligence and dashboard presentation.

Implemented prototype capabilities:

- [x] Communication capture
- [x] Multiple communication sources
- [x] Summarization
- [x] Decision extraction
- [x] Action-item extraction
- [x] Responsible-person detection
- [x] Deadline detection
- [x] Risk detection
- [x] Conversation-to-task conversion
- [x] Dashboard metrics
- [x] Persistent communication storage
- [x] Project memory/history
- [x] REST API
- [x] Render deployment
- [x] Live frontend-backend connection

---

## 🔮 Future Improvements

The prototype can be extended with:

- Direct integrations with communication platforms such as email or team chat systems
- More robust LLM-based extraction and classification
- Better entity and deadline normalization
- Task status tracking and notifications
- User authentication and project-level access control
- PostgreSQL for production persistence
- Advanced project search and filtering
- Activity timelines and project analytics
- Human review/editing of extracted AI results

---

## 🎥 Hackathon Demo

A 3–5 minute walkthrough will demonstrate:

1. The project problem
2. The ProjectPulse AI interface
3. Adding a project communication
4. Running analysis
5. Extracted decisions, tasks, deadlines, and risks
6. Dashboard/project task results
7. The live deployed application

---

## 👩‍💻 Author

**Satti Bhanu Suma Sri**

GitHub: https://github.com/bhanu-developer5161

LinkedIn: https://www.linkedin.com/in/satti-bhanu-suma-sri-7294a7380/

---

## 📄 Hackathon Project

**ArchScale Guild Intern Technology Hackathon**  
**Problem Statement:** AS-02 — *Make project communication intelligent, not overwhelming*

ProjectPulse AI was developed as a working prototype focused on transforming unstructured project communication into actionable project intelligence.
