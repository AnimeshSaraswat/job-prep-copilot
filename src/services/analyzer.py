from openai import OpenAI, OpenAIError
from src.config import settings
from src.schemas.analyze import AnalyzeResponse
from fastapi import HTTPException
import json

client = OpenAI(api_key=settings.openai_api_key)

SYSTEM_PROMPT = """You are a technical recruiter and career coach.
Analyze the job description and candidate skills provided.
Respond ONLY with valid JSON matching this exact structure:
{
  "match_score": <integer 0-100, based on skill overlap>,
  "matched_skills": [<only technology/tool names that appear in both JD and candidate skills>],
  "missing_skills": [<only technology/tool names required in JD that candidate lacks — no experience requirements, no years, just skill names>],
  "interview_questions": [<exactly 10 likely technical interview questions for this role>],
  "prep_focus": <one sentence on the single most important area to prepare>
}
Do not include experience requirements like '5+ years' in matched_skills or missing_skills."""


def analyze_jd(jd: str, candidate_skills: list[str]) -> AnalyzeResponse:
    user_message = f"""
Job Description:
{jd}

Candidate Skills:
{', '.join(candidate_skills) if candidate_skills else 'Not provided'}
"""
    try:
        response = client.chat.completions.create(
            model=settings.model_name,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message},
            ],
            response_format={"type": "json_object"},
            temperature=0.3,
        )
        raw = response.choices[0].message.content
        data = json.loads(raw)
        return AnalyzeResponse(**data)

    except OpenAIError as e:
        raise HTTPException(status_code=502, detail=f"LLM error: {str(e)}")
    except (json.JSONDecodeError, KeyError) as e:
        raise HTTPException(status_code=500, detail=f"Response parsing error: {str(e)}")
