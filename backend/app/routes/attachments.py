from flask import Blueprint, request, jsonify, send_file, current_app
from app.models.attachment import FileAttachment
from app.models.task import Task
from app.utils.decorators import require_auth
from app.services.permission import PermissionService
import os
import uuid

attachment_bp = Blueprint('attachments', __name__)

@attachment_bp.route('/tasks/<task_id>/attachments', methods=['POST'])
@require_auth
def upload_attachment(current_user, task_id):
    if not PermissionService.check_task_permission(current_user['_id'], task_id, 'edit_task'):
        return jsonify({'error': {'code': 'AUTH_UNAUTHORIZED', 'message': 'Access denied'}}), 403
    
    task = Task.find_by_id(task_id)
    if not task:
        return jsonify({'error': {'code': 'RESOURCE_NOT_FOUND', 'message': 'Task not found'}}), 404
    
    if 'file' not in request.files:
        return jsonify({'error': {'code': 'VALIDATION_ERROR', 'message': 'No file provided'}}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': {'code': 'VALIDATION_ERROR', 'message': 'No file selected'}}), 400
    
    upload_folder = current_app.config.get('UPLOAD_FOLDER', 'uploads')
    os.makedirs(upload_folder, exist_ok=True)
    
    filename = str(uuid.uuid4()) + os.path.splitext(file.filename)[1]
    storage_path = os.path.join(upload_folder, filename)
    file.save(storage_path)
    
    file.seek(0, 2)
    size_bytes = file.tell()
    
    attachment = FileAttachment.create(
        task_id=task_id,
        org_id=task['org_id'],
        original_name=file.filename,
        mime_type=file.content_type or 'application/octet-stream',
        size_bytes=size_bytes,
        uploaded_by=current_user['_id'],
        storage_path=storage_path
    )
    
    return jsonify({'attachment': attachment}), 201

@attachment_bp.route('/tasks/<task_id>/attachments', methods=['GET'])
@require_auth
def list_attachments(current_user, task_id):
    if not PermissionService.check_task_permission(current_user['_id'], task_id, 'view_all'):
        return jsonify({'error': {'code': 'AUTH_UNAUTHORIZED', 'message': 'Access denied'}}), 403
    
    attachments = FileAttachment.find_by_task(task_id)
    
    for attachment in attachments:
        attachment['download_url'] = f'/api/attachments/{attachment["_id"]}/download'
    
    return jsonify({'attachments': attachments}), 200

@attachment_bp.route('/attachments/<attachment_id>/download', methods=['GET'])
@require_auth
def download_attachment(current_user, attachment_id):
    attachment = FileAttachment.find_by_id(attachment_id)
    if not attachment:
        return jsonify({'error': {'code': 'RESOURCE_NOT_FOUND', 'message': 'Attachment not found'}}), 404
    
    if not PermissionService.check_task_permission(current_user['_id'], attachment['task_id'], 'view_all'):
        return jsonify({'error': {'code': 'AUTH_UNAUTHORIZED', 'message': 'Access denied'}}), 403
    
    if not os.path.exists(attachment['storage_path']):
        return jsonify({'error': {'code': 'RESOURCE_NOT_FOUND', 'message': 'File not found'}}), 404
    
    return send_file(
        attachment['storage_path'],
        mimetype=attachment['mime_type'],
        as_attachment=True,
        download_name=attachment['original_name']
    )

@attachment_bp.route('/attachments/<attachment_id>', methods=['DELETE'])
@require_auth
def delete_attachment(current_user, attachment_id):
    attachment = FileAttachment.find_by_id(attachment_id)
    if not attachment:
        return jsonify({'error': {'code': 'RESOURCE_NOT_FOUND', 'message': 'Attachment not found'}}), 404
    
    if str(attachment['uploaded_by']) != str(current_user['_id']):
        if not PermissionService.check_task_permission(current_user['_id'], attachment['task_id'], 'delete_task'):
            return jsonify({'error': {'code': 'AUTH_UNAUTHORIZED', 'message': 'Access denied'}}), 403
    
    FileAttachment.delete(attachment_id)
    return jsonify({'message': 'Attachment deleted successfully'}), 200
