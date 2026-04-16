from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date

class Assignment(BaseModel):
    engineerId: str
    engineerName: str
    inspectionDate: date

class Shed2MachineRegistration(BaseModel):
    hollowShaftLine: str
    machineNumber: str
    model: str
    machineName: str
    scheduledTo: List[Assignment] = Field(default_factory=list)

class MachineAssignmentRequest(BaseModel):
    engineerId: str
    engineerName: str
    inspectionDate: date
