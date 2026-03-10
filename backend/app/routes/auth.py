from flask import Blueprint, request, jsonify
from app.services.auth import AuthService
from app.services.email import OTPService, EmailService
from app.models.user import User
from app.utils.decorators import require_auth

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/send-otp', methods=['POST'])
def send_otp():
    """Send OTP to email for verification"""
    data = request.get_json()
    if not data or not data.get('email'):
        return jsonify({'error': {'code': 'VALIDATION_ERROR', 'message': 'Email required'}}), 400
    
    email = data['email']
    
    # Generate and send OTP
    otp_code = OTPService.create_otp(email)
    EmailService.send_otp_email(email, otp_code)
    
    return jsonify({'message': 'OTP sent successfully', 'email': email}), 200

@auth_bp.route('/verify-otp', methods=['POST'])
def verify_otp():
    """Verify OTP code"""
    data = request.get_json()
    if not data:
        return jsonify({'error': {'code': 'VALIDATION_ERROR', 'message': 'Request body required'}}), 400
    
    email = data.get('email')
    otp = data.get('otp')
    
    if not all([email, otp]):
        return jsonify({'error': {'code': 'VALIDATION_ERROR', 'message': 'Email and OTP required'}}), 400
    
    if OTPService.verify_otp(email, otp):
        return jsonify({'message': 'Email verified successfully', 'verified': True}), 200
    else:
        return jsonify({'error': {'code': 'INVALID_OTP', 'message': 'Invalid or expired OTP'}}), 400

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return jsonify({'error': {'code': 'VALIDATION_ERROR', 'message': 'Request body required'}}), 400
    
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    
    if not all([email, password, name]):
        return jsonify({'error': {'code': 'VALIDATION_ERROR', 'message': 'Email, password, and name required'}}), 400
    
    # Check if email is verified
    if not OTPService.is_email_verified(email):
        return jsonify({'error': {'code': 'EMAIL_NOT_VERIFIED', 'message': 'Please verify your email first'}}), 400
    
    try:
        result = AuthService.register(email, password, name)
        # Clean up OTP records after successful registration
        OTPService.delete_otp(email)
        return jsonify(result), 201
    except ValueError as e:
        return jsonify({'error': {'code': 'VALIDATION_ERROR', 'message': str(e)}}), 400

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({'error': {'code': 'VALIDATION_ERROR', 'message': 'Request body required'}}), 400
    
    email = data.get('email')
    password = data.get('password')
    
    if not all([email, password]):
        return jsonify({'error': {'code': 'VALIDATION_ERROR', 'message': 'Email and password required'}}), 400
    
    try:
        result = AuthService.login(email, password)
        return jsonify(result), 200
    except ValueError as e:
        return jsonify({'error': {'code': 'AUTH_INVALID_CREDENTIALS', 'message': str(e)}}), 401

@auth_bp.route('/refresh', methods=['POST'])
def refresh():
    data = request.get_json()
    refresh_token = data.get('refresh_token') if data else None
    
    if not refresh_token:
        return jsonify({'error': {'code': 'VALIDATION_ERROR', 'message': 'Refresh token required'}}), 400
    
    try:
        result = AuthService.refresh(refresh_token)
        return jsonify(result), 200
    except ValueError as e:
        return jsonify({'error': {'code': 'AUTH_TOKEN_EXPIRED', 'message': str(e)}}), 401

@auth_bp.route('/me', methods=['GET'])
@require_auth
def get_current_user(current_user):
    return jsonify({'user': current_user}), 200

@auth_bp.route('/logout', methods=['POST'])
@require_auth
def logout(current_user):
    return jsonify({'message': 'Logged out successfully'}), 200

@auth_bp.route('/resend-otp', methods=['POST'])
def resend_otp():
    """Resend OTP to email"""
    data = request.get_json()
    if not data or not data.get('email'):
        return jsonify({'error': {'code': 'VALIDATION_ERROR', 'message': 'Email required'}}), 400
    
    email = data['email']
    
    # Generate new OTP and send
    otp_code = OTPService.create_otp(email)
    EmailService.send_otp_email(email, otp_code)
    
    return jsonify({'message': 'OTP resent successfully'}), 200
