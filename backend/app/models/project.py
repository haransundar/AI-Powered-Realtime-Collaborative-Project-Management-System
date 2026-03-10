from datetime import datetime
from bson import ObjectId
from app.database import get_db, serialize_doc, deserialize_id

class Project:
    collection_name = 'projects'
    
    @staticmethod
    def get_collection():
        return get_db()[Project.collection_name]
    
    @staticmethod
    def create(org_id, name, description, created_by):
        project = {
            'org_id': deserialize_id(org_id),
            'name': name,
            'description': description or '',
            'status': 'active',
            'settings': {
                'default_assignee': None,
                'enable_time_tracking': True
            },
            'created_by': deserialize_id(created_by),
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        result = Project.get_collection().insert_one(project)
        project['_id'] = result.inserted_id
        ProjectMember.create(str(project['_id']), created_by, 'project_manager', created_by)
        return serialize_doc(project)
    
    @staticmethod
    def find_by_id(project_id):
        project = Project.get_collection().find_one({'_id': deserialize_id(project_id)})
        return serialize_doc(project)
    
    @staticmethod
    def find_by_org(org_id, include_archived=False):
        query = {'org_id': deserialize_id(org_id)}
        if not include_archived:
            query['status'] = 'active'
        projects = Project.get_collection().find(query)
        return [serialize_doc(p) for p in projects]
    
    @staticmethod
    def find_by_user(user_id, org_id):
        memberships = ProjectMember.find_by_user(user_id)
        project_ids = [deserialize_id(m['project_id']) for m in memberships]
        projects = Project.get_collection().find({
            '_id': {'$in': project_ids},
            'org_id': deserialize_id(org_id),
            'status': 'active'
        })
        return [serialize_doc(p) for p in projects]
    
    @staticmethod
    def update(project_id, data):
        data['updated_at'] = datetime.utcnow()
        Project.get_collection().update_one(
            {'_id': deserialize_id(project_id)},
            {'$set': data}
        )
        return Project.find_by_id(project_id)
    
    @staticmethod
    def archive(project_id):
        return Project.update(project_id, {'status': 'archived'})
    
    @staticmethod
    def delete(project_id):
        Project.get_collection().delete_one({'_id': deserialize_id(project_id)})
        ProjectMember.delete_by_project(project_id)

class ProjectMember:
    collection_name = 'project_members'
    
    @staticmethod
    def get_collection():
        return get_db()[ProjectMember.collection_name]
    
    @staticmethod
    def create(project_id, user_id, role, added_by):
        member = {
            'project_id': deserialize_id(project_id),
            'user_id': deserialize_id(user_id),
            'role': role,
            'added_at': datetime.utcnow(),
            'added_by': deserialize_id(added_by)
        }
        result = ProjectMember.get_collection().insert_one(member)
        member['_id'] = result.inserted_id
        return serialize_doc(member)
    
    @staticmethod
    def find_by_project(project_id):
        members = ProjectMember.get_collection().find({'project_id': deserialize_id(project_id)})
        return [serialize_doc(m) for m in members]
    
    @staticmethod
    def find_by_user(user_id):
        members = ProjectMember.get_collection().find({'user_id': deserialize_id(user_id)})
        return [serialize_doc(m) for m in members]
    
    @staticmethod
    def find_one(project_id, user_id):
        member = ProjectMember.get_collection().find_one({
            'project_id': deserialize_id(project_id),
            'user_id': deserialize_id(user_id)
        })
        return serialize_doc(member)
    
    @staticmethod
    def update_role(project_id, user_id, role):
        ProjectMember.get_collection().update_one(
            {'project_id': deserialize_id(project_id), 'user_id': deserialize_id(user_id)},
            {'$set': {'role': role}}
        )
        return ProjectMember.find_one(project_id, user_id)
    
    @staticmethod
    def delete(project_id, user_id):
        ProjectMember.get_collection().delete_one({
            'project_id': deserialize_id(project_id),
            'user_id': deserialize_id(user_id)
        })
    
    @staticmethod
    def delete_by_project(project_id):
        ProjectMember.get_collection().delete_many({'project_id': deserialize_id(project_id)})
    
    @staticmethod
    def delete_by_user(user_id):
        ProjectMember.get_collection().delete_many({'user_id': deserialize_id(user_id)})
