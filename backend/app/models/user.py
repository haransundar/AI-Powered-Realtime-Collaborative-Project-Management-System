from datetime import datetime
from bson import ObjectId
from app.database import get_db, serialize_doc, deserialize_id
import bcrypt

class User:
    collection_name = 'users'
    
    @staticmethod
    def get_collection():
        return get_db()[User.collection_name]
    
    @staticmethod
    def create(email, password, name, avatar_url=None):
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        user = {
            'email': email.lower(),
            'password_hash': password_hash,
            'name': name,
            'avatar_url': avatar_url,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        result = User.get_collection().insert_one(user)
        user['_id'] = result.inserted_id
        return serialize_doc(user)
    
    @staticmethod
    def find_by_email(email):
        user = User.get_collection().find_one({'email': email.lower()})
        return serialize_doc(user)
    
    @staticmethod
    def find_by_id(user_id):
        user = User.get_collection().find_one({'_id': deserialize_id(user_id)})
        return serialize_doc(user)
    
    @staticmethod
    def verify_password(user, password):
        if not user or 'password_hash' not in user:
            return False
        stored_hash = user['password_hash']
        if isinstance(stored_hash, str):
            stored_hash = stored_hash.encode('utf-8')
        return bcrypt.checkpw(password.encode('utf-8'), stored_hash)
    
    @staticmethod
    def update(user_id, data):
        data['updated_at'] = datetime.utcnow()
        User.get_collection().update_one(
            {'_id': deserialize_id(user_id)},
            {'$set': data}
        )
        return User.find_by_id(user_id)
    
    @staticmethod
    def find_by_ids(user_ids):
        ids = [deserialize_id(uid) for uid in user_ids]
        users = User.get_collection().find({'_id': {'$in': ids}})
        return [serialize_doc(u) for u in users]
