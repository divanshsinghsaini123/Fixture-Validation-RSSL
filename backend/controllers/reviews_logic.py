from fastapi import HTTPException
from database import get_db
from models.reviews_models import ReviewCreate
from bson import ObjectId

def create_review(review: ReviewCreate):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection error.")
    
    collection = db["reviews"]
    review_data = review.model_dump()
    
    try:
        result = collection.insert_one(review_data)
        
        # When review is submitted, update the Machine's ScheduledTo status!
        machines_col = db["Shed2machines"]
        machines_col.update_one(
            { "_id": ObjectId(review.machineId), "scheduledTo.engineerId": review.engineerId },
            { "$set": { "scheduledTo.$.status": "completed" } }
        )

        # PyMongo injects _id as an ObjectId into the mutated dict, so we convert it to string for JSON serialization
        if "_id" in review_data:
            review_data["_id"] = str(review_data["_id"])

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
