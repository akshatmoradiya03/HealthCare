from flask import Flask
from .config import Config
from .extensions import db, migrate, jwt, ma
from flask_cors import CORS

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    ma.init_app(app)
    
    # Enable CORS
    # Allowing all origins for development as per README issues
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    # Register Blueprints
    from .routes.auth_routes import auth_bp
    from .routes.user_routes import user_bp
    from .routes.connection_routes import connection_bp
    from .routes.activity_routes import activity_bp
    from .routes.health_routes import health_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(user_bp, url_prefix='/api/users')
    app.register_blueprint(connection_bp, url_prefix='/api/connection')
    app.register_blueprint(activity_bp, url_prefix='/api/activities')
    app.register_blueprint(health_bp, url_prefix='/api/health')

    return app
