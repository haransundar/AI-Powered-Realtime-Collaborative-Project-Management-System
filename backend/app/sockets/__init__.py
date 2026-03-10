from flask_socketio import join_room, leave_room, emit
from app.services.auth import AuthService
from app.services.permission import PermissionService
from app.models.task import TaskLock

connected_users = {}

def register_socket_handlers(socketio):
    @socketio.on('connect')
    def handle_connect():
        pass
    
    @socketio.on('disconnect')
    def handle_disconnect():
        from flask import request
        socket_id = request.sid
        if socket_id in connected_users:
            user_data = connected_users[socket_id]
            for project_id in user_data.get('projects', []):
                leave_room(f'project_{project_id}')
            del connected_users[socket_id]
    
    @socketio.on('authenticate')
    def handle_authenticate(data):
        from flask import request
        token = data.get('token')
        if not token:
            emit('auth_error', {'message': 'Token required'})
            return
        
        user = AuthService.get_current_user(token)
        if not user:
            emit('auth_error', {'message': 'Invalid token'})
            return
        
        socket_id = request.sid
        connected_users[socket_id] = {
            'user_id': user['_id'],
            'user': user,
            'projects': []
        }
        emit('authenticated', {'user': user})
    
    @socketio.on('join_project')
    def handle_join_project(data):
        from flask import request
        socket_id = request.sid
        
        if socket_id not in connected_users:
            emit('error', {'message': 'Not authenticated'})
            return
        
        project_id = data.get('project_id')
        if not project_id:
            emit('error', {'message': 'Project ID required'})
            return
        
        user_id = connected_users[socket_id]['user_id']
        if not PermissionService.can_access_project(user_id, project_id):
            emit('error', {'message': 'Access denied'})
            return
        
        room = f'project_{project_id}'
        join_room(room)
        connected_users[socket_id]['projects'].append(project_id)
        
        emit('joined_project', {'project_id': project_id})
        emit('user_joined', {
            'user': connected_users[socket_id]['user'],
            'project_id': project_id
        }, room=room, include_self=False)
    
    @socketio.on('leave_project')
    def handle_leave_project(data):
        from flask import request
        socket_id = request.sid
        
        if socket_id not in connected_users:
            return
        
        project_id = data.get('project_id')
        if not project_id:
            return
        
        room = f'project_{project_id}'
        leave_room(room)
        
        if project_id in connected_users[socket_id]['projects']:
            connected_users[socket_id]['projects'].remove(project_id)
        
        emit('user_left', {
            'user': connected_users[socket_id]['user'],
            'project_id': project_id
        }, room=room)
    
    @socketio.on('start_drag')
    def handle_start_drag(data):
        from flask import request
        socket_id = request.sid
        
        if socket_id not in connected_users:
            emit('error', {'message': 'Not authenticated'})
            return
        
        task_id = data.get('task_id')
        if not task_id:
            emit('error', {'message': 'Task ID required'})
            return
        
        user_id = connected_users[socket_id]['user_id']
        lock = TaskLock.acquire(task_id, user_id, socket_id)
        
        if not lock:
            emit('drag_rejected', {'task_id': task_id, 'message': 'Task is locked'})
            return
        
        emit('drag_started', {'task_id': task_id, 'user': connected_users[socket_id]['user']})
        
        from app.models.task import Task
        task = Task.find_by_id(task_id)
        if task:
            emit('task_locked', {
                'task_id': task_id,
                'user': connected_users[socket_id]['user']
            }, room=f'project_{task["project_id"]}', include_self=False)
    
    @socketio.on('end_drag')
    def handle_end_drag(data):
        from flask import request
        socket_id = request.sid
        
        if socket_id not in connected_users:
            return
        
        task_id = data.get('task_id')
        if not task_id:
            return
        
        user_id = connected_users[socket_id]['user_id']
        TaskLock.release(task_id, user_id)
        
        from app.models.task import Task
        task = Task.find_by_id(task_id)
        if task:
            emit('task_unlocked', {'task_id': task_id}, room=f'project_{task["project_id"]}')
    
    @socketio.on('cancel_drag')
    def handle_cancel_drag(data):
        handle_end_drag(data)
    
    @socketio.on('typing_comment')
    def handle_typing(data):
        from flask import request
        socket_id = request.sid
        
        if socket_id not in connected_users:
            return
        
        task_id = data.get('task_id')
        if not task_id:
            return
        
        from app.models.task import Task
        task = Task.find_by_id(task_id)
        if task:
            emit('user_typing', {
                'task_id': task_id,
                'user': connected_users[socket_id]['user']
            }, room=f'project_{task["project_id"]}', include_self=False)
