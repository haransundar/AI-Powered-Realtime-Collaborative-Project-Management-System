from flask import Blueprint, request, jsonify
from app.models.project import Project, ProjectMember
from app.models.user import User
from app.utils.decorators import require_auth
from app.services.permission import PermissionService

project_bp = Blueprint('projects', __name__)

@project_bp.route('/organizations/<org_id>/projects', methods=['POST'])
@require_auth
def create_project(current_user, org_id):
    if not PermissionService.check_org_permission(current_user['_id'], org_id, 'create_project'):
        return jsonify({'error': {'code': 'AUTH_UNAUTHORIZED', 'message': 'Access denied'}}), 403
    
    data = request.get_json()
    if not data or not data.get('name'):
        return jsonify({'error': {'code': 'VALIDATION_ERROR', 'message': 'Project name required'}}), 400
    
    project = Project.create(org_id, data['name'], data.get('description'), current_user['_id'])
    return jsonify({'project': project}), 201

@project_bp.route('/organizations/<org_id>/projects', methods=['GET'])
@require_auth
def list_projects(current_user, org_id):
    if not PermissionService.can_access_org(current_user['_id'], org_id):
        return jsonify({'error': {'code': 'AUTH_UNAUTHORIZED', 'message': 'Access denied'}}), 403
    
    if PermissionService.is_org_admin(current_user['_id'], org_id):
        projects = Project.find_by_org(org_id)
    else:
        projects = Project.find_by_user(current_user['_id'], org_id)
    
    for project in projects:
        members = ProjectMember.find_by_project(project['_id'])
        project['member_count'] = len(members)
    
    return jsonify({'projects': projects}), 200

@project_bp.route('/projects/<project_id>', methods=['GET'])
@require_auth
def get_project(current_user, project_id):
    if not PermissionService.can_access_project(current_user['_id'], project_id):
        return jsonify({'error': {'code': 'AUTH_UNAUTHORIZED', 'message': 'Access denied'}}), 403
    
    project = Project.find_by_id(project_id)
    if not project:
        return jsonify({'error': {'code': 'RESOURCE_NOT_FOUND', 'message': 'Project not found'}}), 404
    
    members = ProjectMember.find_by_project(project_id)
    user_ids = [m['user_id'] for m in members]
    users = User.find_by_ids(user_ids)
    user_map = {u['_id']: u for u in users}
    
    for member in members:
        user = user_map.get(member['user_id'], {})
        member['user'] = {'_id': user.get('_id'), 'name': user.get('name'), 'email': user.get('email'), 'avatar_url': user.get('avatar_url')}
    
    project['members'] = members
    return jsonify({'project': project}), 200

@project_bp.route('/projects/<project_id>', methods=['PUT'])
@require_auth
def update_project(current_user, project_id):
    if not PermissionService.check_project_permission(current_user['_id'], project_id, 'manage_project'):
        return jsonify({'error': {'code': 'AUTH_UNAUTHORIZED', 'message': 'Access denied'}}), 403
    
    data = request.get_json()
    if not data:
        return jsonify({'error': {'code': 'VALIDATION_ERROR', 'message': 'Request body required'}}), 400
    
    allowed_fields = ['name', 'description', 'settings']
    update_data = {k: v for k, v in data.items() if k in allowed_fields}
    
    project = Project.update(project_id, update_data)
    return jsonify({'project': project}), 200

@project_bp.route('/projects/<project_id>/archive', methods=['POST'])
@require_auth
def archive_project(current_user, project_id):
    if not PermissionService.check_project_permission(current_user['_id'], project_id, 'manage_project'):
        return jsonify({'error': {'code': 'AUTH_UNAUTHORIZED', 'message': 'Access denied'}}), 403
    
    project = Project.archive(project_id)
    return jsonify({'project': project}), 200

@project_bp.route('/projects/<project_id>/members', methods=['POST'])
@require_auth
def add_project_member(current_user, project_id):
    if not PermissionService.check_project_permission(current_user['_id'], project_id, 'manage_members'):
        return jsonify({'error': {'code': 'AUTH_UNAUTHORIZED', 'message': 'Access denied'}}), 403
    
    data = request.get_json()
    if not data or not data.get('user_id'):
        return jsonify({'error': {'code': 'VALIDATION_ERROR', 'message': 'User ID required'}}), 400
    
    role = data.get('role', 'contributor')
    if role not in ['project_manager', 'contributor', 'viewer']:
        return jsonify({'error': {'code': 'VALIDATION_ERROR', 'message': 'Invalid role'}}), 400
    
    project = Project.find_by_id(project_id)
    if not PermissionService.can_access_org(data['user_id'], project['org_id']):
        return jsonify({'error': {'code': 'VALIDATION_ERROR', 'message': 'User must be organization member'}}), 400
    
    existing = ProjectMember.find_one(project_id, data['user_id'])
    if existing:
        return jsonify({'error': {'code': 'VALIDATION_ERROR', 'message': 'User already a project member'}}), 400
    
    member = ProjectMember.create(project_id, data['user_id'], role, current_user['_id'])
    return jsonify({'member': member}), 201

@project_bp.route('/projects/<project_id>/members/<user_id>', methods=['PUT'])
@require_auth
def update_project_member_role(current_user, project_id, user_id):
    if not PermissionService.check_project_permission(current_user['_id'], project_id, 'manage_members'):
        return jsonify({'error': {'code': 'AUTH_UNAUTHORIZED', 'message': 'Access denied'}}), 403
    
    data = request.get_json()
    if not data or not data.get('role'):
        return jsonify({'error': {'code': 'VALIDATION_ERROR', 'message': 'Role required'}}), 400
    
    role = data['role']
    if role not in ['project_manager', 'contributor', 'viewer']:
        return jsonify({'error': {'code': 'VALIDATION_ERROR', 'message': 'Invalid role'}}), 400
    
    member = ProjectMember.update_role(project_id, user_id, role)
    return jsonify({'member': member}), 200

@project_bp.route('/projects/<project_id>/members/<user_id>', methods=['DELETE'])
@require_auth
def remove_project_member(current_user, project_id, user_id):
    if not PermissionService.check_project_permission(current_user['_id'], project_id, 'manage_members'):
        return jsonify({'error': {'code': 'AUTH_UNAUTHORIZED', 'message': 'Access denied'}}), 403
    
    ProjectMember.delete(project_id, user_id)
    return jsonify({'message': 'Member removed successfully'}), 200
