from datetime import datetime
from bson import ObjectId
from app.database import get_db, serialize_doc, deserialize_id
import os
import uuid

class FileAttachment:
    collection_name = 'file_attachments'
    
    @staticmethod
    def get_collection():
        return get_db()[FileAttachment.collection_name]
    
    @staticmethod
    def create(task_id, org_id, original_name, mime_type, size_bytes, uploaded_by, storage_path):
        attachment = {
            'task_id': deserialize_id(task_id),
            'org_id': deserialize_id(org_id),
            'filename': str(uuid.uuid4()) + os.path.splitext(original_name)[1],
            'original_name': original_name,
            'mime_type': mime_type,
            'size_bytes': size_bytes,
            'uploaded_by': deserialize_id(uploaded_by),
            'storage_path': storage_path,
            'created_at': datetime.utcnow()
        }
        result = FileAttachment.get_collection().insert_one(attachment)
        attachment['_id'] = result.inserted_id
        return serialize_doc(attachment)
    
    @staticmethod
    def find_by_id(attachment_id):
        attachment = FileAttachment.get_collection().find_one({'_id': deserialize_id(attachment_id)})
        return serialize_doc(attachment)
    
    @staticmethod
    def find_by_task(task_id):
        attachments = FileAttachment.get_collection().find({'task_id': deserialize_id(task_id)})
        return [serialize_doc(a) for a in attachments]
    
    @staticmethod
    def delete(attachment_id):
        attachment = FileAttachment.find_by_id(attachment_id)
        if attachment and os.path.exists(attachment['storage_path']):
            os.remove(attachment['storage_path'])
        FileAttachment.get_collection().delete_one({'_id': deserialize_id(attachment_id)})
    
    @staticmethod
    def delete_by_task(task_id):
        attachments = FileAttachment.find_by_task(task_id)
        for attachment in attachments:
            if os.path.exists(attachment['storage_path']):
                os.remove(attachment['storage_path'])
        FileAttachment.get_collection().delete_many({'task_id': deserialize_id(task_id)})
