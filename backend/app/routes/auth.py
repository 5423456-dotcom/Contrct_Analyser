from datetime import datetime
from bson import ObjectId
from fastapi import APIRouter, HTTPException, Depends, status
from app.database.mongodb import get_database
from app.schemas.auth import UserRegister, UserLogin, UserResponse, TokenResponse
from app.utils.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_user
)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# In-memory fallback if MongoDB is not initialized yet
in_memory_users = {}

@router.post("/register", response_model=TokenResponse)
async def register(user_data: UserRegister):
    db = get_database()
    email_clean = user_data.email.strip().lower()

    if db is not None:
        existing_user = await db["users"].find_one({"email": email_clean})
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A user with this email address already exists."
            )
        
        hashed_password = get_password_hash(user_data.password)
        new_user = {
            "name": user_data.name.strip(),
            "email": email_clean,
            "password_hash": hashed_password,
            "created_at": datetime.utcnow()
        }
        res = await db["users"].insert_one(new_user)
        user_id = str(res.inserted_id)
    else:
        # In-memory fallback
        if email_clean in in_memory_users:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A user with this email address already exists."
            )
        user_id = f"mem_user_{len(in_memory_users) + 1}"
        hashed_password = get_password_hash(user_data.password)
        in_memory_users[email_clean] = {
            "id": user_id,
            "name": user_data.name.strip(),
            "email": email_clean,
            "password_hash": hashed_password,
            "created_at": datetime.utcnow()
        }

    access_token = create_access_token(data={"sub": user_id, "email": email_clean, "name": user_data.name.strip()})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "name": user_data.name.strip(),
            "email": email_clean,
            "created_at": datetime.utcnow()
        }
    }

@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    db = get_database()
    email_clean = credentials.email.strip().lower()

    user = None
    if db is not None:
        user_doc = await db["users"].find_one({"email": email_clean})
        if user_doc:
            user = {
                "id": str(user_doc["_id"]),
                "name": user_doc["name"],
                "email": user_doc["email"],
                "password_hash": user_doc["password_hash"],
                "created_at": user_doc.get("created_at")
            }
    else:
        user = in_memory_users.get(email_clean)

    if not user or not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )

    access_token = create_access_token(data={"sub": user["id"], "email": user["email"], "name": user["name"]})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "created_at": user["created_at"]
        }
    }

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    db = get_database()
    user_id = current_user["id"]
    if db is not None:
        try:
            doc = await db["users"].find_one({"_id": ObjectId(user_id)})
            if doc:
                return {
                    "id": str(doc["_id"]),
                    "name": doc["name"],
                    "email": doc["email"],
                    "created_at": doc.get("created_at")
                }
        except Exception:
            pass

    return {
        "id": current_user["id"],
        "name": current_user["name"],
        "email": current_user["email"],
        "created_at": datetime.utcnow()
    }
