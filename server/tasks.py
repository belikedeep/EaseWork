from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId
from pydantic import BaseModel
from typing import Optional
from profile import get_current_user
import datetime

router = APIRouter()

from models import Task, PyObjectId, TaskResponse

def get_task_collection(db):
    return db["tasks"]

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    status: str = "todo"
    deadline: Optional[str] = None
    assignedTo: Optional[str] = None
    priority: Optional[str] = None

@router.get("/projects/{project_id}/tasks", response_model=list[TaskResponse])
def list_tasks(project_id: str, db=Depends(lambda: __import__("main").db), current_user=Depends(get_current_user)):
    tasks = list(get_task_collection(db).find({"projectId": ObjectId(project_id)}))
    result = []
    for task in tasks:
        task_dict = {
            "id": str(task.get("_id")),
            "title": task.get("title", ""),
            "description": task.get("description", ""),
            "status": task.get("status", "todo"),
            "deadline": task.get("deadline"),
            "projectId": str(task.get("projectId")),
            "assignedTo": str(task["assignedTo"]) if "assignedTo" in task and task["assignedTo"] else None,
            "priority": task.get("priority"),
        }
        result.append(task_dict)
    return result

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    deadline: Optional[str] = None
    assignedTo: Optional[str] = None
    priority: Optional[str] = None

@router.post("/projects/{project_id}/tasks", status_code=201)
def create_task(project_id: str, task: TaskCreate, db=Depends(lambda: __import__("main").db), current_user=Depends(get_current_user)):
    task_dict = task.dict()
    task_dict["projectId"] = ObjectId(project_id)
    task_dict["createdAt"] = datetime.datetime.utcnow()
    result = get_task_collection(db).insert_one(task_dict)
    task_dict["_id"] = str(result.inserted_id)
    task_dict["projectId"] = project_id
    return task_dict

@router.put("/tasks/{task_id}")
def update_task(task_id: str, update: TaskUpdate, db=Depends(lambda: __import__("main").db), current_user=Depends(get_current_user)):
    task = get_task_collection(db).find_one({"_id": ObjectId(task_id)})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    update_data = {k: v for k, v in update.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    get_task_collection(db).update_one({"_id": ObjectId(task_id)}, {"$set": update_data})
    task = get_task_collection(db).find_one({"_id": ObjectId(task_id)})
    task["_id"] = str(task["_id"])
    task["projectId"] = str(task["projectId"])
    return task

@router.delete("/tasks/{task_id}", status_code=204)
def delete_task(task_id: str, db=Depends(lambda: __import__("main").db), current_user=Depends(get_current_user)):
    task = get_task_collection(db).find_one({"_id": ObjectId(task_id)})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    get_task_collection(db).delete_one({"_id": ObjectId(task_id)})
    return