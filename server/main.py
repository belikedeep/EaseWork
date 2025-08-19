from fastapi import FastAPI
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGODB_URI = os.environ["MONGODB_URI"]
client = MongoClient(MONGODB_URI)
db = client.get_default_database()

from auth import router as auth_router
from profile import router as profile_router
from projects import router as projects_router
from tasks import router as tasks_router

app = FastAPI()
app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(projects_router)
app.include_router(tasks_router)

@app.get("/")
def read_root():
    return {"message": "Backend server is running"}