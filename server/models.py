from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Any
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return str(v)

class User(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id")
    name: str
    email: EmailStr
    password: str
    role: str
    profile_info: Optional[dict] = None

class Project(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id")
    name: str
    description: Optional[str] = None
    ownerId: PyObjectId
    members: List[PyObjectId] = []
    deadlines: Optional[List[Any]] = None

class Task(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id")
    title: str
    description: Optional[str] = None
    status: str
    deadline: Optional[str] = None
    projectId: PyObjectId
    assignedTo: Optional[PyObjectId] = None
    priority: Optional[str] = None

class Team(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id")
    name: str
    description: Optional[str] = None
    ownerId: PyObjectId
    members: List[PyObjectId] = []