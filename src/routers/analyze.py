from fastapi import APIRouter, HTTPException
from src.schemas.analyze import AnalyzeRequest, AnalyzeResponse
from src.services import analyzer

router = APIRouter()


@router.post("/analyze", response_model=AnalyzeResponse)
def analyze_jd(payload: AnalyzeRequest) -> AnalyzeResponse:
    try:
        return analyzer.analyze_jd(payload.jd, payload.candidate_skills)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
