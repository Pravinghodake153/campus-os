from models.schemas import AssistantRequest, AssistantResponse
from services.intent_patterns import classify_intent, extract_params

class AssistantEngine:
    def process_query(self, request: AssistantRequest) -> AssistantResponse:
        query = request.query
        context = request.context or {}
        role = context.get("role", "STUDENT")
        
        intent = classify_intent(query)
        params = extract_params(query)
        
        # Dispatch to handlers based on intent
        if intent == "ATTENDANCE_QUERY":
            return self._handle_attendance(params, context, role)
        elif intent == "RISK_QUERY":
            return self._handle_risk(params, context, role)
        elif intent == "PLACEMENT_QUERY":
            return self._handle_placement(params, context, role)
        elif intent == "STUDENT_QUERY":
            return self._handle_student_query(params, context, role)
        elif intent == "NOTICE_GENERATE":
            return self._handle_notice(params, context, role)
        elif intent == "GENERAL_INFO":
            return self._handle_general(params, context, role)
        else:
            return AssistantResponse(
                intent="UNKNOWN",
                data=None,
                message="I'm not sure how to help with that. Try asking about attendance, risk, or placements."
            )
            
    def _handle_attendance(self, params, context, role):
        threshold = params.get("threshold", 75)
        branch = params.get("branch", "all branches")
        
        # In a real scenario, this would query the DB using the backend.
        # Since the AI service is stateless, the Node.js backend actually fetches data BEFORE calling the AI,
        # OR the AI service formats a response telling the frontend what to render.
        # Here we return structured data that the UI will use to render a table.
        
        # If context has students data provided by backend
        students_data = context.get("students", [])
        filtered = [s for s in students_data if s.get("attendance_pct", 100) < threshold]
        
        if branch != "all branches":
            filtered = [s for s in filtered if s.get("branch") == branch]
            
        message = f"Found {len(filtered)} students below {threshold}% attendance in {branch}."
        if role == "STUDENT":
            message = "Your attendance is currently 82%. You are in the safe zone."
            filtered = [] # Students can't see others
            
        return AssistantResponse(intent="ATTENDANCE_QUERY", data={"students": filtered}, message=message)
        
    def _handle_risk(self, params, context, role):
        branch = params.get("branch", "the campus")
        risk_data = context.get("risk_data", {})
        
        if role == "STUDENT":
            return AssistantResponse(
                intent="RISK_QUERY",
                data=None,
                message="Your current academic risk level is LOW. Keep up the good work!"
            )
            
        message = f"Based on recent analysis, {branch} has 12 HIGH risk students and 34 MEDIUM risk students. The primary factor is low attendance."
        return AssistantResponse(intent="RISK_QUERY", data=risk_data, message=message)
        
    def _handle_placement(self, params, context, role):
        company = params.get("company", "upcoming drives")
        
        if role == "STUDENT":
            return AssistantResponse(
                intent="PLACEMENT_QUERY",
                data={"actionPlan": ["Maintain CGPA above 8.0", "Complete Data Structures track", "Clear 0 backlogs"]},
                message=f"To become eligible for {company}, you need to focus on Data Structures and maintain your CGPA above 8.0. I've generated a personalized action plan."
            )
            
        return AssistantResponse(
            intent="PLACEMENT_QUERY",
            data=None,
            message=f"There are 45 students eligible for {company}."
        )
        
    def _handle_student_query(self, params, context, role):
        return AssistantResponse(
            intent="STUDENT_QUERY",
            data={"students": context.get("students", [])[:5]},
            message="Here are the top 5 at-risk students in your assigned classes."
        )
        
    def _handle_notice(self, params, context, role):
        company = params.get("company", "the upcoming placement drive")
        notice_text = f"""
        **NOTICE: Placement Drive for {company.upper()}**
        
        All eligible students are hereby informed that {company} will be conducting a placement drive on campus next week.
        
        **Eligibility Criteria:**
        - Minimum CGPA: 8.0
        - No active backlogs
        - Branch: CSE, IT, ECE
        
        Please register on the placement portal by tomorrow 5 PM.
        
        Regards,
        Placement Cell
        """.strip()
        
        return AssistantResponse(
            intent="NOTICE_GENERATE",
            data={"markdown": notice_text},
            message=f"I've drafted a notice for {company}. You can copy and edit it below."
        )
        
    def _handle_general(self, params, context, role):
        return AssistantResponse(
            intent="GENERAL_INFO",
            data=None,
            message="The boys hostel is currently at 95% occupancy, and the girls hostel is at 88% occupancy. Total 4 complaints pending."
        )

engine = AssistantEngine()
