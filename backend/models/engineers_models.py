from pydantic import BaseModel, EmailStr, constr
from typing import Optional

class EngineerCreate(BaseModel):
    name: str
    email: str
    phone: str
    password: str

class EngineerLogin(BaseModel):
    identifier: str  # Can be email or phone
    password: str

