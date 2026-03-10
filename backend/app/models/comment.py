from datetime import datetime
from bson import ObjectId
from app.database import get_db, serialize_doc, deserialize_id

class Comment:
    collection_name = 'comments'
    
    @staticmethod
    def get_collection():
        return get_db()[Comment.collection_name]
    
    @staticmethod
    def create(task_id, org_id, author_id, content, parent_id=None):
        comment = {
            'task_id': deserialize_id(task_id),
            'org_id': deserialize_id(org_id),
            'author_id': deserialize_id(author_id),
            'content': content,
            'parent_id': deserialize_id(parent_id) if parent_id else None,
            'is_deleted': False,
            'edited_at': None,
            'created_at': datetime.utcnow()
        }
        result = Comment.get_collection().insert_one(comment)
        comment['_id'] = result.inserted_id
        return serialize_doc(comment)
    
    @staticmethod
    def find_by_id(comment_id):
        comment = Comment.get_collection().find_one({'_id': deserialize_id(comment_id)})
        return serialize_doc(comment)
    
    @staticmethod
    def find_by_task(task_id, include_deleted=False):
        query = {'task_id': deserialize_id(task_id)}
        if not include_deleted:
            query['is_deleted'] = False
        comments = Comment.get_collection().find(query).sort('created_at', 1)
        return Comment._build_thread([serialize_doc(c) for c in comments])
    
    @staticmethod
    def _build_thread(comments):
        comment_map = {c['_id']: {**c, 'replies': []} for c in comments}
        root_comments = []
        for comment in comments:
            if comment.get('parent_id') and comment['parent_id'] in comment_map:
                comment_map[comment['parent_id']]['replies'].append(comment_map[comment['_id']])
            else:
                root_comments.append(comment_map[comment['_id']])
        return root_comments
    
    @staticmethod
    def update(comment_id, content):
        Comment.get_collection().update_one(
            {'_id': deserialize_id(comment_id)},
            {'$set': {'content': content, 'edited_at': datetime.utcnow()}}
        )
        return Comment.find_by_id(comment_id)
    
    @staticmethod
    def soft_delete(comment_id):
        Comment.get_collection().update_one(
            {'_id': deserialize_id(comment_id)},
            {'$set': {'is_deleted': True}}
        )
        return Comment.find_by_id(comment_id)
    
    @staticmethod
    def delete_by_task(task_id):
        Comment.get_collection().delete_many({'task_id': deserialize_id(task_id)})
