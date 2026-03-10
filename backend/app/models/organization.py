from datetime import datetime
from bson import ObjectId
from app.database import get_db, serialize_doc, deserialize_id
import re

class Organization:
    collection_name = 'organizations'
    
    @staticmethod
    def get_collection():
        return get_db()[Organization.collection_name]
    
    @staticmethod
    def find_by_name(name):
        """Find organization by exact name (case-insensitive)"""
        org = Organization.get_collection().find_one({
            'name': {'$regex': f'^{re.escape(name)}$', '$options': 'i'}
        })
        return serialize_doc(org)
    
    @staticmethod
    def find_by_slug(slug):
        """Find organization by slug"""
        org = Organization.get_collection().find_one({'slug': slug})
        return serialize_doc(org)
    
    @staticmethod
    def name_exists(name):
        """Check if organization name already exists (case-insensitive)"""
        existing = Organization.get_collection().find_one({
            'name': {'$regex': f'^{re.escape(name)}$', '$options': 'i'}
        })
        return existing is not None
    
    @staticmethod
    def get_all_names():
        """Get all organization names for suggestion purposes"""
        orgs = Organization.get_collection().find({}, {'name': 1})
        return [org['name'] for org in orgs]
    
    @staticmethod
    def generate_unique_slug(name):
        """Generate a unique slug for the organization"""
        base_slug = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')
        slug = base_slug
        counter = 1
        
        while Organization.find_by_slug(slug):
            slug = f"{base_slug}-{counter}"
            counter += 1
        
        return slug
    
    @staticmethod
    def create(name, owner_id):
        # Check for duplicate name
        if Organization.name_exists(name):
            raise ValueError(f"Organization name '{name}' already exists")
        
        slug = Organization.generate_unique_slug(name)
        org = {
            'name': name,
            'slug': slug,
            'owner_id': deserialize_id(owner_id),
            'settings': {},
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        result = Organization.get_collection().insert_one(org)
        org['_id'] = result.inserted_id
        OrgMembership.create(str(org['_id']), owner_id, 'owner', owner_id)
        return serialize_doc(org)
    
    @staticmethod
    def find_by_id(org_id):
        org = Organization.get_collection().find_one({'_id': deserialize_id(org_id)})
        return serialize_doc(org)
    
    @staticmethod
    def find_by_user(user_id):
        memberships = OrgMembership.find_by_user(user_id)
        org_ids = [deserialize_id(m['org_id']) for m in memberships]
        orgs = Organization.get_collection().find({'_id': {'$in': org_ids}})
        return [serialize_doc(o) for o in orgs]
    
    @staticmethod
    def update(org_id, data):
        data['updated_at'] = datetime.utcnow()
        Organization.get_collection().update_one(
            {'_id': deserialize_id(org_id)},
            {'$set': data}
        )
        return Organization.find_by_id(org_id)
    
    @staticmethod
    def delete(org_id):
        Organization.get_collection().delete_one({'_id': deserialize_id(org_id)})
        OrgMembership.delete_by_org(org_id)

class OrgMembership:
    collection_name = 'org_memberships'
    
    @staticmethod
    def get_collection():
        return get_db()[OrgMembership.collection_name]
    
    @staticmethod
    def create(org_id, user_id, role, invited_by):
        membership = {
            'org_id': deserialize_id(org_id),
            'user_id': deserialize_id(user_id),
            'role': role,
            'joined_at': datetime.utcnow(),
            'invited_by': deserialize_id(invited_by),
            'status': 'active'
        }
        result = OrgMembership.get_collection().insert_one(membership)
        membership['_id'] = result.inserted_id
        return serialize_doc(membership)
    
    @staticmethod
    def find_by_user(user_id):
        memberships = OrgMembership.get_collection().find({
            'user_id': deserialize_id(user_id),
            'status': 'active'
        })
        return [serialize_doc(m) for m in memberships]
    
    @staticmethod
    def find_by_org(org_id):
        memberships = OrgMembership.get_collection().find({
            'org_id': deserialize_id(org_id)
        })
        return [serialize_doc(m) for m in memberships]
    
    @staticmethod
    def find_one(org_id, user_id):
        membership = OrgMembership.get_collection().find_one({
            'org_id': deserialize_id(org_id),
            'user_id': deserialize_id(user_id)
        })
        return serialize_doc(membership)
    
    @staticmethod
    def update_role(org_id, user_id, role):
        OrgMembership.get_collection().update_one(
            {'org_id': deserialize_id(org_id), 'user_id': deserialize_id(user_id)},
            {'$set': {'role': role}}
        )
        return OrgMembership.find_one(org_id, user_id)
    
    @staticmethod
    def delete(org_id, user_id):
        OrgMembership.get_collection().delete_one({
            'org_id': deserialize_id(org_id),
            'user_id': deserialize_id(user_id)
        })
    
    @staticmethod
    def delete_by_org(org_id):
        OrgMembership.get_collection().delete_many({'org_id': deserialize_id(org_id)})
