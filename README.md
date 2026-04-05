# job-prep-copilot

> Paste a job description, get back a skill match score, interview questions, and prep focus — instantly.

![Python](https://img.shields.io/badge/python-3.11+-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-green)
![OpenAI](https://img.shields.io/badge/OpenAI-gpt--4o--mini-orange)

## What it does

- **Skill match score** — how well your skills align with the JD
- **Matched / missing skills** — exact technology gaps
- **10 interview questions** — likely questions for that specific role
- **Prep focus** — the one area to prioritize

## Tech stack

- FastAPI, Python 3.11+
- OpenAI `gpt-4o-mini`
- Pydantic v2

## Run locally
```bash
git clone https://github.com/AnimeshSaraswat/job-prep-copilot
cd job-prep-copilot
pip install -r requirements.txt
cp .env.example .env   # add your OpenAI key
uvicorn src.main:app --reload
```

API docs at `http://localhost:8000/docs`

## API

### `POST /api/v1/analyze`
```json
{
  "jd": "We are looking for a Senior Backend Engineer...",
  "candidate_skills": ["Python", "FastAPI", "PostgreSQL"]
}
```

**Response:**
```json
{
  "match_score": 80,
  "matched_skills": ["Python", "FastAPI"],
  "missing_skills": ["Go", "Kubernetes"],
  "interview_questions": ["...10 questions..."],
  "prep_focus": "Focus on distributed systems and Go."
}
```

## Deployment

Live at: [Job Prep Copilot](https://job-prep-copilot.vercel.app)

## Roadmap

- [ ] CV tailoring suggestions (Phase B)
- [ ] Mock interview Q&A with answer scoring (Phase C)
- [ ] React frontend