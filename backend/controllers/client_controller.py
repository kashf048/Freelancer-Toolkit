from flask import current_app, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId
from models.client_model import Client
from models.project_model import Project
from models.invoice_model import Invoice

def get_client_collection():
    return current_app.db.clients

def get_project_collection():
    return current_app.db.projects

def get_invoice_collection():
    return current_app.db.invoices

@jwt_required()
def create_client():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    try:
        new_client = Client(
            user_id=user_id,
            name=data['name'],
            email=data['email'],
            phone=data.get('phone'),
            address=data.get('address'),
            company=data.get('company'),
            tax_id=data.get('tax_id'),
            notes=data.get('notes')
        )
        result = get_client_collection().insert_one(new_client.__dict__)
        new_client._id = result.inserted_id
        
        return jsonify({
            "message": "Client created successfully",
            "client": new_client.to_dict()
        }), 201
    except Exception as e:
        current_app.logger.error(f"Error creating client: {e}")
        return jsonify({"message": "Error creating client"}), 500

@jwt_required()
def get_all_clients():
    user_id = get_jwt_identity()
    clients_data = get_client_collection().find({"user_id": ObjectId(user_id)}).sort("name", 1)
    clients = [Client.from_dict(c).to_dict() for c in clients_data]
    
    return jsonify(clients), 200

@jwt_required()
def get_client_detail(client_id):
    user_id = get_jwt_identity()
    
    try:
        client_data = get_client_collection().find_one({"_id": ObjectId(client_id), "user_id": ObjectId(user_id)})
        if not client_data:
            return jsonify({"message": "Client not found"}), 404
            
        client = Client.from_dict(client_data).to_dict()
        
        # Fetch project history
        projects_data = get_project_collection().find({"client_id": ObjectId(client_id)}).sort("start_date", -1)
        projects = [Project.from_dict(p).to_dict() for p in projects_data]
        
        # Fetch invoice history
        invoices_data = get_invoice_collection().find({"client_id": ObjectId(client_id)}).sort("issue_date", -1)
        invoices = [Invoice.from_dict(i).to_dict() for i in invoices_data]
        
        return jsonify({
            "client": client,
            "projects": projects,
            "invoices": invoices
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error fetching client detail: {e}")
        return jsonify({"message": "Invalid client ID or server error"}), 400

@jwt_required()
def update_client(client_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    
    try:
        update_data = {k: v for k, v in data.items() if k in Client.__init__.__code__.co_varnames and k not in ['_id', 'user_id', 'created_at']}
        update_data['updated_at'] = datetime.utcnow()
        
        result = get_client_collection().update_one(
            {"_id": ObjectId(client_id), "user_id": ObjectId(user_id)},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            return jsonify({"message": "Client not found or unauthorized"}), 404
            
        updated_client_data = get_client_collection().find_one({"_id": ObjectId(client_id)})
        
        return jsonify({
            "message": "Client updated successfully",
            "client": Client.from_dict(updated_client_data).to_dict()
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error updating client: {e}")
        return jsonify({"message": "Invalid client ID or server error"}), 400

@jwt_required()
def delete_client(client_id):
    user_id = get_jwt_identity()
    
    try:
        result = get_client_collection().delete_one({"_id": ObjectId(client_id), "user_id": ObjectId(user_id)})
        
        if result.deleted_count == 0:
            return jsonify({"message": "Client not found or unauthorized"}), 404
            
        # Optional: Delete related projects and invoices (cascading delete)
        # get_project_collection().delete_many({"client_id": ObjectId(client_id)})
        # get_invoice_collection().delete_many({"client_id": ObjectId(client_id)})
            
        return jsonify({"message": "Client deleted successfully"}), 200
        
    except Exception as e:
        current_app.logger.error(f"Error deleting client: {e}")
        return jsonify({"message": "Invalid client ID or server error"}), 400
