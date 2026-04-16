import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # Get values from .env automatically
    MONGODB_URI: str = os.getenv("MONGODB_URI", "")
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-key-change-in-production")
    ALGORITHM: str = "HS256"

settings = Settings()
