from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
import datetime

from models.schemas import StudentFeatures, RiskResult, RiskBatchRequest, RiskBatchResponse
from models.risk_model import predictor
from config import config

router = APIRouter()

@router.post("", response_model=RiskResult)
async def predict_single(student: StudentFeatures):
    """Predict academic risk for a single student."""
    try:
        result = predictor.predict(student)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/batch", response_model=RiskBatchResponse)
async def predict_batch(request: RiskBatchRequest):
    """Predict academic risk for a batch of students."""
    try:
        results = predictor.predict_batch(request.students)
        return RiskBatchResponse(results=results)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/train")
async def retrain_model():
    """Retrain the model with fresh synthetic data and overwrite the saved model."""
    try:
        predictor.train_new_model(n_samples=1000)
        return {"status": "success", "message": "Model retrained successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Retraining failed: {str(e)}")

@router.get("/model-info")
async def get_model_info():
    """Get metadata about the current model."""
    import os
    if not predictor.model:
        return {"status": "error", "message": "No model loaded."}
        
    mtime = 0
    if os.path.exists(predictor.model_path):
        mtime = os.path.getmtime(predictor.model_path)
        
    return {
        "status": "ready",
        "last_trained": datetime.datetime.fromtimestamp(mtime).isoformat() if mtime else "Unknown",
        "features": predictor.feature_names,
        "global_feature_importance": predictor.get_feature_importance()
    }
