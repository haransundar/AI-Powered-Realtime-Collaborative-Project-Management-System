from flask import Blueprint, request, jsonify
from app.models.task import Task, TaskStatusHistory, TaskLock
from app.models.project import Project
from app.models.notification import Notification
from app.models.user import User
from app.utils.decorators import require_auth
from app.services.permission import PermissionService
from app import socketio

task_bp = Blueprint('tasks', __name__)

@task_bp.route('/projects/<project_id>/tasks', methods=['POST'])
@require_auth
def create_task(current_user, project_id):
    if not PermissionService.check_project_permission(current_user['_id'], project_id, 'create_task'):
        return jsonify({'error': {'code': 'AUTH_UNAUTHORIZED', 'message': 'Access denied'}}), 403
    
    project = Project.find_by_id(project_id)
    if not project:
        return jsonify({'error': {'code': 'RESOURCE_NOT_FOUND', 'message': 'Project not found'}}), 404
    
    data = request.get_json()
    if not data or not data.get('title'):
        return jsonify({'error': {'code': 'VALIDATION_ERROR', 'message': 'Task title required'}}), 400
    
    try:
        task = Task.create(
            project_id=project_id,
            org_id=project['org_id'],
            title=data['title'],
            creator_id=current_user['_id'],
            description=data.get('description'),
            priority=data.get('priority', 'medium'),
            assignees=data.get('assignees', []),
            due_date=data.get('due_date'),
            time_estimate_hours=data.get('time_estimate_hours'),
            status=data.get('status', 'backlog')
        )
        
        for assignee_id in data.get('assignees', []):
            if str(assignee_id) != str(current_user['_id']):
                Notification.create_task_assigned(task, assignee_id, project['org_id'])
        
        socketio.emit('task_created', {'task': task}, room=f'project_{project_id}')
        return jsonify({'task': task}), 201
    except ValueError as e:
        return jsonify({'error': {'code': 'VALIDATION_ERROR', 'message': str(e)}}), 400

@task_bp.route('/projects/<project_id>/tasks', methods=['GET'])
@require_auth
def list_tasks(current_user, project_id):
    if not PermissionService.can_access_project(current_user['_id'], project_id):
        return jsonify({'error': {'code': 'AUTH_UNAUTHORIZED', 'message': 'Access denied'}}), 403
    
    status = request.args.get('status')
    priority = request.args.get('priority')
    assignee = request.args.get('assignee')
    
    tasks = Task.find_by_project(project_id, status=status, priority=priority, assignee=assignee)
    
    tasks_by_status = {'backlog': [], 'todo': [], 'in_progress': [], 'review': [], 'done': []}
    for task in tasks:
        status_key = task.get('status', 'backlog')
        if status_key in tasks_by_status:
            tasks_by_status[status_key].append(task)
    
    return jsonify({'tasks': tasks, 'tasks_by_status': tasks_by_status}), 200

@task_bp.route('/tasks/<task_id>', methods=['GET'])
@require_auth
def get_task(current_user, task_id):
    if not PermissionService.check_task_permission(current_user['_id'], task_id, 'view_all'):
        return jsonify({'error': {'code': 'AUTH_UNAUTHORIZED', 'message': 'Access denied'}}), 403
    
    task = Task.find_by_id(task_id)
    if not task:
        return jsonify({'error': {'code': 'RESOURCE_NOT_FOUND', 'message': 'Task not found'}}), 404
    
    assignee_ids = task.get('assignees', [])
    if assignee_ids:
        users = User.find_by_ids(assignee_ids)
        task['assignee_details'] = [{'_id': u['_id'], 'name': u['name'], 'avatar_url': u.get('avatar_url')} for u in users]
    
    creator = User.find_by_id(task.get('creator_id'))
    if creator:
        task['creator'] = {'_id': creator['_id'], 'name': creator['name'], 'avatar_url': creator.get('avatar_url')}
    
    task['history'] = TaskStatusHistory.find_by_task(task_id)
    
    return jsonify({'task': task}), 200

