from flask import Blueprint, request, jsonify
from app.models.organization import Organization, OrgMembership
from app.models.project import ProjectMember
from app.models.user import User
from app.utils.decorators import require_auth
from app.services.permission import PermissionService
from app.services.ai import AIService

org_bp = Blueprint('organizations', __name__)

@org_bp.route('/check-name', methods=['POST'])
@require_auth
def check_organization_name(current_user):
    """Check if organization name is available and get suggestions if not"""
    data = request.get_json()
    if not data or not data.get('name'):
        return jsonify({'error': {'code': 'VALIDATION_ERROR', 'message': 'Organization name required'}}), 400
    
    name = data['name'].strip()
    if len(name) < 2:
        return jsonify({'error': {'code': 'VALIDATION_ERROR', 'message': 'Organization name must be at least 2 characters'}}), 400
    
    existing_names = Organization.get_all_names()
    result = AIService.check_organization_name(name, existing_names)
    
    return jsonify(result), 200

@org_bp.route('', methods=['POST'])
@require_auth
def create_organization(current_user):
    data = request.get_json()
    if not data or not data.get('name'):
        return jsonify({'error': {'code': 'VALIDATION_ERROR', 'message': 'Organization name required'}}), 400
    
    name = data['name'].strip()
    if len(name) < 2:
        return jsonify({'error': {'code': 'VALIDATION_ERROR', 'message': 'Organization name must be at least 2 characters'}}), 400
    
    # Check for duplicate name and provide suggestions
    if Organization.name_exists(name):
        existing_names = Organization.get_all_names()
        suggestions = AIService.suggest_organization_names(name, existing_names)
        return jsonify({
            'error': {
                'code': 'DUPLICATE_NAME',
                'message': f"Organization name '{name}' already exists"
            },
            'suggestions': suggestions.get('suggestions', []),
            'reason': suggestions.get('reason', '')
        }), 409
    
    try:
        org = Organization.create(name, current_user['_id'])
        return jsonify({'organization': org}), 201
    except ValueError as e:
        existing_names = Organization.get_all_names()
        suggestions = AIService.suggest_organization_names(name, existing_names)
        return jsonify({
            'error': {
                'code': 'DUPLICATE_NAME',
                'message': str(e)
            },
            'suggestions': suggestions.get('suggestions', []),
            'reason': suggestions.get('reason', '')
        }), 409

@org_bp.route('', methods=['GET'])
@require_auth
def list_organizations(current_user):
    orgs = Organization.find_by_user(current_user['_id'])
    return jsonify({'organizations': orgs}), 200

@org_bp.route('/<org_id>', methods=['GET'])
@require_auth
def get_organization(current_user, org_id):
    if not PermissionService.can_access_org(current_user['_id'], org_id):
        return jsonify({'error': {'code': 'AUTH_UNAUTHORIZED', 'message': 'Access denied'}}), 403
    
    org = Organization.find_by_id(org_id)
    if not org:
        return jsonify({'error': {'code': 'RESOURCE_NOT_FOUND', 'message': 'Organization not found'}}), 404
    
    members = OrgMembership.find_by_org(org_id)
    user_ids = [m['user_id'] for m in members]
    users = User.find_by_ids(user_ids)
    user_map = {u['_id']: u for u in users}
    
    for member in members:
        user = user_map.get(member['user_id'], {})
        member['user'] = {'_id': user.get('_id'), 'name': user.get('name'), 'email': user.get('email'), 'avatar_url': user.get('avatar_url')}
    
    org['members'] = members
    return jsonify({'organization': org}), 200

@org_bp.route('/<org_id>', methods=['PUT'])
@require_auth
def update_organization(current_user, org_id):
    if not PermissionService.check_org_permission(current_user['_id'], org_id, 'manage_org'):
        return jsonify({'error': {'code': 'AUTH_UNAUTHORIZED', 'message': 'Access denied'}}), 403
    
    data = request.get_json()
    if not data:
        return jsonify({'error': {'code': 'VALIDATION_ERROR', 'message': 'Request body required'}}), 400
    
    allowed_fields = ['name', 'settings']
    update_data = {k: v for k, v in data.items() if k in allowed_fields}
    
    org = Organization.update(org_id, update_data)
    return jsonify({'organization': org}), 200

