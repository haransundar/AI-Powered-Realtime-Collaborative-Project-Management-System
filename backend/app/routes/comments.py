from flask import Blueprint, request, jsonify
from app.models.comment import Comment
from app.models.task import Task
from app.models.notification import Notification
from app.models.user import User
from app.utils.decorators import require_auth
from app.services.permission import PermissionService
from app import socketio

comment_bp = Blueprint('comments', __name__)

@comment_bp.route('/tasks/<task_id>/comments', methods=['POST'])
@require_auth
def create_comment(current_user, task_id):
    if not PermissionService.check_task_permission(current_user['_id'], task_id, 'comment'):
        return jsonify({'error': {'code': 'AUTH_UNAUTHORIZED', 'message': 'Access denied'}}), 403
    
    task = Task.find_by_id(task_id)
    if not task:
        return jsonify({'error': {'code': 'RESOURCE_NOT_FOUND', 'message': 'Task not found'}}), 404
    
    data = request.get_json()
    if not data or not data.get('content'):
        return jsonify({'error': {'code': 'VALIDATION_ERROR', 'message': 'Comment content required'}}), 400
    
    comment = Comment.create(
        task_id=task_id,
        org_id=task['org_id'],
        author_id=current_user['_id'],
        content=data['content'],
        parent_id=data.get('parent_id')
    )
    
    author = User.find_by_id(current_user['_id'])
    comment['author'] = {'_id': author['_id'], 'name': author['name'], 'avatar_url': author.get('avatar_url')}
    
    notify_users = set(task.get('assignees', []))
    if task.get('creator_id'):
        notify_users.add(task['creator_id'])
    notify_users.discard(current_user['_id'])
    
    if notify_users:
        Notification.create_comment_added(task, comment, list(notify_users), task['org_id'])
    
    socketio.emit('comment_created', {'comment': comment, 'task_id': task_id}, room=f'project_{task["project_id"]}')
    return jsonify({'comment': comment}), 201

@comment_bp.route('/tasks/<task_id>/comments', methods=['GET'])
@require_auth
def list_comments(current_user, task_id):
    if not PermissionService.check_task_permission(current_user['_id'], task_id, 'view_all'):
        return jsonify({'error': {'code': 'AUTH_UNAUTHORIZED', 'message': 'Access denied'}}), 403
    
    comments = Comment.find_by_task(task_id)
    
    author_ids = set()
    def collect_author_ids(comment_list):
        for c in comment_list:
            author_ids.add(c['author_id'])
            if c.get('replies'):
                collect_author_ids(c['replies'])
    collect_author_ids(comments)
    
    users = User.find_by_ids(list(author_ids))
    user_map = {u['_id']: u for u in users}
    
    def add_author_details(comment_list):
        for c in comment_list:
            author = user_map.get(c['author_id'], {})
            c['author'] = {'_id': author.get('_id'), 'name': author.get('name'), 'avatar_url': author.get('avatar_url')}
            if c.get('replies'):
                add_author_details(c['replies'])
    add_author_details(comments)
    
    return jsonify({'comments': comments}), 200

@comment_bp.route('/comments/<comment_id>', methods=['PUT'])
@require_auth
def update_comment(current_user, comment_id):
    comment = Comment.find_by_id(comment_id)
    if not comment:
        return jsonify({'error': {'code': 'RESOURCE_NOT_FOUND', 'message': 'Comment not found'}}), 404
    
    if str(comment['author_id']) != str(current_user['_id']):
        return jsonify({'error': {'code': 'AUTH_UNAUTHORIZED', 'message': 'Can only edit your own comments'}}), 403
    
    data = request.get_json()
    if not data or not data.get('content'):
        return jsonify({'error': {'code': 'VALIDATION_ERROR', 'message': 'Comment content required'}}), 400
    
    updated_comment = Comment.update(comment_id, data['content'])
    
    task = Task.find_by_id(comment['task_id'])
    if task:
        socketio.emit('comment_updated', {'comment': updated_comment}, room=f'project_{task["project_id"]}')
    
    return jsonify({'comment': updated_comment}), 200

@comment_bp.route('/comments/<comment_id>', methods=['DELETE'])
@require_auth
def delete_comment(current_user, comment_id):
    comment = Comment.find_by_id(comment_id)
    if not comment:
        return jsonify({'error': {'code': 'RESOURCE_NOT_FOUND', 'message': 'Comment not found'}}), 404
    
    if str(comment['author_id']) != str(current_user['_id']):
        task = Task.find_by_id(comment['task_id'])
        if not PermissionService.check_project_permission(current_user['_id'], task['project_id'], 'manage_project'):
            return jsonify({'error': {'code': 'AUTH_UNAUTHORIZED', 'message': 'Access denied'}}), 403
    
    Comment.soft_delete(comment_id)
    
    task = Task.find_by_id(comment['task_id'])
    if task:
        socketio.emit('comment_deleted', {'comment_id': comment_id}, room=f'project_{task["project_id"]}')
    
    return jsonify({'message': 'Comment deleted successfully'}), 200
