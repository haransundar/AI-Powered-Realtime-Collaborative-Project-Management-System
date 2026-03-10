from datetime import datetime
from bson import ObjectId
from app.database import get_db, serialize_doc, deserialize_id

class Notification:
    collection_name = 'notifications'
    
    TYPES = ['task_assigned', 'task_updated', 'comment_added', 'due_date_reminder', 'mention']
    
    @staticmethod
    def get_collection():
        return get_db()[Notification.collection_name]
    
    @staticmethod
    def create(user_id, org_id, notification_type, title, message, resource_type, resource_id):
        notification = {
            'user_id': deserialize_id(user_id),
            'org_id': deserialize_id(org_id),
            'type': notification_type,
            'title': title,
            'message': message,
            'resource_type': resource_type,
            'resource_id': deserialize_id(resource_id),
            'is_read': False,
            'created_at': datetime.utcnow()
        }
        result = Notification.get_collection().insert_one(notification)
        notification['_id'] = result.inserted_id
        return serialize_doc(notification)
    
    @staticmethod
    def find_by_user(user_id, limit=50):
        notifications = Notification.get_collection().find({
            'user_id': deserialize_id(user_id)
        }).sort([('is_read', 1), ('created_at', -1)]).limit(limit)
        return [serialize_doc(n) for n in notifications]
    
    @staticmethod
    def mark_read(notification_id):
        Notification.get_collection().update_one(
            {'_id': deserialize_id(notification_id)},
            {'$set': {'is_read': True}}
        )
    
    @staticmethod
    def mark_all_read(user_id):
        Notification.get_collection().update_many(
            {'user_id': deserialize_id(user_id), 'is_read': False},
            {'$set': {'is_read': True}}
        )
    
    @staticmethod
    def get_unread_count(user_id):
        return Notification.get_collection().count_documents({
            'user_id': deserialize_id(user_id),
            'is_read': False
        })
    
    @staticmethod
    def create_task_assigned(task, assignee_id, org_id):
        return Notification.create(
            user_id=assignee_id,
            org_id=org_id,
            notification_type='task_assigned',
            title='New Task Assignment',
            message=f'You have been assigned to task: {task["title"]}',
            resource_type='task',
            resource_id=task['_id']
        )
    
    @staticmethod
    def create_task_updated(task, user_ids, org_id, change_description):
        notifications = []
        for user_id in user_ids:
            n = Notification.create(
                user_id=user_id,
                org_id=org_id,
                notification_type='task_updated',
                title='Task Updated',
                message=f'Task "{task["title"]}" was updated: {change_description}',
                resource_type='task',
                resource_id=task['_id']
            )
            notifications.append(n)
        return notifications
    
    @staticmethod
    def create_comment_added(task, comment, user_ids, org_id):
        notifications = []
        for user_id in user_ids:
            n = Notification.create(
                user_id=user_id,
                org_id=org_id,
                notification_type='comment_added',
                title='New Comment',
                message=f'New comment on task "{task["title"]}"',
                resource_type='comment',
                resource_id=comment['_id']
            )
            notifications.append(n)
        return notifications
