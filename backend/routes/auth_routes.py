from flask import Blueprint
from controllers.auth_controller import (
    register_user, 
    login_user, 
    refresh_token, 
    forgot_password, 
    reset_password,
    google_login,
    google_callback
)

auth_bp = Blueprint('auth', __name__)

# Authentication Routes
auth_bp.route('/signup', methods=['POST'])(register_user)
auth_bp.route('/login', methods=['POST'])(login_user)
auth_bp.route('/token/refresh', methods=['POST'])(refresh_token)
auth_bp.route('/forgot-password', methods=['POST'])(forgot_password)
auth_bp.route('/reset-password', methods=['POST'])(reset_password)

# Google OAuth Routes (for Calendar/Gmail integration)
auth_bp.route('/google/login', methods=['GET'])(google_login)
auth_bp.route('/google/callback', methods=['GET'])(google_callback)
