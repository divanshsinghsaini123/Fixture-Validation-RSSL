from fastapi import HTTPException
from database import get_db
from models.reviews_models import ReviewCreate

def create_review(review: ReviewCreate):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection error.")
    
    collection = db["reviews"]
    review_data = review.model_dump()
    # Convert datetime to string or let PyMongo handle it (PyMongo handles proper datetime objects)
    
    try:
        result = collection.insert_one(review_data)
        return {
            "message": "Review submitted successfully!",
            "id": str(result.inserted_id),
            "data": review_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def get_reviews_for_machine(machine_id: str):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection error.")
    
    collection = db["reviews"]
    reviews = list(collection.find({"machineId": machine_id}))
    for rev in reviews:
        rev["_id"] = str(rev["_id"])
    return reviews
