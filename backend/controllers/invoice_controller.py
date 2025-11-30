from flask import current_app, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId
from models.invoice_model import Invoice, InvoiceItem
from services.pdf_service import generate_invoice_pdf # Placeholder
from services.cloudinary_service import upload_file # Placeholder
from services.stripe_service import create_payment_link # Placeholder
from services.gmail_service import send_invoice_email # Placeholder
from datetime import datetime

def get_invoice_collection():
    return current_app.db.invoices

def get_client_collection():
    return current_app.db.clients

# --- Invoice CRUD ---

@jwt_required()
def create_invoice():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    try:
        # Calculate total amount
        total_amount = sum(item['quantity'] * item['unit_price'] for item in data.get('items', []))
        
        # Generate a simple invoice number (e.g., INV-YYYYMMDD-001)
        # In a real app, this would be more robust
        invoice_count = get_invoice_collection().count_documents({"user_id": ObjectId(user_id)})
        invoice_number = f"INV-{datetime.now().strftime('%Y%m%d')}-{invoice_count + 1:03d}"
        
        new_invoice = Invoice(
            user_id=user_id,
            client_id=data['client_id'],
            project_id=data.get('project_id'),
            invoice_number=invoice_number,
            issue_date=data['issue_date'],
            due_date=data['due_date'],
            status=data.get('status', 'Draft'),
            total_amount=total_amount,
            currency=data.get('currency', 'USD'),
            items=data.get('items', [])
        )
        result = get_invoice_collection().insert_one(new_invoice.__dict__)
        new_invoice._id = result.inserted_id
        
        return jsonify({
            "message": "Invoice created successfully",
            "invoice": new_invoice.to_dict()
        }), 201
    except Exception as e:
        current_app.logger.error(f"Error creating invoice: {e}")
        return jsonify({"message": "Error creating invoice"}), 500

@jwt_required()
def get_all_invoices():
    user_id = get_jwt_identity()
    invoices_data = get_invoice_collection().find({"user_id": ObjectId(user_id)}).sort("issue_date", -1)
    invoices = [Invoice.from_dict(i).to_dict() for i in invoices_data]
    
    return jsonify(invoices), 200

@jwt_required()
def get_invoice_detail(invoice_id):
    user_id = get_jwt_identity()
    
    try:
        invoice_data = get_invoice_collection().find_one({"_id": ObjectId(invoice_id), "user_id": ObjectId(user_id)})
        if not invoice_data:
            return jsonify({"message": "Invoice not found"}), 404
            
        invoice = Invoice.from_dict(invoice_data).to_dict()
        
        return jsonify(invoice), 200
        
    except Exception as e:
        current_app.logger.error(f"Error fetching invoice detail: {e}")
        return jsonify({"message": "Invalid invoice ID or server error"}), 400

