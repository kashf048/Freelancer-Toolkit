from flask import Blueprint
from controllers.admin_controller import (
    get_admin_dashboard_stats,
    get_all_users,
    toggle_admin_status,
    get_admin_analytics,
    get_all_tools,
    create_tool,
    update_tool,
    delete_tool,
    toggle_tool_status,
    get_system_settings,
    update_system_settings
)

admin_bp = Blueprint('admin', __name__)

# Admin Dashboard Routes
admin_bp.route('/dashboard', methods=['GET'])(get_admin_dashboard_stats)
admin_bp.route('/users', methods=['GET'])(get_all_users)
admin_bp.route('/users/<user_id>/toggle-admin', methods=['PUT'])(toggle_admin_status)

# Placeholder for Admin Tools, Analytics, Settings
admin_bp.route('/tools', methods=['GET'])(get_all_tools)
admin_bp.route('/tools', methods=['POST'])(create_tool)
admin_bp.route('/tools/<tool_id>', methods=['PUT'])(update_tool)
admin_bp.route('/tools/<tool_id>', methods=['DELETE'])(delete_tool)
admin_bp.route('/tools/<tool_id>/toggle-status', methods=['PUT'])(toggle_tool_status)
admin_bp.route('/analytics', methods=['GET'])(get_admin_analytics)
admin_bp.route('/settings', methods=['GET'])(get_system_settings)
admin_bp.route('/settings', methods=['PUT'])(update_system_settings)
