from datetime import datetime, timedelta
from bson import ObjectId
from app.database import get_db, serialize_doc, deserialize_id

VALID_STATUSES = ['backlog', 'todo', 'in_progress', 'review', 'done']
VALID_PRIORITIES = ['low', 'medium', 'high', 'critical']

class Task:
    collection_name = 'tasks'
    
    @staticmethod
    def get_collection():
        return get_db()[Task.collection_name]
    
    @staticmethod
    def create(project_id, org_id, title, creator_id, description=None, priority='medium', 
               assignees=None, due_date=None, time_estimate_hours=None, status='backlog'):
        # Validate status
        if status not in VALID_STATUSES:
            status = 'backlog'
            
        task = {
            'project_id': deserialize_id(project_id),
            'org_id': deserialize_id(org_id),
            'title': title,
            'description': description or '',
            'status': status,
            'priority': priority if priority in VALID_PRIORITIES else 'medium',
            'assignees': [deserialize_id(a) for a in (assignees or [])],
            'creator_id': deserialize_id(creator_id),
            'due_date': due_date,
            'time_estimate_hours': time_estimate_hours,
            'dependencies': [],
            'blocked_by': [],
            'version': 1,
            'completed_at': None,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        result = Task.get_collection().insert_one(task)
        task['_id'] = result.inserted_id
        TaskStatusHistory.log(str(task['_id']), None, status, creator_id)
        return serialize_doc(task)
    
    @staticmethod
    def find_by_id(task_id):
        task = Task.get_collection().find_one({'_id': deserialize_id(task_id)})
        return serialize_doc(task)
    
    @staticmethod
    def find_by_project(project_id, status=None, priority=None, assignee=None):
        query = {'project_id': deserialize_id(project_id)}
        if status:
            query['status'] = status
        if priority:
            query['priority'] = priority
        if assignee:
            query['assignees'] = deserialize_id(assignee)
        tasks = Task.get_collection().find(query).sort('created_at', -1)
        return [serialize_doc(t) for t in tasks]
    
    @staticmethod
    def find_by_org(org_id):
        tasks = Task.get_collection().find({'org_id': deserialize_id(org_id)})
        return [serialize_doc(t) for t in tasks]
    
    @staticmethod
    def update(task_id, data, user_id):
        task = Task.find_by_id(task_id)
        if not task:
            return None
        
        old_status = task.get('status')
        new_status = data.get('status')
        
        if 'priority' in data and data['priority'] not in VALID_PRIORITIES:
            raise ValueError(f"Invalid priority. Must be one of: {VALID_PRIORITIES}")
        
        if new_status and new_status not in VALID_STATUSES:
            raise ValueError(f"Invalid status. Must be one of: {VALID_STATUSES}")
        
        data['updated_at'] = datetime.utcnow()
        data['version'] = task.get('version', 1) + 1
        
        if new_status == 'done' and old_status != 'done':
            data['completed_at'] = datetime.utcnow()
        
        Task.get_collection().update_one(
            {'_id': deserialize_id(task_id)},
            {'$set': data}
        )
        
        if new_status and new_status != old_status:
            TaskStatusHistory.log(task_id, old_status, new_status, user_id)
            Task._update_dependent_tasks(task_id, new_status)
        
        return Task.find_by_id(task_id)
    
    @staticmethod
    def update_status(task_id, status, user_id):
        return Task.update(task_id, {'status': status}, user_id)
    
    @staticmethod
    def add_assignees(task_id, user_ids):
        task = Task.find_by_id(task_id)
        if not task:
            return None
        current = [deserialize_id(a) for a in task.get('assignees', [])]
        new_assignees = [deserialize_id(uid) for uid in user_ids if deserialize_id(uid) not in current]
        Task.get_collection().update_one(
            {'_id': deserialize_id(task_id)},
            {'$push': {'assignees': {'$each': new_assignees}}, '$set': {'updated_at': datetime.utcnow()}}
        )
        return Task.find_by_id(task_id)
    
    @staticmethod
    def remove_assignee(task_id, user_id):
        Task.get_collection().update_one(
            {'_id': deserialize_id(task_id)},
            {'$pull': {'assignees': deserialize_id(user_id)}, '$set': {'updated_at': datetime.utcnow()}}
        )
        return Task.find_by_id(task_id)
    
    @staticmethod
    def add_dependency(task_id, depends_on_id, user_id):
        if Task._would_create_cycle(task_id, depends_on_id):
            raise ValueError("Cannot create circular dependency")
        
        Task.get_collection().update_one(
            {'_id': deserialize_id(task_id)},
            {'$addToSet': {'dependencies': deserialize_id(depends_on_id)}}
        )
        Task._update_blocked_status(task_id)
        return Task.find_by_id(task_id)
    
    @staticmethod
    def remove_dependency(task_id, depends_on_id):
        Task.get_collection().update_one(
            {'_id': deserialize_id(task_id)},
            {'$pull': {'dependencies': deserialize_id(depends_on_id)}}
        )
        Task._update_blocked_status(task_id)
        return Task.find_by_id(task_id)
    
    @staticmethod
    def _would_create_cycle(task_id, depends_on_id):
        visited = set()
        def dfs(current_id):
            if str(current_id) == str(task_id):
                return True
            if str(current_id) in visited:
                return False
            visited.add(str(current_id))
            task = Task.find_by_id(current_id)
            if not task:
                return False
            for dep_id in task.get('dependencies', []):
                if dfs(dep_id):
                    return True
            return False
        return dfs(depends_on_id)
    
    @staticmethod
    def _update_blocked_status(task_id):
        task = Task.find_by_id(task_id)
        if not task:
            return
        blocked_by = []
        for dep_id in task.get('dependencies', []):
            dep_task = Task.find_by_id(dep_id)
            if dep_task and dep_task.get('status') != 'done':
                blocked_by.append(deserialize_id(dep_id))
        Task.get_collection().update_one(
            {'_id': deserialize_id(task_id)},
            {'$set': {'blocked_by': blocked_by}}
        )
    
    @staticmethod
    def _update_dependent_tasks(completed_task_id, new_status):
        if new_status == 'done':
            dependent_tasks = Task.get_collection().find({
                'dependencies': deserialize_id(completed_task_id)
            })
            for task in dependent_tasks:
                Task._update_blocked_status(str(task['_id']))
    
    @staticmethod
    def delete(task_id):
        Task.get_collection().delete_one({'_id': deserialize_id(task_id)})
        TaskStatusHistory.delete_by_task(task_id)

class TaskStatusHistory:
    collection_name = 'task_status_history'
    
    @staticmethod
    def get_collection():
        return get_db()[TaskStatusHistory.collection_name]
    
    @staticmethod
    def log(task_id, from_status, to_status, user_id):
        history = {
            'task_id': deserialize_id(task_id),
            'from_status': from_status,
            'to_status': to_status,
            'changed_by': deserialize_id(user_id),
            'changed_at': datetime.utcnow()
        }
        result = TaskStatusHistory.get_collection().insert_one(history)
        history['_id'] = result.inserted_id
        return serialize_doc(history)
    
    @staticmethod
    def find_by_task(task_id):
        history = TaskStatusHistory.get_collection().find({
            'task_id': deserialize_id(task_id)
        }).sort('changed_at', -1)
        return [serialize_doc(h) for h in history]
    
    @staticmethod
    def delete_by_task(task_id):
        TaskStatusHistory.get_collection().delete_many({'task_id': deserialize_id(task_id)})

class TaskLock:
    collection_name = 'task_locks'
    LOCK_DURATION = 30  # seconds
    
    @staticmethod
    def get_collection():
        return get_db()[TaskLock.collection_name]
    
    @staticmethod
    def acquire(task_id, user_id, socket_id):
        now = datetime.utcnow()
        TaskLock.get_collection().delete_many({'expires_at': {'$lt': now}})
        
        existing = TaskLock.get_collection().find_one({
            'task_id': deserialize_id(task_id),
            'expires_at': {'$gt': now}
        })
        if existing and str(existing['user_id']) != str(user_id):
            return None
        
        lock = {
            'task_id': deserialize_id(task_id),
            'user_id': deserialize_id(user_id),
            'socket_id': socket_id,
            'acquired_at': now,
            'expires_at': now + timedelta(seconds=TaskLock.LOCK_DURATION)
        }
        TaskLock.get_collection().update_one(
            {'task_id': deserialize_id(task_id)},
            {'$set': lock},
            upsert=True
        )
        return serialize_doc(lock)
    
    @staticmethod
    def release(task_id, user_id):
        TaskLock.get_collection().delete_one({
            'task_id': deserialize_id(task_id),
            'user_id': deserialize_id(user_id)
        })
    
    @staticmethod
    def is_locked(task_id, exclude_user_id=None):
        now = datetime.utcnow()
        query = {
            'task_id': deserialize_id(task_id),
            'expires_at': {'$gt': now}
        }
        if exclude_user_id:
            query['user_id'] = {'$ne': deserialize_id(exclude_user_id)}
        return TaskLock.get_collection().find_one(query) is not None
