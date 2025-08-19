from fastapi import APIRouter, Depends, HTTPException, status
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer
from pymongo.collection import Collection
from pydantic import BaseModel
from bson import ObjectId
import os

SECRET_KEY = os.environ["SECRET_KEY"]
ALGORITHM = "HS256"

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_user_collection(db):
    return db["users"]

def get_current_user(token: str = Depends(oauth2_scheme), db=Depends(lambda: __import__("server.main").main.db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = get_user_collection(db).find_one({"_id": ObjectId(user_id)})
    if user is None:
        raise credentials_exception
    return user

class ProfileUpdate(BaseModel):
    name: str = None
    profile_info: dict = None

@router.get("/profile")
def view_profile(current_user=Depends(get_current_user)):
    user = current_user.copy()
    user.pop("password", None)
    return user

@router.put("/profile")
def edit_profile(update: ProfileUpdate, db=Depends(lambda: __import__("server.main").main.db), current_user=Depends(get_current_user)):
    update_data = {k: v for k, v in update.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    get_user_collection(db).update_one({"_id": current_user["_id"]}, {"$set": update_data})
    user = get_user_collection(db).find_one({"_id": current_user["_id"]})
    user.pop("password", None)
    return user