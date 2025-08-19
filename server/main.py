from fastapi import FastAPI
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
client = MongoClient(MONGODB_URI)
db = client["testdb"]

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Backend server is running"}

@app.post("/items")
def create_item(item: dict):
    result = db.items.insert_one(item)
    return {"inserted_id": str(result.inserted_id)}

@app.get("/items")
def get_items():
    items = list(db.items.find({}, {"_id": 0}))
    return {"items": items}