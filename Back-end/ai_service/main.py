from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.config.database import engine, Base
from src.routes.ai_routes import ai_router
import os

Base.metadata.create_all(bind=engine)

app = FastAPI (
    title='FinAI AI Service',
    description='Microservice to generate reports with Gemini AI',
    version='1.0.0'
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

app.include_router(ai_router)

@app.get('/')
def health_check():
    return {'status':'online', 'service':'AI Model Service'}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=os.getenv('PORT'))