from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
import json
import os

_client = None
_db = None

def get_db():
    global _client, _db
    if _db is None:
        mongo_uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017')
        mongo_db = os.getenv('MONGO_DB', 'project_management')
        _client = MongoClient(mongo_uri)
        _db = _client[mongo_db]
    return _db

def close_db():
    global _client, _db
    if _client:
        _client.close()
        _client = None
        _db = None

class JSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)

def serialize_value(value):
    """Recursively serialize a single value"""
    if value is None:
        return None
    if isinstance(value, ObjectId):
        return str(value)
    if isinstance(value, datetime):
        return value.isoformat()
    if isinstance(value, bytes):
        return value.decode('utf-8', errors='ignore')
    if isinstance(value, list):
        return [serialize_value(v) for v in value]
    if isinstance(value, dict):
        return {k: serialize_value(v) for k, v in value.items()}
    return value

def serialize_doc(doc):
    """Serialize a MongoDB document to JSON-safe format"""
    if doc is None:
        return None
    if isinstance(doc, list):
        return [serialize_doc(d) for d in doc]
    if isinstance(doc, dict):
        result = {}
        for key, value in doc.items():
            # Skip password_hash in serialization for security
            if key == 'password_hash':
                result[key] = value  # Keep as-is for internal use
                continue
            result[key] = serialize_value(value)
        return result
    if isinstance(doc, ObjectId):
        return str(doc)
    if isinstance(doc, datetime):
        return doc.isoformat()
    return doc

def deserialize_id(id_str):
    """Convert string ID to ObjectId"""
    if isinstance(id_str, ObjectId):
        return id_str
    if id_str is None:
        return None
    try:
        return ObjectId(id_str)
    except:
        return None
