from flask import Blueprint, request, jsonify
from app.models.notification import Notification
from app.utils.decorators import require_auth

notification_bp = Blueprint('notifications', __name__)

@notification_bp.route('', methods=['GET'])
@require_auth
def list_notifications(current_user):
    limit = request.args.get('limit', 50, type=int)
    notifications = Notification.find_by_user(current_user['_id'], limit=limit)
    unread_count = Notification.get_unread_count(current_user['_id'])
    return jsonify({'notifications': notifications, 'unread_count': unread_count}), 200

@notification_bp.route('/<notification_id>/read', methods=['PATCH'])
@require_auth
def mark_read(current_user, notification_id):
    Notification.mark_read(notification_id)
    return jsonify({'message': 'Notification marked as read'}), 200

@notification_bp.route('/read-all', methods=['POST'])
@require_auth
def mark_all_read(current_user):
    Notification.mark_all_read(current_user['_id'])
    return jsonify({'message': 'All notifications marked as read'}), 200
