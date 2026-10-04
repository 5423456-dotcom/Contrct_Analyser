import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "contract_ai_db")

client: AsyncIOMotorClient = None
db = None

async def connect_to_mongo():
    global client, db
    try:
        client = AsyncIOMotorClient(MONGODB_URL, serverSelectionTimeoutMS=3000)
        # Verify connection
        await client.server_info()
        db = client[DATABASE_NAME]
        print(f"[ContractAI] Successfully connected to MongoDB at {MONGODB_URL}, DB: {DATABASE_NAME}")
    except Exception as e:
        print(f"[ContractAI Warning] Could not connect to live MongoDB: {e}")
        db = None

async def close_mongo_connection():
    global client
    if client:
        client.close()
        print("[ContractAI] Closed MongoDB connection.")

def get_database():
    return db
