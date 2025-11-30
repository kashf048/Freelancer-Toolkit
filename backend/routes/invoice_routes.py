from flask import Blueprint
from controllers.invoice_controller import (
    create_invoice, 
    get_all_invoices, 
    get_invoice_detail, 
    update_invoice, 
    delete_invoice,
    generate_and_upload_invoice_pdf,
    create_and_attach_payment_link,
    send_invoice
)

invoice_bp = Blueprint('invoices', __name__)

# Invoice CRUD Routes
invoice_bp.route('/', methods=['POST'])(create_invoice)
invoice_bp.route('/', methods=['GET'])(get_all_invoices)
invoice_bp.route('/<invoice_id>', methods=['GET'])(get_invoice_detail)
invoice_bp.route('/<invoice_id>', methods=['PUT'])(update_invoice)
invoice_bp.route('/<invoice_id>', methods=['DELETE'])(delete_invoice)

# Invoice Action Routes
invoice_bp.route('/<invoice_id>/generate-pdf', methods=['POST'])(generate_and_upload_invoice_pdf)
invoice_bp.route('/<invoice_id>/create-payment-link', methods=['POST'])(create_and_attach_payment_link)
invoice_bp.route('/<invoice_id>/send', methods=['POST'])(send_invoice)
