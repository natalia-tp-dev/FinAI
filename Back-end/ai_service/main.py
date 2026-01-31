from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from scalar_fastapi import get_scalar_api_reference
from src.config.database import engine, Base
from src.routes.ai_routes import ai_router
import os

Base.metadata.create_all(bind=engine)

app = FastAPI (
    title='FinAI AI Service',
    description='Microservice to generate reports with Gemini AI',
    version='1.0.0',
    openapi_url="/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

app.include_router(ai_router)

@app.get("/docs", include_in_schema=False)
async def scalar_html():
    return get_scalar_api_reference(
        openapi_url=app.openapi_url,
        title=app.title,
        theme="moon", 
    )

@app.get('/')
def health_check():
    return {'status':'online', 'service':'AI Model Service'}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=os.getenv('PORT'))