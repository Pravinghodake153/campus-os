from models.schemas import StudentProfile, DriveRequirements, SkillGapResult, CgpaCheck

# Hardcoded skill mappings derived from branch + subjects for MVP
BRANCH_SKILL_MAP = {
    "CSE": ["Data Structures", "Algorithms", "DBMS", "OS", "Networks", "Python", "Java"],
    "IT": ["Web Development", "DBMS", "Networks", "Javascript", "Python"],
    "ECE": ["Digital Logic", "Microprocessors", "C++", "Python", "Signals"],
    "MECH": ["AutoCAD", "Thermodynamics", "SolidWorks", "Python"]
}

class PlacementAnalyzer:
    def analyze_gap(self, student: StudentProfile, drive: DriveRequirements) -> SkillGapResult:
        # 1. Base Skills from Branch
        student_skills = set(BRANCH_SKILL_MAP.get(student.branch.upper(), ["Problem Solving", "Communication"]))
        
        # Add dummy skills based on completed subjects (mocking real subject name parsing)
        for sub in student.completedSubjects:
            if "Web" in sub: student_skills.add("Web Development")
            if "Data" in sub: student_skills.add("DBMS")
            
        student_skills = {s.lower() for s in student_skills}
        req_skills = {s.lower(): s for s in drive.requiredSkills} # keep original case mapping
        
        # 2. Match Skills
        matched = []
        missing = []
        for r_lower, r_original in req_skills.items():
            # Fuzzy match: if required skill is a substring of any student skill
            if any(r_lower in s_lower or s_lower in r_lower for s_lower in student_skills):
                matched.append(r_original)
            else:
                missing.append(r_original)
                
        # 3. Calculate match percentage
        total_skills = len(drive.requiredSkills)
        match_pct = int((len(matched) / total_skills) * 100) if total_skills > 0 else 100
        
        # 4. Check CGPA
        cgpa_passed = student.cgpa >= drive.minCgpa
        
        # 5. Determine Eligibility
        status = "ELIGIBLE" if cgpa_passed and student.backlogs == 0 and match_pct >= 50 else "NOT_ELIGIBLE"
        if not cgpa_passed or student.backlogs > 0:
            status = "NOT_ELIGIBLE"
        elif match_pct < 50:
            status = "NEEDS_UPSKILLING"
            
        # 6. Generate Recommendations
        recommendations = []
        if not cgpa_passed:
            recommendations.append(f"Improve CGPA from {student.cgpa} to at least {drive.minCgpa}.")
        if student.backlogs > 0:
            recommendations.append(f"Clear {student.backlogs} active backlog(s) before applying.")
        if missing:
            recommendations.append(f"Complete certifications or projects in: {', '.join(missing[:3])}.")
        if status == "ELIGIBLE":
            recommendations.append("Profile is strong. Prepare for mock interviews and aptitude tests.")
            
        return SkillGapResult(
            studentId=student.id,
            studentName=student.name,
            driveId=drive.id,
            companyName=drive.companyName,
            matchPercentage=match_pct,
            eligibilityStatus=status,
            cgpaCheck=CgpaCheck(
                required=drive.minCgpa,
                actual=student.cgpa,
                passed=cgpa_passed
            ),
            matchedSkills=matched,
            missingSkills=missing,
            recommendations=recommendations
        )

    def analyze_batch(self, students: list[StudentProfile], drive: DriveRequirements) -> list[SkillGapResult]:
        return [self.analyze_gap(s, drive) for s in students]

analyzer = PlacementAnalyzer()
