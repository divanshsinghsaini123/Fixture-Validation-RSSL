from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class FilledCheckSheetRow(BaseModel):
    sNo: str
    contents: str
    specification: str
    inscription: str
    evaluation: str
    frequency: str
    beforeStatus: str
    afterStatus: str
    remark: str

class ReviewCreate(BaseModel):
    machineId: str
    engineerId: str
    engineerName: str
    reviewDate: datetime
    status: str
    checkSheetRows: List[FilledCheckSheetRow]
    score: Optional[float] = None
