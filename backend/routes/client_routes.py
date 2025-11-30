from flask import Blueprint
from controllers.client_controller import (
    create_client, 
    get_all_clients, 
    get_client_detail, 
    update_client, 
    delete_client
)

client_bp = Blueprint('clients', __name__)

# Client CRUD Routes
client_bp.route('/', methods=['POST'])(create_client)
client_bp.route('/', methods=['GET'])(get_all_clients)
client_bp.route('/<client_id>', methods=['GET'])(get_client_detail)
client_bp.route('/<client_id>', methods=['PUT'])(update_client)
client_bp.route('/<client_id>', methods=['DELETE'])(delete_client)
