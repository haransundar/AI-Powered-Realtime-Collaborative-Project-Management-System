from app.models.organization import OrgMembership
from app.models.project import ProjectMember, Project
from app.models.task import Task

ORG_ROLE_HIERARCHY = {'owner': 4, 'admin': 3, 'member': 2, 'guest': 1}
PROJECT_ROLE_HIERARCHY = {'project_manager': 3, 'contributor': 2, 'viewer': 1}

ORG_PERMISSIONS = {
    'owner': ['manage_org', 'manage_members', 'create_project', 'view_all', 'delete_org'],
    'admin': ['manage_members', 'create_project', 'view_all'],
    'member': ['view_assigned', 'create_task'],
    'guest': ['view_shared']
}

PROJECT_PERMISSIONS = {
    'project_manager': ['manage_project', 'manage_members', 'create_task', 'edit_task', 'delete_task', 'view_all'],
    'contributor': ['create_task', 'edit_task', 'comment', 'view_all'],
    'viewer': ['view_all', 'comment']
}

class PermissionService:
    @staticmethod
    def get_org_role(user_id, org_id):
        membership = OrgMembership.find_one(org_id, user_id)
        return membership.get('role') if membership else None
    
    @staticmethod
    def get_project_role(user_id, project_id):
        member = ProjectMember.find_one(project_id, user_id)
        return member.get('role') if member else None
    
    @staticmethod
    def check_org_permission(user_id, org_id, action):
        role = PermissionService.get_org_role(user_id, org_id)
        if not role:
            return False
        return action in ORG_PERMISSIONS.get(role, [])
    
    @staticmethod
    def check_project_permission(user_id, project_id, action):
        project = Project.find_by_id(project_id)
        if not project:
            return False
        
        org_role = PermissionService.get_org_role(user_id, project['org_id'])
        if org_role in ['owner', 'admin']:
            return True
        
        project_role = PermissionService.get_project_role(user_id, project_id)
        if not project_role:
            return False
        return action in PROJECT_PERMISSIONS.get(project_role, [])
    
    @staticmethod
    def check_task_permission(user_id, task_id, action):
        task = Task.find_by_id(task_id)
        if not task:
            return False
        
        if PermissionService.check_project_permission(user_id, task['project_id'], action):
            return True
        
        if str(task.get('creator_id')) == str(user_id):
            if action in ['edit_task', 'delete_task', 'view_all']:
                return True
        
        if str(user_id) in [str(a) for a in task.get('assignees', [])]:
            if action in ['edit_task', 'comment', 'view_all']:
                return True
        
        return False
    
    @staticmethod
    def get_effective_permissions(user_id, org_id, project_id=None, task_id=None):
        permissions = set()
        
        org_role = PermissionService.get_org_role(user_id, org_id)
        if org_role:
            permissions.update(ORG_PERMISSIONS.get(org_role, []))
        
        if project_id:
            project_role = PermissionService.get_project_role(user_id, project_id)
            if project_role:
                permissions.update(PROJECT_PERMISSIONS.get(project_role, []))
        
        if task_id:
            task = Task.find_by_id(task_id)
            if task:
                if str(task.get('creator_id')) == str(user_id):
                    permissions.update(['edit_task', 'delete_task'])
                if str(user_id) in [str(a) for a in task.get('assignees', [])]:
                    permissions.update(['edit_task', 'comment'])
        
        return list(permissions)
    
    @staticmethod
    def can_access_org(user_id, org_id):
        return PermissionService.get_org_role(user_id, org_id) is not None
    
    @staticmethod
    def can_access_project(user_id, project_id):
        project = Project.find_by_id(project_id)
        if not project:
            return False
        
        org_role = PermissionService.get_org_role(user_id, project['org_id'])
        if org_role in ['owner', 'admin']:
            return True
        
        return PermissionService.get_project_role(user_id, project_id) is not None
    
    @staticmethod
    def is_org_admin(user_id, org_id):
        role = PermissionService.get_org_role(user_id, org_id)
        return role in ['owner', 'admin']
