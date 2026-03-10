"""
Script to merge duplicate organizations in the database.
This script will:
1. Find all organizations with duplicate names (case-insensitive)
2. Keep the oldest organization as the primary
3. Merge all members from duplicates into the primary
4. Transfer all projects from duplicates to the primary
5. Delete the duplicate organizations

Run this script from the backend directory:
    python scripts/merge_duplicate_orgs.py
"""

import os
import sys
from datetime import datetime

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()

from pymongo import MongoClient
from bson import ObjectId

# Database connection
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017')
MONGO_DB = os.getenv('MONGO_DB', 'project_management')

client = MongoClient(MONGO_URI)
db = client[MONGO_DB]

def find_duplicate_organizations():
    """Find all organizations with duplicate names (case-insensitive)"""
    pipeline = [
        {
            '$group': {
                '_id': {'$toLower': '$name'},
                'count': {'$sum': 1},
                'orgs': {'$push': {'_id': '$_id', 'name': '$name', 'created_at': '$created_at', 'owner_id': '$owner_id'}}
            }
        },
        {
            '$match': {
                'count': {'$gt': 1}
            }
        }
    ]
    
    duplicates = list(db.organizations.aggregate(pipeline))
    return duplicates


def merge_organizations(duplicate_group):
    """Merge duplicate organizations into the primary (oldest) one"""
    orgs = duplicate_group['orgs']
    
    # Sort by created_at to find the oldest (primary) organization
    orgs_sorted = sorted(orgs, key=lambda x: x.get('created_at', datetime.max))
    
    primary_org = orgs_sorted[0]
    duplicate_orgs = orgs_sorted[1:]
    
    primary_id = primary_org['_id']
    primary_name = primary_org['name']
    
    print(f"\n{'='*60}")
    print(f"Processing duplicates for: '{primary_name}'")
    print(f"Primary org ID: {primary_id}")
    print(f"Found {len(duplicate_orgs)} duplicate(s) to merge")
    
    for dup_org in duplicate_orgs:
        dup_id = dup_org['_id']
        print(f"\n  Merging duplicate org ID: {dup_id}")
        
        # 1. Merge members
        merge_members(primary_id, dup_id)
        
        # 2. Transfer projects
        transfer_projects(primary_id, dup_id)
        
        # 3. Transfer tasks (update org_id)
        transfer_tasks(primary_id, dup_id)
        
        # 4. Transfer notifications
        transfer_notifications(primary_id, dup_id)
        
        # 5. Delete duplicate organization memberships
        deleted_memberships = db.org_memberships.delete_many({'org_id': dup_id})
        print(f"    Deleted {deleted_memberships.deleted_count} duplicate memberships")
        
        # 6. Delete duplicate organization
        db.organizations.delete_one({'_id': dup_id})
        print(f"    Deleted duplicate organization")
    
    print(f"\n  ✓ Successfully merged all duplicates into '{primary_name}'")
    return primary_id


def merge_members(primary_org_id, duplicate_org_id):
    """Merge members from duplicate org into primary org"""
    # Get all members from duplicate org
    dup_members = list(db.org_memberships.find({'org_id': duplicate_org_id}))
    
    merged_count = 0
    skipped_count = 0
    
    for member in dup_members:
        user_id = member['user_id']
        
        # Check if user already exists in primary org
        existing = db.org_memberships.find_one({
            'org_id': primary_org_id,
            'user_id': user_id
        })
        
        if existing:
            # User already in primary org, keep higher role
            existing_role = existing.get('role', 'guest')
            new_role = member.get('role', 'guest')
            
            role_hierarchy = {'owner': 4, 'admin': 3, 'member': 2, 'guest': 1}
            
            if role_hierarchy.get(new_role, 0) > role_hierarchy.get(existing_role, 0):
                # Upgrade role (but don't make them owner if primary already has one)
                if new_role != 'owner':
                    db.org_memberships.update_one(
                        {'_id': existing['_id']},
                        {'$set': {'role': new_role}}
                    )
                    print(f"    Upgraded user {user_id} role from {existing_role} to {new_role}")
            skipped_count += 1
        else:
            # Add user to primary org
            new_membership = {
                'org_id': primary_org_id,
                'user_id': user_id,
                'role': member.get('role', 'member') if member.get('role') != 'owner' else 'admin',
                'joined_at': member.get('joined_at', datetime.utcnow()),
                'invited_by': member.get('invited_by'),
                'status': 'active'
            }
            db.org_memberships.insert_one(new_membership)
            merged_count += 1
    
    print(f"    Merged {merged_count} new members, skipped {skipped_count} existing")


def transfer_projects(primary_org_id, duplicate_org_id):
    """Transfer all projects from duplicate org to primary org"""
    result = db.projects.update_many(
        {'org_id': duplicate_org_id},
        {'$set': {'org_id': primary_org_id}}
    )
    print(f"    Transferred {result.modified_count} projects")


def transfer_tasks(primary_org_id, duplicate_org_id):
    """Transfer all tasks from duplicate org to primary org"""
    result = db.tasks.update_many(
        {'org_id': duplicate_org_id},
        {'$set': {'org_id': primary_org_id}}
    )
    print(f"    Transferred {result.modified_count} tasks")


def transfer_notifications(primary_org_id, duplicate_org_id):
    """Transfer all notifications from duplicate org to primary org"""
    result = db.notifications.update_many(
        {'org_id': duplicate_org_id},
        {'$set': {'org_id': primary_org_id}}
    )
    print(f"    Transferred {result.modified_count} notifications")


def print_summary():
    """Print current state of organizations"""
    print("\n" + "="*60)
    print("CURRENT ORGANIZATIONS IN DATABASE:")
    print("="*60)
    
    orgs = list(db.organizations.find())
    for org in orgs:
        member_count = db.org_memberships.count_documents({'org_id': org['_id']})
        project_count = db.projects.count_documents({'org_id': org['_id']})
        print(f"\n  Name: {org['name']}")
        print(f"  ID: {org['_id']}")
        print(f"  Members: {member_count}")
        print(f"  Projects: {project_count}")
        print(f"  Created: {org.get('created_at', 'N/A')}")


def main():
    print("\n" + "="*60)
    print("DUPLICATE ORGANIZATION MERGER")
    print("="*60)
    
    # Show current state
    print_summary()
    
    # Find duplicates
    duplicates = find_duplicate_organizations()
    
    if not duplicates:
        print("\n✓ No duplicate organizations found!")
        return
    
    print(f"\n⚠ Found {len(duplicates)} group(s) of duplicate organizations:")
    for dup in duplicates:
        names = [org['name'] for org in dup['orgs']]
        print(f"  - '{dup['_id']}' ({dup['count']} duplicates): {names}")
    
    # Confirm before proceeding
    print("\n" + "-"*60)
    response = input("Do you want to merge these duplicates? (yes/no): ")
    
    if response.lower() != 'yes':
        print("Operation cancelled.")
        return
    
    # Merge each group of duplicates
    for duplicate_group in duplicates:
        merge_organizations(duplicate_group)
    
    # Show final state
    print("\n" + "="*60)
    print("MERGE COMPLETE!")
    print_summary()
    
    print("\n✓ All duplicate organizations have been merged successfully!")


if __name__ == '__main__':
    main()
