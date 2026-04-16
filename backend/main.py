from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import connect_to_mongo
from config import settings

from routes.shed2machine_routes import router as shed2machine_router
from routes.engineers_routes import router as engineers_router
from routes.reviews_routes import router as reviews_router

# Application context manager to start DB on boot
@asynccontextmanager
async def lifespan(app: FastAPI):
    connect_to_mongo()
    yield
    # Any teardown logic can go here

app = FastAPI(
    title="Fixture Validation API", 
    description="Backend for managing machine registrations, engineers, and reviews.",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect all the routes properly from our routes folder
app.include_router(shed2machine_router)
app.include_router(engineers_router)
app.include_router(reviews_router)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Backend is running flawlessly with all modules!"}
