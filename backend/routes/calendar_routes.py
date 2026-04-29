from fastapi import APIRouter, HTTPException, Body
from database import get_db
from bson import ObjectId
from utils.google_calendar_backend import exchange_code_for_refresh_token

router = APIRouter(prefix="/api/calendar", tags=["Calendar"])

@router.post("/link-google")
async def link_google_calendar(
    payload: dict = Body(...)
):
    auth_code = payload.get("auth_code")
    engineer_id = payload.get("engineer_id")
    if not auth_code or not engineer_id:
        raise HTTPException(status_code=400, detail="Auth code and engineer_id are required")
        
    try:
        # print("code kyon nhi cl rha hhh")
        refresh_token = exchange_code_for_refresh_token(auth_code)
        # print(refresh_token)
        # print(f"DEBUG: Retrieved refresh token: {refresh_token}")
        
        if refresh_token:
            db = get_db()
            db.engineers.update_one(
                {"email": engineer_id},
                {"$set": {"google_refresh_token": refresh_token}}
            )
        return {"message": "Google Calendar linked successfully!"}
    except Exception as e:
        print(f"Google Link Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
