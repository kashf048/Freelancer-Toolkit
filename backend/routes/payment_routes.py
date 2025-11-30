from flask import Blueprint
from controllers.invoice_controller import get_payment_history

payment_bp = Blueprint('payments', __name__)

# Payment History Route
payment_bp.route('/', methods=['GET'])(get_payment_history)
