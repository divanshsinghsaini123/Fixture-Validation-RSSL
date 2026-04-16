from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ReviewCreate(BaseModel):
    machineId: str
    engineerId: str
    engineerName: str
    reviewDate: datetime
    status: str
    comments: str
    score: Optional[float] = None
