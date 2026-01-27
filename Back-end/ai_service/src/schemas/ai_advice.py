
from typing import List
from pydantic import BaseModel

class RoadmapStep(BaseModel):
    step_number: int
    title: str
    description: str

class SavingsPlan(BaseModel):
    weekly: float
    monthly: float

class BudgetCut(BaseModel):
    category: str
    description: str
    total_cut: float

class AIAdvice(BaseModel):
    roadmap: List[RoadmapStep]
    savings_plan: SavingsPlan
    budget_cuts: List[BudgetCut]
    motivation: str