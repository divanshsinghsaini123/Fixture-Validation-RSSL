from fastapi import APIRouter
from models.machine_models import Shed2MachineRegistration, MachineAssignmentRequest
from controllers.shed2machine_logic import create_machine, fetch_all_machines, assign_engineer_to_machine, delete_assignment

# Create an APIRouter for all routing prefix "/api/shed2machine"
router = APIRouter(prefix="/api/shed2machine", tags=["Shed2Machine"])

@router.post("")
def route_register_machine(machine: Shed2MachineRegistration):
    # Delegate logic to controller
    # print("request aayi thiiiiiiiiiiiiiiiiiiiiiiiiiiii")
    return create_machine(machine)

@router.get("")  # Becomes /api/shed2machines
def route_get_machines():
    # Delegate logic to controller
    return {"machines": fetch_all_machines()}

@router.post("/{machine_id}/assign")
def route_assign_engineer(machine_id: str, assignment: MachineAssignmentRequest):
    return assign_engineer_to_machine(machine_id, assignment)

@router.delete("/{machine_id}/assignment/{engineer_id}/{inspection_date}")
def route_delete_assignment(machine_id: str, engineer_id: str, inspection_date: str):
    return delete_assignment(machine_id, engineer_id, inspection_date)
