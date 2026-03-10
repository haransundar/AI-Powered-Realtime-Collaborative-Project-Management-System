from flask import Blueprint, request, jsonify
from app.models.task import Task
from app.models.project import Project, ProjectMember
from app.models.user import User
from app.utils.decorators import require_auth
from app.services.permission import PermissionService
from app.services.ai import AIService

ai_bp = Blueprint('ai', __name__)

@ai_bp.route('/parse-task', methods=['POST'])
@require_auth
def parse_natural_language(current_user):
    data = request.get_json()
    if not data or not data.get('text'):
        return jsonify({'error': {'code': 'VALIDATION_ERROR', 'message': 'Text required'}}), 400
    
    project_context = None
    if data.get('project_id'):
        project_id = data['project_id']
        if PermissionService.can_access_project(current_user['_id'], project_id):
            members = ProjectMember.find_by_project(project_id)
            user_ids = [m['user_id'] for m in members]
            users = User.find_by_ids(user_ids)
            project_context = {'team_members': users}
    
    result = AIService.parse_natural_language(data['text'], project_context)
    return jsonify({'parsed': result}), 200

@ai_bp.route('/suggest', methods=['POST'])
@require_auth
def get_suggestions(current_user):
    data = request.get_json()
    if not data:
        return jsonify({'error': {'code': 'VALIDATION_ERROR', 'message': 'Task data required'}}), 400
    
    project_context = None
    if data.get('project_id'):
        project_id = data['project_id']
        if PermissionService.can_access_project(current_user['_id'], project_id):
            existing_tasks = Task.find_by_project(project_id)
            members = ProjectMember.find_by_project(project_id)
            user_ids = [m['user_id'] for m in members]
            users = User.find_by_ids(user_ids)
            project_context = {
                'existing_tasks': existing_tasks,
                'team_members': users
            }
    
    task_data = {
        'title': data.get('title', ''),
        'description': data.get('description', '')
    }
    
    suggestions = AIService.suggest_task_metadata(task_data, project_context)
    return jsonify({'suggestions': suggestions}), 200

@ai_bp.route('/schedule/<project_id>', methods=['GET'])
@require_auth
def get_schedule_recommendations(current_user, project_id):
    if not PermissionService.can_access_project(current_user['_id'], project_id):
        return jsonify({'error': {'code': 'AUTH_UNAUTHORIZED', 'message': 'Access denied'}}), 403
    
    tasks = Task.find_by_project(project_id)
    members = ProjectMember.find_by_project(project_id)
    user_ids = [m['user_id'] for m in members]
    users = User.find_by_ids(user_ids)
    
    recommendations = AIService.suggest_schedule(tasks, users)
    return jsonify({'recommendations': recommendations}), 200

@ai_bp.route('/workload/<org_id>', methods=['GET'])
@require_auth
def get_workload_analysis(current_user, org_id):
    if not PermissionService.can_access_org(current_user['_id'], org_id):
        return jsonify({'error': {'code': 'AUTH_UNAUTHORIZED', 'message': 'Access denied'}}), 403
    
    tasks = Task.find_by_org(org_id)
    
    tasks_by_user = {}
    for task in tasks:
        for assignee_id in task.get('assignees', []):
            if assignee_id not in tasks_by_user:
                tasks_by_user[assignee_id] = []
            tasks_by_user[assignee_id].append(task)
    
    workload = AIService.analyze_workload(tasks_by_user)
    
    user_ids = list(tasks_by_user.keys())
    users = User.find_by_ids(user_ids)
    user_map = {u['_id']: u for u in users}
    
    result = []
    for user_id, analysis in workload.items():
        user = user_map.get(user_id, {})
        result.append({
            'user': {'_id': user_id, 'name': user.get('name'), 'avatar_url': user.get('avatar_url')},
            **analysis
        })
    
    return jsonify({'workload': result}), 200

@ai_bp.route('/breakdown', methods=['POST'])
@require_auth
def breakdown_task(current_user):
    """Break down a high-level task into subtasks using AI"""
    data = request.get_json()
    if not data or not data.get('title'):
        return jsonify({'error': {'code': 'VALIDATION_ERROR', 'message': 'Task title required'}}), 400
    
    project_context = None
    if data.get('project_id'):
        project_id = data['project_id']
        if PermissionService.can_access_project(current_user['_id'], project_id):
            existing_tasks = Task.find_by_project(project_id)
            members = ProjectMember.find_by_project(project_id)
            user_ids = [m['user_id'] for m in members]
            users = User.find_by_ids(user_ids)
            project_context = {
                'existing_tasks': existing_tasks,
                'team_members': users
            }
    
    result = AIService.breakdown_task(
        data.get('title', ''),
        data.get('description', ''),
        project_context
    )
    return jsonify({'breakdown': result}), 200

@ai_bp.route('/insights/<project_id>', methods=['GET'])
@require_auth
def get_project_insights(current_user, project_id):
    """Get AI-powered insights about project health"""
    if not PermissionService.can_access_project(current_user['_id'], project_id):
        return jsonify({'error': {'code': 'AUTH_UNAUTHORIZED', 'message': 'Access denied'}}), 403
    
    tasks = Task.find_by_project(project_id)
    members = ProjectMember.find_by_project(project_id)
    user_ids = [m['user_id'] for m in members]
    users = User.find_by_ids(user_ids)
    
    insights = AIService.get_project_insights(tasks, users)
    return jsonify({'insights': insights}), 200
