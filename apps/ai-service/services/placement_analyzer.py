import json
from models.schemas import StudentProfile, DriveRequirements, SkillGapResult, CgpaCheck
from services.llm_client import llm_manager

class PlacementAnalyzer:
    def analyze_gap(self, student: StudentProfile, drive: DriveRequirements) -> SkillGapResult:
        system_prompt = """
        You are a Placement Expert Analyzer for CampusOS.
        Analyze the student's profile against the company's drive requirements.
        Output MUST be a valid JSON matching this structure perfectly:
        {
            "matchPercentage": Int (0-100),
            "eligibilityStatus": String (ELIGIBLE, NOT_ELIGIBLE, NEEDS_UPSKILLING),
            "cgpaCheck": {
                "required": Float,
                "actual": Float,
                "passed": Boolean
            },
            "matchedSkills": List of Strings,
            "missingSkills": List of Strings,
            "recommendations": List of Strings (Actionable advice for the student)
        }
        """
        
        user_prompt = f"Student Profile: {student.model_dump_json()}\nDrive Requirements: {drive.model_dump_json()}\nAnalyze the skill gap."
        
        try:
            response_text = llm_manager.generate_content(
                prompt=user_prompt,
                system_instruction=system_prompt,
                force_json=True
            )
            
            result = json.loads(response_text)
            return SkillGapResult(
                studentId=student.id,
                studentName=student.name,
                driveId=drive.id,
                companyName=drive.companyName,
                matchPercentage=result.get("matchPercentage", 0),
                eligibilityStatus=result.get("eligibilityStatus", "NOT_ELIGIBLE"),
                cgpaCheck=CgpaCheck(**result.get("cgpaCheck", {"required": drive.minCgpa, "actual": student.cgpa, "passed": False})),
                matchedSkills=result.get("matchedSkills", []),
                missingSkills=result.get("missingSkills", []),
                recommendations=result.get("recommendations", [])
            )
        except Exception as e:
            # Fallback in case of absolute failure
            return SkillGapResult(
                studentId=student.id,
                studentName=student.name,
                driveId=drive.id,
                companyName=drive.companyName,
                matchPercentage=0,
                eligibilityStatus="ERROR",
                cgpaCheck=CgpaCheck(required=drive.minCgpa, actual=student.cgpa, passed=False),
                matchedSkills=[],
                missingSkills=[],
                recommendations=[f"Error during AI analysis: {str(e)}"]
            )

    def analyze_batch(self, students: list[StudentProfile], drive: DriveRequirements) -> list[SkillGapResult]:
        return [self.analyze_gap(s, drive) for s in students]

analyzer = PlacementAnalyzer()

