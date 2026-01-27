from google import genai
import os
import json
import traceback
from datetime import datetime

class GeminiService:
    def __init__(self):
        api_key = os.getenv('GEMINI_API_KEY')
        self.client =  genai.Client(api_key=api_key)
        self.model = 'models/gemini-2.5-flash'
        
    async def analyze_goal_individual(self, target_goal: dict, recent_transactions: list):
        prompt = f"""
    Act as a Financial Strategist. 
    TODAY IS: {datetime.today().strftime('%Y-%m-%d')}
    GOAL: {target_goal['name']} (Target: ${target_goal['target_amount']}, Saved: ${target_goal['current_amount']}, Deadline: {target_goal['deadline']})
    EXPENSES: {recent_transactions}

    TASK:
    Provide a surgical roadmap to reach THIS specific goal.
    
    RETURN ONLY A JSON OBJECT:
    {{
        "feasibility_score": "High/Medium/Low",
        "predicted_completion_date": "YYYY-MM-DD",
        "status_message": "...",
        "ai_advice": {{
            "roadmap": [
                {{"step_number": 1, "title": "Step Title", "description": "Step Description"}}
            ],
            "savings_plan": {{ "weekly": 0.0, "monthly": 0.0 }},
            "budget_cuts": [
                {{"category": "Category", "description": "Description", "total_cut": 0.0}}
            ],
            "motivation": "..."
        }}
    }}
    """
        return await self._call_ai(prompt)
    
    async def analyze_global_status(self, all_goals: list, recent_transactions: list):
        prompt = f"""
        Act as a Wealth Manager.
        ALL GOALS: {all_goals}
        RECENT ACTIVITY: {recent_transactions}

        TASK:
        Analyze the overall financial health. Is the user over-committed? 
        Which goals are at risk due to spending habits?
        
        RETURN JSON:
        {{
            "summary": "15-word max summary of financial state",
            "feasibility": "Overall health status",
            "tips": [
                "Tip about general savings rule",
                "Tip about conflict between goals",
                "Tip about a specific high-spending category"
            ]
        }}
        """
        return await self._call_ai(prompt)
    
    async def _call_ai(self, prompt: str):
        try:
            config = {
                "response_mime_type": "application/json",
                "temperature": 0.1, 
            }
            
            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt,
                config=config
            )

            content_text = ""
            if response.candidates and response.candidates[0].content.parts:
                content_text = response.candidates[0].content.parts[0].text
            

            if not content_text.strip():
                print("ERROR: ")

            return json.loads(self._clean_json(content_text))

        except Exception as e:
            print("--- ERROR CRÍTICO EN LLAMADA ---")
            traceback.print_exc()
    
    def _clean_json(self, text):
        return text.replace("```json", "").replace("```", "").strip()