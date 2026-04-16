from fastapi import APIRouter
from models.reviews_models import ReviewCreate
from controllers.reviews_logic import create_review, get_reviews_for_machine

router = APIRouter(prefix="/api/reviews", tags=["Reviews"])

@router.post("")
def route_create_review(review: ReviewCreate):
    return create_review(review)

@router.get("/{machine_id}")
def route_get_reviews(machine_id: str):
    return {"reviews": get_reviews_for_machine(machine_id)}
