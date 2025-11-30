from flask import current_app, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId
from models.document_model import Document
from models.client_model import Client
from models.project_model import Project
from services.openai_service import generate_document_draft
from services.pdf_service import generate_document_pdf
from services.cloudinary_service import upload_file
from datetime import datetime
import os

def get_document_collection():
    return current_app.db.documents

def get_client_collection():
    return current_app.db.clients

def get_project_collection():
    return current_app.db.projects

@jwt_required()
def create_document():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    doc_type = data.get('doc_type')
    client_id = data.get('client_id')
    project_id = data.get('project_id')
    title = data.get('title')
    custom_details = data.get('custom_details', '')
    
    if not all([doc_type, client_id, title]):
        return jsonify({"message": "Missing required fields: doc_type, client_id, title"}), 400

    try:
        # 1. Fetch Client and Project Info for AI Prompt
        client_data = get_client_collection().find_one({"_id": ObjectId(client_id)})
        if not client_data:
            return jsonify({"message": "Client not found"}), 404
        client = Client.from_dict(client_data).to_dict()
        
        project = {}
        if project_id:
            project_data = get_project_collection().find_one({"_id": ObjectId(project_id)})
            if not project_data:
                return jsonify({"message": "Project not found"}), 404
            project = Project.from_dict(project_data).to_dict()

        # 2. Generate AI Draft Text
        draft_content = generate_document_draft(doc_type, client, project, custom_details)
        
        # 3. Create Document Model
        new_document = Document(
            user_id=user_id,
            client_id=client_id,
            project_id=project_id,
            doc_type=doc_type,
            title=title,
            content=draft_content,
            pdf_url=None # Will be updated after PDF generation
        )
        
        # 4. Save initial document to get an ID
        result = get_document_collection().insert_one(new_document.__dict__)
        new_document._id = result.inserted_id
        
        # 5. Generate PDF
        pdf_path = generate_document_pdf(new_document)
        
        # 6. Upload to Cloudinary
        cloudinary_url = upload_file(pdf_path, folder="documents")
        
        # 7. Update document with PDF URL
        get_document_collection().update_one(
            {"_id": new_document._id},
            {"$set": {"pdf_url": cloudinary_url, "updated_at": datetime.utcnow()}}
        )
        
        # Clean up local file
        os.remove(pdf_path)
        
        new_document.pdf_url = cloudinary_url
        
        return jsonify({
            "message": "Document created, drafted by AI, and PDF generated/uploaded successfully",
            "document": new_document.to_dict()
        }), 201
        
    except Exception as e:
        current_app.logger.error(f"Error creating document: {e}")
        return jsonify({"message": "Error creating document"}), 500

@jwt_required()
def get_all_documents():
    user_id = get_jwt_identity()
    documents_data = get_document_collection().find({"user_id": ObjectId(user_id)}).sort("created_at", -1)
    documents = [Document.from_dict(d).to_dict() for d in documents_data]
    
    return jsonify(documents), 200

@jwt_required()
def get_document_detail(document_id):
    user_id = get_jwt_identity()
    
    try:
        document_data = get_document_collection().find_one({"_id": ObjectId(document_id), "user_id": ObjectId(user_id)})
        if not document_data:
            return jsonify({"message": "Document not found"}), 404
            
        document = Document.from_dict(document_data).to_dict()
        
        return jsonify(document), 200
        
    except Exception as e:
        current_app.logger.error(f"Error fetching document detail: {e}")
        return jsonify({"message": "Invalid document ID or server error"}), 400

@jwt_required()
def delete_document(document_id):
    user_id = get_jwt_identity()
    
    try:
        result = get_document_collection().delete_one({"_id": ObjectId(document_id), "user_id": ObjectId(user_id)})
        
        if result.deleted_count == 0:
            return jsonify({"message": "Document not found or unauthorized"}), 404
            
        # TODO: Implement Cloudinary deletion if necessary
            
        return jsonify({"message": "Document deleted successfully"}), 200
        
    except Exception as e:
        current_app.logger.error(f"Error deleting document: {e}")
        return jsonify({"message": "Invalid document ID or server error"}), 400
