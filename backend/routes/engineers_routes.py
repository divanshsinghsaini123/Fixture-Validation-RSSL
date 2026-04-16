from fastapi import APIRouter
from models.engineers_models import EngineerCreate, EngineerLogin
from controllers.engineers_logic import create_engineer, fetch_all_engineers, login_engineer

router = APIRouter(prefix="/api/engineers", tags=["Engineers"])

@router.post("")
def route_create_engineer(engineer: EngineerCreate):
    return create_engineer(engineer)

@router.post("/login")
def route_login_engineer(credentials: EngineerLogin):
    return login_engineer(credentials)

@router.get("")
def route_get_engineers():
    return {"engineers": fetch_all_engineers()}
