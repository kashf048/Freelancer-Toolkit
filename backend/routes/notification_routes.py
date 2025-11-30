from flask import Blueprint
from controllers.notification_controller import get_notifications, mark_as_read, mark_all_as_read

notification_bp = Blueprint('notifications', __name__)

# Notification Routes
notification_bp.route('/', methods=['GET'])(get_notifications)
notification_bp.route('/<notification_id>/read', methods=['PUT'])(mark_as_read)
notification_bp.route('/read-all', methods=['PUT'])(mark_all_as_read)
