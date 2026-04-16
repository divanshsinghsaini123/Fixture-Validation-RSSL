from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from config import settings

# Global variables to hold our database objects
client = None
db = None

def connect_to_mongo():
    """Initializes the MongoDB connection"""
    global client, db
    try:
        if settings.MONGODB_URI:
            client = MongoClient(settings.MONGODB_URI, serverSelectionTimeoutMS=5000)
            client.admin.command('ping')
            print("Successfully connected to MongoDB!")
            db = client["fixture_validation"]
        else:
            print("Warning: MONGODB_URI is missing from environment/config.")
    except ConnectionFailure:
        print("Failed to connect to MongoDB. Please check your connection string.")

def get_db():
    """Returns the main database object so logic files can pick any collection"""
    return db
