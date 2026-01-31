from fastapi import APIRouter, Depends, HTTPException
from src.schemas.individual_report import IndividualReportRequest, IndividualReportResponse
from sqlalchemy.orm import Session
import traceback

from datetime import datetime

from src.config.database import SesionLocal
from src.models import AIGoalReports
from src.services.gemini_service import GeminiService

ai_router = APIRouter(prefix="/ai", tags=["AI"])
geminiService = GeminiService()


def get_db():
    db = SesionLocal()
    try:
        yield db
    finally:
        db.close()

@ai_router.get('/health')
async def health():
    try:
        return {
            "status": "OK",
            "service": "AI-Analysis-Service",
            "provider": "Gemini-3-Flash"
        }
    except Exception as e:
        return {"status": "ERROR", "details": str(e)}

@ai_router.post('/generate-report/{goal_id}')
async def generate_report(goal_id:int, data:IndividualReportRequest, db: Session = Depends(get_db)):
    try:
        user_uuid = data.user_uuid
        target_goal_dict = data.target_goal.model_dump()
        transaction_list = [t.model_dump() for t in data.recent_transactions]
        
        ai_result = await geminiService.analyze_goal_individual(target_goal_dict, transaction_list)

    
        new_report = AIGoalReports(
            goal_id=goal_id,
            user_id=AIGoalReports.string_to_binary(user_uuid), 
            feasibility_score=ai_result['feasibility_score'],
            predicted_completion_date=datetime.strptime(ai_result['predicted_completion_date'], '%Y-%m-%d').date(),
            status_message=ai_result['status_message'],
            ai_advice=ai_result['ai_advice']
        )      
    
        db.add(new_report)
        db.commit()
        db.refresh(new_report)

        return {"message": "The report has been generated"}
    except Exception as e:
        db.rollback()
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f'Server error: {str(e)}')

@ai_router.get('/get-report/{goal_id}', response_model=IndividualReportResponse)
async def get_report(goal_id: int, user_uuid: str, db: Session = Depends(get_db)):
    binary_user_id = AIGoalReports.string_to_binary(user_uuid)
    
    report = db.query(AIGoalReports).filter(
        AIGoalReports.goal_id == goal_id,
        AIGoalReports.user_id == binary_user_id
    ).first()
    
    if not report:
        raise HTTPException(
            status_code=404,
            detail='You do not have reports for this goal'
        )
    
    return report

@ai_router.get('/get-feasibility')
async def get_feasibility(user_uuid: str, db: Session = Depends(get_db)):
    binary_user_id = AIGoalReports.string_to_binary(user_uuid)
    
    results = db.query(AIGoalReports.goal_id, AIGoalReports.feasibility_score).filter(
        AIGoalReports.user_id == binary_user_id
    ).order_by(AIGoalReports.id.desc()).all()
    
    feasibility_map = {r.goal_id: r.feasibility_score for r in results}
    
    return feasibility_map