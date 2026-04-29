from fastapi import HTTPException
from database import get_db
from models.machine_models import Shed2MachineRegistration
from bson import ObjectId
from utils.google_calendar_backend import create_event, delete_event

def create_machine(machine: Shed2MachineRegistration):
    """Business logic to insert a new machine into the database"""
    db = get_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection is not available.")
    
    collection = db["Shed2machines"]
    machine_data = machine.model_dump()
    
    try:
        result = collection.insert_one(machine_data)
        machine_data["_id"] = str(machine_data["_id"])
        return {
            "message": "Machine registered successfully!",
            "id": str(result.inserted_id),
            "data": machine_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save machine data: {str(e)}")

from datetime import date, datetime

def fetch_all_machines():
    """Business logic to retrieve all machines"""
    db = get_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection is not available.")
        
    collection = db["Shed2machines"]
    machines = list(collection.find())
    today = date.today()
    
    for mach in machines:
        mach["_id"] = str(mach["_id"])
        if "scheduledTo" in mach:
            for assignment in mach["scheduledTo"]:
                # Dynamically determine if inspection is missed
                if assignment.get("status", "pending") == "pending":
                    try:
                        ins_date_str = assignment.get("inspectionDate")
                        if ins_date_str:
                            ins_date = datetime.strptime(ins_date_str.split("T")[0], "%Y-%m-%d").date()
                            if ins_date < today:
                                assignment["status"] = "missed"
                    except:
                        pass
    return machines

def assign_engineer_to_machine(machine_id: str, assignment_data):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database error.")
        
    collection = db["Shed2machines"]
    engineers_col = db["engineers"]
    try:
        assign_dict = assignment_data.model_dump()
        assign_dict["inspectionDate"] = assign_dict["inspectionDate"].isoformat()
        
        # 1. Fetch Machine Details (for calendar event title/desc)
        machine = collection.find_one({"_id": ObjectId(machine_id)})
        if not machine:
            raise HTTPException(status_code=404, detail="Machine not found")
            
        # 2. Fetch Engineer Details (for refresh token)
        engineer = engineers_col.find_one({"email": assign_dict["engineerId"]})
        
        # 3. Create Google Calendar Event if token exists
        if engineer and engineer.get("google_refresh_token"):
            task_details = {
                "machineName": machine.get("machineName", ""),
                "machineNumber": machine.get("machineNumber", ""),
                "inspectionDate": assign_dict["inspectionDate"]
            }
            event_id = create_event(engineer["google_refresh_token"], task_details)
            if event_id:
                assign_dict["googleEventId"] = event_id
        
        result = collection.update_one(
            {"_id": ObjectId(machine_id)},
            {"$push": {"scheduledTo": assign_dict}}
        )
            
        return {"message": "Engineer assigned to machine successfully!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def delete_assignment(machine_id: str, engineer_id: str, inspection_date: str):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database error.")
        
    collection = db["Shed2machines"]
    engineers_col = db["engineers"]
    try:
        # 1. Fetch Machine and Assignment to get Google Event ID
        machine = collection.find_one({"_id": ObjectId(machine_id)})
        if not machine:
            raise HTTPException(status_code=404, detail="Machine not found")
            
        target_assignment = None
        for assign in machine.get("scheduledTo", []):
            if assign.get("engineerId") == engineer_id and assign.get("inspectionDate") == inspection_date:
                target_assignment = assign
                break
                
        # 2. Delete Google Calendar Event if exists
        if target_assignment and target_assignment.get("googleEventId"):
            engineer = engineers_col.find_one({"email": engineer_id})
            if engineer and engineer.get("google_refresh_token"):
                delete_event(engineer["google_refresh_token"], target_assignment["googleEventId"])
                
        # 3. Pull the assignment from the DB
        result = collection.update_one(
            {"_id": ObjectId(machine_id)},
            {"$pull": {"scheduledTo": {"engineerId": engineer_id, "inspectionDate": inspection_date}}}
        )
            
        return {"message": "Assignment deleted successfully!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
