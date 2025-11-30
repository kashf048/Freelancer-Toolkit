from flask import Blueprint
from controllers.settings_controller import (
    get_user_settings,
    update_profile,
    update_password,
    update_business_settings,
    upload_logo,
    update_api_keys,
    update_notification_preferences,
    update_user_preferences
)

settings_bp = Blueprint('settings', __name__)

# Main Settings Route
settings_bp.route('/', methods=['GET'])(get_user_settings)

# Profile and Security
settings_bp.route('/profile', methods=['PUT'])(update_profile)
settings_bp.route('/password', methods=['PUT'])(update_password)

# Business Settings
settings_bp.route('/business', methods=['PUT'])(update_business_settings)
settings_bp.route('/business/logo', methods=['POST'])(upload_logo) # Assumes file upload

# Integrations
settings_bp.route('/api-keys', methods=['PUT'])(update_api_keys)

# Preferences
settings_bp.route('/notifications', methods=['PUT'])(update_notification_preferences)
settings_bp.route('/preferences', methods=['PUT'])(update_user_preferences)
