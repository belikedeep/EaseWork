from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId
from pydantic import BaseModel
from typing import List, Optional
from profile import get_current_user
import datetime

router = APIRouter()

def get_project_collection(db):
    return db["projects"]

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    deadlines: Optional[list] = None

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    deadlines: Optional[list] = None
    members: Optional[list] = None

@router.post("/projects", status_code=201)
def create_project(project: ProjectCreate, db=Depends(lambda: __import__("main").db), current_user=Depends(get_current_user)):
    project_dict = project.dict()
    project_dict["ownerId"] = current_user["_id"]
    project_dict["members"] = [current_user["_id"]]
    project_dict["createdAt"] = datetime.datetime.utcnow()
    result = get_project_collection(db).insert_one(project_dict)
    project_dict["_id"] = str(result.inserted_id)
    project_dict["ownerId"] = str(project_dict["ownerId"])
    project_dict["members"] = [str(m) for m in project_dict.get("members",[])]
    return project_dict

@router.get("/projects", response_model=List[dict])
def list_projects(db=Depends(lambda: __import__("main").db), current_user=Depends(get_current_user)):
    projects = list(get_project_collection(db).find({"members": current_user["_id"]}))
    for p in projects:
        p["_id"] = str(p["_id"])
        p["ownerId"] = str(p["ownerId"])
        p["members"] = [str(m) for m in p.get("members",[])]
    return projects

@router.get("/projects/{project_id}")
def get_project(project_id: str, db=Depends(lambda: __import__("main").db), current_user=Depends(get_current_user)):
    project = get_project_collection(db).find_one({"_id": ObjectId(project_id), "members": current_user["_id"]})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    project["_id"] = str(project["_id"])
    project["ownerId"] = str(project["ownerId"])
    project["members"] = [str(m) for m in project.get("members",[])]
    return project

@router.put("/projects/{project_id}")
def update_project(project_id: str, update: ProjectUpdate, db=Depends(lambda: __import__("main").db), current_user=Depends(get_current_user)):
    project = get_project_collection(db).find_one({"_id": ObjectId(project_id), "ownerId": current_user["_id"]})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found or not owner")
    update_data = {k: v for k, v in update.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    get_project_collection(db).update_one({"_id": ObjectId(project_id)}, {"$set": update_data})
    project = get_project_collection(db).find_one({"_id": ObjectId(project_id)})
    project["_id"] = str(project["_id"])
    project["ownerId"] = str(project["ownerId"])
    project["members"] = [str(m) for m in project.get("members",[])]
    return project

@router.delete("/projects/{project_id}", status_code=204)
def delete_project(project_id: str, db=Depends(lambda: __import__("main").db), current_user=Depends(get_current_user)):
    project = get_project_collection(db).find_one({"_id": ObjectId(project_id), "ownerId": current_user["_id"]})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found or not owner")
    get_project_collection(db).delete_one({"_id": ObjectId(project_id)})
    return