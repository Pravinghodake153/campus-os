import json
from models.schemas import AssistantRequest, AssistantResponse
from services.llm_client import llm_manager

class AssistantEngine:
    def process_query(self, request: AssistantRequest) -> AssistantResponse:
        system_prompt = """
        You are the CampusOS AI Assistant. You help students, faculty, and admins navigate campus information.
        You must ALWAYS respond with a JSON object containing exactly these three fields:
        {
            "intent": "String (e.g. ATTENDANCE_QUERY, RISK_QUERY, PLACEMENT_QUERY, NOTICE_GENERATE, GENERAL_INFO)",
            "message": "String (Your conversational response to the user)",
            "data": "Optional Object or Array containing structured data if relevant, otherwise null"
        }
        
        Keep your 'message' professional, concise, and helpful.
        """
        
        user_prompt = f"User Query: {request.query}\nContext Data: {json.dumps(request.context or {})}\n"
        
        try:
            response_text = llm_manager.generate_content(
                prompt=user_prompt,
                system_instruction=system_prompt,
                force_json=True
            )
            
            result = json.loads(response_text)
            return AssistantResponse(
                intent=result.get("intent", "GENERAL_INFO"),
                message=result.get("message", "I have processed your request."),
                data=result.get("data", None)
            )
        except Exception as e:
            return AssistantResponse(
                intent="ERROR",
                message=f"I encountered an error while processing your query: {str(e)}",
                data=None
            )

engine = AssistantEngine()

