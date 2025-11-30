from flask import Blueprint
from controllers.document_controller import (
    create_document, 
    get_all_documents, 
    get_document_detail, 
    delete_document
)

document_bp = Blueprint('documents', __name__)

# Document CRUD Routes
document_bp.route('/', methods=['POST'])(create_document) # This is the AI drafting + PDF generation route
document_bp.route('/', methods=['GET'])(get_all_documents)
document_bp.route('/<document_id>', methods=['GET'])(get_document_detail)
document_bp.route('/<document_id>', methods=['DELETE'])(delete_document)
