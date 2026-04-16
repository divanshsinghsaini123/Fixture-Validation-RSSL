from fastapi import HTTPException
from database import get_db
from models.engineers_models import EngineerCreate, EngineerLogin
from utils.auth import get_password_hash, verify_password, create_access_token
from bson import ObjectId

def create_engineer(engineer: EngineerCreate):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection error.")
    
    collection = db["engineers"]
    
    # Check if email or phone already exists
    if collection.find_one({"$or": [{"email": engineer.email}, {"phone": engineer.phone}]}):
        raise HTTPException(status_code=400, detail="User with this email or phone already exists.")

    eng_data = engineer.model_dump()
    
    # Hash password replacing plain password
    eng_data["password"] = get_password_hash(eng_data["password"])
    
    try:
        result = collection.insert_one(eng_data)
        
        # Don't return password
        del eng_data["password"]
        
        # MongoDB adds _id as an ObjectId which breaks JSON responses, we MUST convert it to string
        eng_data["_id"] = str(eng_data["_id"])
        
        return {
            "message": "Engineer added successfully!",
            "id": str(result.inserted_id),
            "data": eng_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def login_engineer(credentials: EngineerLogin):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database error")
    
    collection = db["engineers"]
    
    # User can login with either phone or email
    user = collection.find_one({
        "$or": [{"email": credentials.identifier}, {"phone": credentials.identifier}]
    })
    
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email/phone or password")
        
    if not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=400, detail="Incorrect email/phone or password")
        
    # Generate JWT token
    access_token = create_access_token(data={"sub": str(user["_id"]), "name": user["name"]})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": str(user["_id"]),
        "name": user["name"]
    }

def fetch_all_engineers():
    db = get_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection error.")
    
    collection = db["engineers"]
    engineers = list(collection.find({}, {"password": 0})) # Hide passwords!
    for eng in engineers:
        eng["_id"] = str(eng["_id"])
    return engineers
