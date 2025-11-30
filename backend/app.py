import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from pymongo import MongoClient
from apscheduler.schedulers.background import BackgroundScheduler
from config import config_by_name

# Initialize MongoDB Client
mongo_client = MongoClient()

def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object(config_by_name[config_name])

    # Initialize CORS
    CORS(app, resources={r"/api/*": {"origins": app.config['FRONTEND_URL']}}, supports_credentials=True)

    # Initialize JWT
    jwt = JWTManager(app)

    # Initialize MongoDB
    global mongo_client
    mongo_client = MongoClient(app.config['MONGO_URI'])
    app.db = mongo_client.get_default_database() # Assumes database name is in MONGO_URI

    # Initialize APScheduler
    scheduler = BackgroundScheduler()
    app.scheduler = scheduler
    
    # Error Handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"message": "Resource not found"}), 404

    @app.errorhandler(401)
    def unauthorized(error):
        return jsonify({"message": "Unauthorized access"}), 401

    # JWT Callbacks
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({
            "message": "The token has expired",
            "error": "token_expired"
        }), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({
            "message": "Signature verification failed",
            "error": "invalid_token"
        }), 401

    # Import and register blueprints (routes)
    from routes.auth_routes import auth_bp
    from routes.client_routes import client_bp
    from routes.project_routes import project_bp
    from routes.invoice_routes import invoice_bp
    from routes.payment_routes import payment_bp
    from routes.document_routes import document_bp
    from routes.calendar_routes import calendar_bp
    from routes.settings_routes import settings_bp
    from routes.dashboard_routes import dashboard_bp
    from routes.notification_routes import notification_bp
    from routes.admin_routes import admin_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(client_bp, url_prefix='/api/clients')
    app.register_blueprint(project_bp, url_prefix='/api/projects')
    app.register_blueprint(invoice_bp, url_prefix='/api/invoices')
    app.register_blueprint(payment_bp, url_prefix='/api/payments')
    app.register_blueprint(document_bp, url_prefix='/api/documents')
    app.register_blueprint(calendar_bp, url_prefix='/api/calendar')
    app.register_blueprint(settings_bp, url_prefix='/api/settings')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
    app.register_blueprint(notification_bp, url_prefix='/api/notifications')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')

    # Schedule Cron Jobs
    from cron.daily_jobs import schedule_daily_jobs
    schedule_daily_jobs(scheduler)

    # Start the scheduler
    if not scheduler.running:
        scheduler.start()
        app.logger.info("APScheduler started and daily jobs scheduled.")

    return app

if __name__ == '__main__':
    app = create_app(os.getenv('FLASK_CONFIG') or 'default')
    app.run(debug=True)
