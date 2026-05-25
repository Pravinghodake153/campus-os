from fastapi import APIRouter, HTTPException
from models.schemas import TimetableRequest, TimetableResponse
from services.timetable_optimizer import optimizer

router = APIRouter()

@router.post("", response_model=TimetableResponse)
async def generate_timetable(request: TimetableRequest):
    """Generate a clash-free timetable based on constraints."""
    try:
        return optimizer.optimize(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