@task_bp.route('/tasks/<task_id>', methods=['PUT'])
@require_auth
def update_task(current_user, task_id):
    if not PermissionService.check_task_permission(current_user['_id'], task_id, 'edit_task'):
        return jsonify({'error': {'code': 'AUTH_UNAUTHORIZED', 'message': 'Access denied'}}), 403
    
    task = Task.find_by_id(task_id)
    if not task:
        return jsonify({'error': {'code': 'RESOURCE_NOT_FOUND', 'message': 'Task not found'}}), 404
    
    if TaskLock.is_locked(task_id, exclude_user_id=current_user['_id']):
        return jsonify({'error': {'code': 'TASK_LOCKED', 'message': 'Task is being edited by another user'}}), 423
    
    data = request.get_json()
    if not data:
        return jsonify({'error': {'code': 'VALIDATION_ERROR', 'message': 'Request body required'}}), 400
    
    client_version = data.pop('version', None)
    if client_version and client_version != task.get('version'):
        return jsonify({
            'error': {'code': 'CONFLICT_DETECTED', 'message': 'Task was modified by another user'},
            'server_version': task
        }), 409
    
    allowed_fields = ['title', 'description', 'status', 'priority', 'due_date', 'time_estimate_hours']
    update_data = {k: v for k, v in data.items() if k in allowed_fields}
    
    try:
        updated_task = Task.update(task_id, update_data, current_user['_id'])
        
        notify_users = set(task.get('assignees', []))
        if task.get('creator_id'):
            notify_users.add(task['creator_id'])
        notify_users.discard(current_user['_id'])
        
        if notify_users:
            Notification.create_task_updated(updated_task, list(notify_users), task['org_id'], 'Task details updated')
        
        socketio.emit('task_updated', {'task': updated_task}, room=f'project_{task["project_id"]}')
        return jsonify({'task': updated_task}), 200
    except ValueError as e:
        return jsonify({'error': {'code': 'VALIDATION_ERROR', 'message': str(e)}}), 400

@task_bp.route('/tasks/<task_id>/status', methods=['PATCH'])
@require_auth
def update_task_status(current_user, task_id):
    if not PermissionService.check_task_permission(current_user['_id'], task_id, 'edit_task'):
        return jsonify({'error': {'code': 'AUTH_UNAUTHORIZED', 'message': 'Access denied'}}), 403
    
    task = Task.find_by_id(task_id)
    if not task:
        return jsonify({'error': {'code': 'RESOURCE_NOT_FOUND', 'message': 'Task not found'}}), 404
    
    data = request.get_json()
    if not data or not data.get('status'):
        return jsonify({'error': {'code': 'VALIDATION_ERROR', 'message': 'Status required'}}), 400
    
    try:
        updated_task = Task.update_status(task_id, data['status'], current_user['_id'])
        
        notify_users = set(task.get('assignees', []))
        notify_users.discard(current_user['_id'])
        if notify_users:
            Notification.create_task_updated(updated_task, list(notify_users), task['org_id'], f'Status changed to {data["status"]}')
        
        socketio.emit('task_updated', {'task': updated_task}, room=f'project_{task["project_id"]}')
        return jsonify({'task': updated_task}), 200
    except ValueError as e:
        return jsonify({'error': {'code': 'VALIDATION_ERROR', 'message': str(e)}}), 400

