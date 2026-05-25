from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any

# ==========================================
# Risk Prediction Schemas
# ==========================================
class StudentFeatures(BaseModel):
    studentId: str
    attendance_pct: float
    avg_internal_marks: float
    avg_assignment_score: float
    cgpa: float
    backlogs: int
    performance_drop: float
    class_participation: float

class RiskResult(BaseModel):
    studentId: str
    riskScore: float
    riskLevel: str
    confidence: float
    globalFeatureImportance: Dict[str, float]
    studentReasons: List[str]
    recommendations: List[str]

class RiskBatchRequest(BaseModel):
    students: List[StudentFeatures]

class RiskBatchResponse(BaseModel):
    results: List[RiskResult]

# ==========================================
# Timetable Optimizer Schemas
# ==========================================
class SubjectConfig(BaseModel):
    code: str
    name: str
    faculty: str
    weeklyHours: int
    isLab: bool

class RoomConfig(BaseModel):
    id: str
    name: str
    type: str # THEORY or LAB
    capacity: int

class TimetableRequest(BaseModel):
    campusId: str
    branchId: str
    semester: int
    section: str
    subjects: List[SubjectConfig]
    rooms: List[RoomConfig]

class TimetableSlot(BaseModel):
    time: str
    subjectCode: str
    subjectName: str
    faculty: str
    room: str
    type: str

class TimetableDay(BaseModel):
    day: str
    slots: List[TimetableSlot]

class TimetableResponse(BaseModel):
    timetable: List[TimetableDay]
    metadata: Dict[str, Any]

# ==========================================
# Placement Analyzer Schemas
# ==========================================
class StudentProfile(BaseModel):
    id: str
    name: str
    branch: str
    cgpa: float
    backlogs: int
    completedSubjects: List[str]

class DriveRequirements(BaseModel):
    id: str
    companyName: str
    role: str
    minCgpa: float
    requiredSkills: List[str]

class PlacementGapRequest(BaseModel):
    student: StudentProfile
    drive: DriveRequirements

class PlacementBatchRequest(BaseModel):
    students: List[StudentProfile]
    drive: DriveRequirements

class CgpaCheck(BaseModel):
    required: float
    actual: float
    passed: bool

class SkillGapResult(BaseModel):
    studentId: str
    studentName: str
    driveId: str
    companyName: str
    matchPercentage: int
    eligibilityStatus: str
    cgpaCheck: CgpaCheck
    matchedSkills: List[str]
    missingSkills: List[str]
    recommendations: List[str]

# ==========================================
# AI Assistant Schemas
# ==========================================
class AssistantRequest(BaseModel):
    query: str
    context: Optional[Dict[str, Any]] = Field(default_factory=dict)

class AssistantResponse(BaseModel):
    intent: str
    data: Any
    message: str
