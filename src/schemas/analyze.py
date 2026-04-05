from pydantic import BaseModel, field_validator


class AnalyzeRequest(BaseModel):
    jd: str
    candidate_skills: list[str] = []

    @field_validator("jd")
    @classmethod
    def jd_must_not_be_empty(cls, v):
        if not v.strip():
            raise ValueError("JD cannot be empty")
        return v.strip()


class AnalyzeResponse(BaseModel):
    match_score: int
    matched_skills: list[str]
    missing_skills: list[str]
    interview_questions: list[str]
    prep_focus: str
