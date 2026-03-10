from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
from config import config
import os

socketio = SocketIO(cors_allowed_origins="*")

def create_app(config_name=None):
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'development')
    
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    socketio.init_app(app)
    
    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.organizations import org_bp
    from app.routes.projects import project_bp
    from app.routes.tasks import task_bp
    from app.routes.comments import comment_bp
    from app.routes.attachments import attachment_bp
    from app.routes.notifications import notification_bp
    from app.routes.ai import ai_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(org_bp, url_prefix='/api/organizations')
    app.register_blueprint(project_bp, url_prefix='/api')
    app.register_blueprint(task_bp, url_prefix='/api')
    app.register_blueprint(comment_bp, url_prefix='/api')
    app.register_blueprint(attachment_bp, url_prefix='/api')
    app.register_blueprint(notification_bp, url_prefix='/api/notifications')
    app.register_blueprint(ai_bp, url_prefix='/api/ai')
    
    # Register WebSocket handlers
    from app.sockets import register_socket_handlers
    register_socket_handlers(socketio)
    
    return app
