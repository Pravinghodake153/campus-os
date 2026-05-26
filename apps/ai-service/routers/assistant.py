from fastapi import APIRouter, HTTPException
from models.schemas import AssistantRequest, AssistantResponse
from services.assistant import engine
from services.llm_client import llm_manager
from pydantic import BaseModel

router = APIRouter()

class AddKeyRequest(BaseModel):
    key: str

@router.post("/settings/keys")
async def add_api_key(request: AddKeyRequest):
    """Add a new Gemini API key dynamically."""
    try:
        llm_manager.add_api_key(request.key)
        return {"status": "success", "message": "API key added successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/query", response_model=AssistantResponse)
async def process_query(request: AssistantRequest):
    """Process a natural language query for the AI Assistant."""
    try:
        return engine.process_query(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
