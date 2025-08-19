from fastapi import FastAPI
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGODB_URI = os.environ.get("MONGODB_URI")
client = MongoClient(MONGODB_URI)
db = client.get_default_database()

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Backend server is running"}