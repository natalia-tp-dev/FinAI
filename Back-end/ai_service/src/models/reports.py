import uuid
from sqlalchemy import Column, BigInteger, Integer, String, Text, Date, JSON
from sqlalchemy.dialects.mysql import BINARY
from src.config.database import Base

class AIGoalReports(Base):
    __tablename__ = 'ai_goal_reports'
    
    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    goal_id = Column(Integer, nullable=False)
    user_id = Column(BINARY(16), nullable=False)
    feasibility_score = Column(String(20))
    predicted_completion_date = Column(Date)
    status_message = Column(Text)
    ai_advice = Column(JSON)

    @staticmethod
    def string_to_binary(uuid_str: str):
        if not uuid_str:
            return None
        clean_uuid = uuid_str.strip()
        return uuid.UUID(clean_uuid).bytes

    @staticmethod
    def binary_to_string(binary_uuid):
        if not binary_uuid:
            return None
        return str(uuid.UUID(bytes=binary_uuid))