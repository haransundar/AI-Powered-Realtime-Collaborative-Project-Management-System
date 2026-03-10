import jwt
from datetime import datetime, timedelta
from flask import current_app
from app.models.user import User

class AuthService:
    @staticmethod
    def generate_tokens(user_id):
        access_token = jwt.encode({
            'user_id': str(user_id),
            'type': 'access',
            'exp': datetime.utcnow() + timedelta(seconds=current_app.config['JWT_ACCESS_EXPIRY'])
        }, current_app.config['JWT_SECRET'], algorithm='HS256')
        
        refresh_token = jwt.encode({
            'user_id': str(user_id),
            'type': 'refresh',
            'exp': datetime.utcnow() + timedelta(seconds=current_app.config['JWT_REFRESH_EXPIRY'])
        }, current_app.config['JWT_SECRET'], algorithm='HS256')
        
        return {'access_token': access_token, 'refresh_token': refresh_token}
    
    @staticmethod
    def verify_token(token, token_type='access'):
        try:
            payload = jwt.decode(token, current_app.config['JWT_SECRET'], algorithms=['HS256'])
            if payload.get('type') != token_type:
                return None
            return payload
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
    
    @staticmethod
    def register(email, password, name):
        existing = User.find_by_email(email)
        if existing:
            raise ValueError('Email already registered')
        user = User.create(email, password, name)
        user.pop('password_hash', None)
        tokens = AuthService.generate_tokens(user['_id'])
        return {'user': user, **tokens}
    
    @staticmethod
    def login(email, password):
        user = User.find_by_email(email)
        if not user or not User.verify_password(user, password):
            raise ValueError('Invalid email or password')
        user.pop('password_hash', None)
        tokens = AuthService.generate_tokens(user['_id'])
        return {'user': user, **tokens}
    
    @staticmethod
    def refresh(refresh_token):
        payload = AuthService.verify_token(refresh_token, 'refresh')
        if not payload:
            raise ValueError('Invalid refresh token')
        return AuthService.generate_tokens(payload['user_id'])
    
    @staticmethod
    def get_current_user(token):
        payload = AuthService.verify_token(token)
        if not payload:
            return None
        user = User.find_by_id(payload['user_id'])
        if user:
            user.pop('password_hash', None)
        return user
