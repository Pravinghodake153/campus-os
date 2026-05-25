from fastapi import APIRouter, HTTPException
from models.schemas import AssistantRequest, AssistantResponse
from services.assistant import engine

router = APIRouter()

@router.post("/query", response_model=AssistantResponse)
async def process_query(request: AssistantRequest):
    """Process a natural language query for the AI Assistant."""
    try:
        return engine.process_query(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