@task_bp.route('/tasks/<task_id>/assignees', methods=['POST'])
@require_auth
def add_assignees(current_user, task_id):
    if not PermissionService.check_task_permission(current_user['_id'], task_id, 'edit_task'):
        return jsonify({'error': {'code': 'AUTH_UNAUTHORIZED', 'message': 'Access denied'}}), 403
    
    task = Task.find_by_id(task_id)
    if not task:
        return jsonify({'error': {'code': 'RESOURCE_NOT_FOUND', 'message': 'Task not found'}}), 404
    
    data = request.get_json()
    if not data or not data.get('user_ids'):
        return jsonify({'error': {'code': 'VALIDATION_ERROR', 'message': 'User IDs required'}}), 400
    
    updated_task = Task.add_assignees(task_id, data['user_ids'])
    
    for user_id in data['user_ids']:
        if str(user_id) != str(current_user['_id']):
            Notification.create_task_assigned(updated_task, user_id, task['org_id'])
    
    socketio.emit('task_updated', {'task': updated_task}, room=f'project_{task["project_id"]}')
    return jsonify({'task': updated_task}), 200

@task_bp.route('/tasks/<task_id>/dependencies', methods=['POST'])
@require_auth
def add_dependency(current_user, task_id):
    if not PermissionService.check_task_permission(current_user['_id'], task_id, 'edit_task'):
        return jsonify({'error': {'code': 'AUTH_UNAUTHORIZED', 'message': 'Access denied'}}), 403
    
    data = request.get_json()
    if not data or not data.get('depends_on'):
        return jsonify({'error': {'code': 'VALIDATION_ERROR', 'message': 'Dependency task ID required'}}), 400
    
    try:
        task = Task.add_dependency(task_id, data['depends_on'], current_user['_id'])
        socketio.emit('task_updated', {'task': task}, room=f'project_{task["project_id"]}')
        return jsonify({'task': task}), 200
    except ValueError as e:
        return jsonify({'error': {'code': 'CIRCULAR_DEPENDENCY', 'message': str(e)}}), 400

@task_bp.route('/tasks/<task_id>/dependencies/<dep_id>', methods=['DELETE'])
@require_auth
def remove_dependency(current_user, task_id, dep_id):
    if not PermissionService.check_task_permission(current_user['_id'], task_id, 'edit_task'):
        return jsonify({'error': {'code': 'AUTH_UNAUTHORIZED', 'message': 'Access denied'}}), 403
    
    task = Task.remove_dependency(task_id, dep_id)
    socketio.emit('task_updated', {'task': task}, room=f'project_{task["project_id"]}')
    return jsonify({'task': task}), 200

@task_bp.route('/tasks/<task_id>', methods=['DELETE'])
@require_auth
def delete_task(current_user, task_id):
    if not PermissionService.check_task_permission(current_user['_id'], task_id, 'delete_task'):
        return jsonify({'error': {'code': 'AUTH_UNAUTHORIZED', 'message': 'Access denied'}}), 403
    
    task = Task.find_by_id(task_id)
    if not task:
        return jsonify({'error': {'code': 'RESOURCE_NOT_FOUND', 'message': 'Task not found'}}), 404
    
    project_id = task['project_id']
    Task.delete(task_id)
    
    socketio.emit('task_deleted', {'task_id': task_id}, room=f'project_{project_id}')
    return jsonify({'message': 'Task deleted successfully'}), 200

@task_bp.route('/tasks/<task_id>/lock', methods=['POST'])
@require_auth
def acquire_lock(current_user, task_id):
    data = request.get_json() or {}
    socket_id = data.get('socket_id', '')
    
    lock = TaskLock.acquire(task_id, current_user['_id'], socket_id)
    if not lock:
        return jsonify({'error': {'code': 'TASK_LOCKED', 'message': 'Task is locked by another user'}}), 423
    
    task = Task.find_by_id(task_id)
    socketio.emit('task_locked', {'task_id': task_id, 'user_id': current_user['_id']}, room=f'project_{task["project_id"]}')
    return jsonify({'lock': lock}), 200

@task_bp.route('/tasks/<task_id>/lock', methods=['DELETE'])
@require_auth
def release_lock(current_user, task_id):
    TaskLock.release(task_id, current_user['_id'])
    
    task = Task.find_by_id(task_id)
    if task:
        socketio.emit('task_unlocked', {'task_id': task_id}, room=f'project_{task["project_id"]}')
    return jsonify({'message': 'Lock released'}), 200
