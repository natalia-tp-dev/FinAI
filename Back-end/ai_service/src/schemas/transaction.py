from pydantic import BaseModel

class TransactionData(BaseModel):
    category: str
    amount: float
    type: str