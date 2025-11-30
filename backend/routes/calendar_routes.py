from flask import Blueprint
from controllers.calendar_controller import create_event, get_events, update_event, delete_event

calendar_bp = Blueprint('calendar', __name__)

# Calendar Event CRUD Routes
calendar_bp.route('/', methods=['POST'])(create_event)
calendar_bp.route('/', methods=['GET'])(get_events)
calendar_bp.route('/<event_id>', methods=['PUT'])(update_event)
calendar_bp.route('/<event_id>', methods=['DELETE'])(delete_event)
