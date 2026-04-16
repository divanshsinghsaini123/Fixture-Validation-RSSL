from fastapi import HTTPException
from database import get_db
from models.machine_models import Shed2MachineRegistration
from bson import ObjectId

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
    try:
        assign_dict = assignment_data.model_dump()
        assign_dict["inspectionDate"] = assign_dict["inspectionDate"].isoformat()
        
        result = collection.update_one(
            {"_id": ObjectId(machine_id)},
            {"$push": {"scheduledTo": assign_dict}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Machine not found")
            
        return {"message": "Engineer assigned to machine successfully!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