@org_bp.route('/<org_id>/invite', methods=['POST'])
@require_auth
def invite_member(current_user, org_id):
    if not PermissionService.check_org_permission(current_user['_id'], org_id, 'manage_members'):
        return jsonify({'error': {'code': 'AUTH_UNAUTHORIZED', 'message': 'Access denied'}}), 403
    
    data = request.get_json()
    if not data or not data.get('email'):
        return jsonify({'error': {'code': 'VALIDATION_ERROR', 'message': 'Email required'}}), 400
    
    role = data.get('role', 'member')
    if role not in ['admin', 'member', 'guest']:
        return jsonify({'error': {'code': 'VALIDATION_ERROR', 'message': 'Invalid role'}}), 400
    
    user = User.find_by_email(data['email'])
    if not user:
        return jsonify({'error': {'code': 'RESOURCE_NOT_FOUND', 'message': 'User not found'}}), 404
    
    existing = OrgMembership.find_one(org_id, user['_id'])
    if existing:
        return jsonify({'error': {'code': 'VALIDATION_ERROR', 'message': 'User already a member'}}), 400
    
    membership = OrgMembership.create(org_id, user['_id'], role, current_user['_id'])
    return jsonify({'membership': membership}), 201

@org_bp.route('/<org_id>/members/<user_id>', methods=['PUT'])
@require_auth
def update_member_role(current_user, org_id, user_id):
    if not PermissionService.check_org_permission(current_user['_id'], org_id, 'manage_members'):
        return jsonify({'error': {'code': 'AUTH_UNAUTHORIZED', 'message': 'Access denied'}}), 403
    
    data = request.get_json()
    if not data or not data.get('role'):
        return jsonify({'error': {'code': 'VALIDATION_ERROR', 'message': 'Role required'}}), 400
    
    role = data['role']
    if role not in ['admin', 'member', 'guest']:
        return jsonify({'error': {'code': 'VALIDATION_ERROR', 'message': 'Invalid role'}}), 400
    
    membership = OrgMembership.update_role(org_id, user_id, role)
    if not membership:
        return jsonify({'error': {'code': 'RESOURCE_NOT_FOUND', 'message': 'Membership not found'}}), 404
    
    return jsonify({'membership': membership}), 200

@org_bp.route('/<org_id>/members/<user_id>', methods=['DELETE'])
@require_auth
def remove_member(current_user, org_id, user_id):
    if not PermissionService.check_org_permission(current_user['_id'], org_id, 'manage_members'):
        return jsonify({'error': {'code': 'AUTH_UNAUTHORIZED', 'message': 'Access denied'}}), 403
    
    org = Organization.find_by_id(org_id)
    if str(org.get('owner_id')) == str(user_id):
        return jsonify({'error': {'code': 'VALIDATION_ERROR', 'message': 'Cannot remove organization owner'}}), 400
    
    OrgMembership.delete(org_id, user_id)
    ProjectMember.delete_by_user(user_id)
    
    return jsonify({'message': 'Member removed successfully'}), 200

@org_bp.route('/<org_id>/members', methods=['GET'])
@require_auth
def list_members(current_user, org_id):
    if not PermissionService.can_access_org(current_user['_id'], org_id):
        return jsonify({'error': {'code': 'AUTH_UNAUTHORIZED', 'message': 'Access denied'}}), 403
    
    members = OrgMembership.find_by_org(org_id)
    user_ids = [m['user_id'] for m in members]
    users = User.find_by_ids(user_ids)
    user_map = {u['_id']: u for u in users}
    
    for member in members:
        user = user_map.get(member['user_id'], {})
        member['user'] = {'_id': user.get('_id'), 'name': user.get('name'), 'email': user.get('email'), 'avatar_url': user.get('avatar_url')}
    
    return jsonify({'members': members}), 200

@org_bp.route('/<org_id>', methods=['DELETE'])
@require_auth
def delete_organization(current_user, org_id):
    if not PermissionService.check_org_permission(current_user['_id'], org_id, 'delete_org'):
        return jsonify({'error': {'code': 'AUTH_UNAUTHORIZED', 'message': 'Only the owner can delete the organization'}}), 403
    
    org = Organization.find_by_id(org_id)
    if not org:
        return jsonify({'error': {'code': 'RESOURCE_NOT_FOUND', 'message': 'Organization not found'}}), 404
    
    # Verify the current user is the owner
    if str(org.get('owner_id')) != str(current_user['_id']):
        return jsonify({'error': {'code': 'AUTH_UNAUTHORIZED', 'message': 'Only the owner can delete the organization'}}), 403
    
    # Delete all projects in the organization
    from app.models.project import Project
    from app.models.task import Task
    
    projects = Project.find_by_org(org_id)
    for project in projects:
        # Delete all tasks in the project
        tasks = Task.find_by_project(project['_id'])
        for task in tasks:
            Task.delete(task['_id'])
        # Delete the project
        Project.delete(project['_id'])
    
    # Delete the organization (this also deletes memberships)
    Organization.delete(org_id)
    
    return jsonify({'message': 'Organization deleted successfully'}), 200