@jwt_required()
def update_invoice(invoice_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    
    try:
        update_data = {k: v for k, v in data.items() if k in Invoice.__init__.__code__.co_varnames and k not in ['_id', 'user_id', 'created_at', 'invoice_number']}
        update_data['updated_at'] = datetime.utcnow()
        
        # Recalculate total if items are updated
        if 'items' in update_data:
            total_amount = sum(item['quantity'] * item['unit_price'] for item in update_data['items'])
            update_data['total_amount'] = total_amount
            # Convert items to InvoiceItem objects for storage
            update_data['items'] = [InvoiceItem.from_dict(item).__dict__ for item in update_data['items']]
        
        result = get_invoice_collection().update_one(
            {"_id": ObjectId(invoice_id), "user_id": ObjectId(user_id)},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            return jsonify({"message": "Invoice not found or unauthorized"}), 404
            
        updated_invoice_data = get_invoice_collection().find_one({"_id": ObjectId(invoice_id)})
        
        return jsonify({
            "message": "Invoice updated successfully",
            "invoice": Invoice.from_dict(updated_invoice_data).to_dict()
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error updating invoice: {e}")
        return jsonify({"message": "Invalid invoice ID or server error"}), 400

@jwt_required()
def delete_invoice(invoice_id):
    user_id = get_jwt_identity()
    
    try:
        result = get_invoice_collection().delete_one({"_id": ObjectId(invoice_id), "user_id": ObjectId(user_id)})
        
        if result.deleted_count == 0:
            return jsonify({"message": "Invoice not found or unauthorized"}), 404
            
        return jsonify({"message": "Invoice deleted successfully"}), 200
        
    except Exception as e:
        current_app.logger.error(f"Error deleting invoice: {e}")
        return jsonify({"message": "Invalid invoice ID or server error"}), 400

# --- Invoice Actions ---

@jwt_required()
def generate_and_upload_invoice_pdf(invoice_id):
    user_id = get_jwt_identity()
    
    try:
        invoice_data = get_invoice_collection().find_one({"_id": ObjectId(invoice_id), "user_id": ObjectId(user_id)})
        if not invoice_data:
            return jsonify({"message": "Invoice not found"}), 404
            
        invoice = Invoice.from_dict(invoice_data)
        
        # 1. Generate PDF
        pdf_path = generate_invoice_pdf(invoice) # This service function will create a temporary PDF file
        
        # 2. Upload to Cloudinary
        cloudinary_url = upload_file(pdf_path, folder="invoices")
        
        # 3. Update invoice record
        get_invoice_collection().update_one(
            {"_id": ObjectId(invoice_id)},
            {"$set": {"pdf_url": cloudinary_url, "updated_at": datetime.utcnow()}}
        )
        
        # Clean up local file
        os.remove(pdf_path)
        
        return jsonify({
            "message": "Invoice PDF generated and uploaded successfully",
            "pdf_url": cloudinary_url
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error generating/uploading invoice PDF: {e}")
        return jsonify({"message": "Error processing invoice PDF"}), 500

@jwt_required()
def create_and_attach_payment_link(invoice_id):
    user_id = get_jwt_identity()
    
    try:
        invoice_data = get_invoice_collection().find_one({"_id": ObjectId(invoice_id), "user_id": ObjectId(user_id)})
        if not invoice_data:
            return jsonify({"message": "Invoice not found"}), 404
            
        invoice = Invoice.from_dict(invoice_data)
        
        # 1. Create Stripe Payment Link
        payment_link, session_id = create_payment_link(invoice)
        
        # 2. Update invoice record
        get_invoice_collection().update_one(
            {"_id": ObjectId(invoice_id)},
            {"$set": {"stripe_payment_link": payment_link, "stripe_session_id": session_id, "updated_at": datetime.utcnow()}}
        )
        
        return jsonify({
            "message": "Stripe payment link created and attached",
            "payment_link": payment_link
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error creating payment link: {e}")
        return jsonify({"message": "Error creating Stripe payment link"}), 500

@jwt_required()
def send_invoice(invoice_id):
    user_id = get_jwt_identity()
    
    try:
        invoice_data = get_invoice_collection().find_one({"_id": ObjectId(invoice_id), "user_id": ObjectId(user_id)})
        if not invoice_data:
            return jsonify({"message": "Invoice not found"}), 404
            
        invoice = Invoice.from_dict(invoice_data)
        
        if not invoice.pdf_url or not invoice.stripe_payment_link:
            return jsonify({"message": "Invoice must have a PDF and a payment link before sending"}), 400
            
        client_data = get_client_collection().find_one({"_id": invoice.client_id})
        if not client_data:
            return jsonify({"message": "Client not found"}), 404
            
        client = Client.from_dict(client_data)
        
        # 1. Send email via Gmail API
        send_invoice_email(invoice, client)
        
        # 2. Update invoice status
        get_invoice_collection().update_one(
            {"_id": ObjectId(invoice_id)},
            {"$set": {"status": "Sent", "updated_at": datetime.utcnow()}}
        )
        
        return jsonify({
            "message": "Invoice sent successfully",
            "status": "Sent"
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error sending invoice: {e}")
        return jsonify({"message": "Error sending invoice"}), 500

# --- Payments Module (History) ---

@jwt_required()
def get_payment_history():
    user_id = get_jwt_identity()
    
    # Payments are essentially invoices with status 'Paid'
    paid_invoices_data = get_invoice_collection().find({"user_id": ObjectId(user_id), "status": "Paid"}).sort("updated_at", -1)
    payments = [Invoice.from_dict(i).to_dict() for i in paid_invoices_data]
    
    # In a more complex app, this would query a separate 'payments' collection
    # but for this scope, paid invoices serve as payment history.
    
    return jsonify(payments), 200
