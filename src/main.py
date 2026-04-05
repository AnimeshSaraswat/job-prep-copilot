from fastapi import FastAPI
from src.routers import analyze

app = FastAPI(title="Job Prep Copilot", version="0.1.0")

app.include_router(analyze.router, prefix="/api/v1")


@app.get("/health")
def health():
    return {"status": "ok"}
