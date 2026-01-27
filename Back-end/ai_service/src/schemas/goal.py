from pydantic import BaseModel

class GoalData(BaseModel):
    id: int
    name: str
    target_amount: float
    current_amount: float
    deadline: str