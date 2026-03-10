from functools import wraps
from flask import request, jsonify
from app.services.auth import AuthService
from app.services.permission import PermissionService

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': {'code': 'AUTH_UNAUTHORIZED', 'message': 'Authorization required'}}), 401
        
        token = auth_header.split(' ')[1]
        user = AuthService.get_current_user(token)
        if not user:
            return jsonify({'error': {'code': 'AUTH_TOKEN_EXPIRED', 'message': 'Invalid or expired token'}}), 401
        
        return f(current_user=user, *args, **kwargs)
    return decorated

def require_org_permission(permission):
    def decorator(f):
        @wraps(f)
        def decorated(current_user, org_id, *args, **kwargs):
            if not PermissionService.check_org_permission(current_user['_id'], org_id, permission):
                return jsonify({'error': {'code': 'AUTH_UNAUTHORIZED', 'message': 'Insufficient permissions'}}), 403
            return f(current_user=current_user, org_id=org_id, *args, **kwargs)
        return decorated
    return decorator

def require_project_permission(permission):
    def decorator(f):
        @wraps(f)
        def decorated(current_user, project_id, *args, **kwargs):
            if not PermissionService.check_project_permission(current_user['_id'], project_id, permission):
                return jsonify({'error': {'code': 'AUTH_UNAUTHORIZED', 'message': 'Insufficient permissions'}}), 403
            return f(current_user=current_user, project_id=project_id, *args, **kwargs)
        return decorated
    return decorator

def require_task_permission(permission):
    def decorator(f):
        @wraps(f)
        def decorated(current_user, task_id, *args, **kwargs):
            if not PermissionService.check_task_permission(current_user['_id'], task_id, permission):
                return jsonify({'error': {'code': 'AUTH_UNAUTHORIZED', 'message': 'Insufficient permissions'}}), 403
            return f(current_user=current_user, task_id=task_id, *args, **kwargs)
        return decorated
    return decorator
