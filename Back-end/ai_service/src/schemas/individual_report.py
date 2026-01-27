from pydantic import BaseModel
from typing import List
from src.schemas.transaction import TransactionData
from datetime import date
from src.schemas.goal import GoalData
from src.schemas.ai_advice import AIAdvice


class IndividualReportRequest(BaseModel):
    user_uuid: str
    target_goal: GoalData  
    recent_transactions: List[TransactionData]

class IndividualReportResponse(BaseModel):
    feasibility_score: str
    predicted_completion_date: date
    status_message: str
    ai_advice: AIAdvice

