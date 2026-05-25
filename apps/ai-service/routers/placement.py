from fastapi import APIRouter, HTTPException
from typing import List
from models.schemas import PlacementGapRequest, PlacementBatchRequest, SkillGapResult
from services.placement_analyzer import analyzer

router = APIRouter()

@router.post("/gaps", response_model=SkillGapResult)
async def analyze_single_gap(request: PlacementGapRequest):
    """Analyze placement skill gaps for a single student against a drive."""
    try:
        return analyzer.analyze_gap(request.student, request.drive)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/batch", response_model=List[SkillGapResult])
async def analyze_batch_gaps(request: PlacementBatchRequest):
    """Analyze placement skill gaps for a batch of students against a drive."""
    try:
        return analyzer.analyze_batch(request.students, request.drive)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
