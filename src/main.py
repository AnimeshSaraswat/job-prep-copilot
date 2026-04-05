from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.routers import analyze

app = FastAPI(title="Job Prep Copilot", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten this after frontend is deployed
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router, prefix="/api/v1")


@app.get("/health")
def health():
    return {"status": "ok"}
