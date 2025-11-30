from flask import current_app, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId
from models.project_model import Project, Milestone
from models.invoice_model import Invoice
from models.document_model import Document
from services.google_calendar_service import create_calendar_event, delete_calendar_event # Placeholder

def get_project_collection():
    return current_app.db.projects

def get_milestone_collection():
    return current_app.db.milestones

def get_invoice_collection():
    return current_app.db.invoices

def get_document_collection():
    return current_app.db.documents

# --- Project CRUD ---

@jwt_required()
def create_project():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    try:
        new_project = Project(
            user_id=user_id,
            client_id=data['client_id'],
            title=data['title'],
            description=data.get('description'),
            status=data.get('status', 'Pending'),
            start_date=data.get('start_date'),
            end_date=data.get('end_date'),
            budget=data.get('budget')
        )
        result = get_project_collection().insert_one(new_project.__dict__)
        new_project._id = result.inserted_id
        
        return jsonify({
            "message": "Project created successfully",
            "project": new_project.to_dict()
        }), 201
    except Exception as e:
        current_app.logger.error(f"Error creating project: {e}")
        return jsonify({"message": "Error creating project"}), 500

@jwt_required()
def get_all_projects():
    user_id = get_jwt_identity()
    projects_data = get_project_collection().find({"user_id": ObjectId(user_id)}).sort("start_date", -1)
    projects = [Project.from_dict(p).to_dict() for p in projects_data]
    
    return jsonify(projects), 200

@jwt_required()
def get_project_detail(project_id):
    user_id = get_jwt_identity()
    
    try:
        project_data = get_project_collection().find_one({"_id": ObjectId(project_id), "user_id": ObjectId(user_id)})
        if not project_data:
            return jsonify({"message": "Project not found"}), 404
            
        project = Project.from_dict(project_data).to_dict()
        
        # Fetch related data
        milestones_data = get_milestone_collection().find({"project_id": ObjectId(project_id)}).sort("due_date", 1)
        milestones = [Milestone.from_dict(m).to_dict() for m in milestones_data]
        
        documents_data = get_document_collection().find({"project_id": ObjectId(project_id)}).sort("created_at", -1)
        documents = [Document.from_dict(d).to_dict() for d in documents_data]
        
        invoices_data = get_invoice_collection().find({"project_id": ObjectId(project_id)}).sort("issue_date", -1)
        invoices = [Invoice.from_dict(i).to_dict() for i in invoices_data]
        
        # Response structure MUST match frontend expectation
        return jsonify({
            "project": project,
            "milestones": milestones,
            "documents": documents,
            "invoices": invoices
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error fetching project detail: {e}")
        return jsonify({"message": "Invalid project ID or server error"}), 400

@jwt_required()
def update_project(project_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    
    try:
        update_data = {k: v for k, v in data.items() if k in Project.__init__.__code__.co_varnames and k not in ['_id', 'user_id', 'created_at']}
        update_data['updated_at'] = datetime.utcnow()
        
        result = get_project_collection().update_one(
            {"_id": ObjectId(project_id), "user_id": ObjectId(user_id)},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            return jsonify({"message": "Project not found or unauthorized"}), 404
            
        updated_project_data = get_project_collection().find_one({"_id": ObjectId(project_id)})
        
        return jsonify({
            "message": "Project updated successfully",
            "project": Project.from_dict(updated_project_data).to_dict()
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error updating project: {e}")
        return jsonify({"message": "Invalid project ID or server error"}), 400

@jwt_required()
def delete_project(project_id):
    user_id = get_jwt_identity()
    
    try:
        result = get_project_collection().delete_one({"_id": ObjectId(project_id), "user_id": ObjectId(user_id)})
        
        if result.deleted_count == 0:
            return jsonify({"message": "Project not found or unauthorized"}), 404
            
        # Cascading delete for milestones, documents, and invoices
        get_milestone_collection().delete_many({"project_id": ObjectId(project_id)})
        get_document_collection().delete_many({"project_id": ObjectId(project_id)})
        get_invoice_collection().delete_many({"project_id": ObjectId(project_id)})
            
        return jsonify({"message": "Project deleted successfully"}), 200
        
    except Exception as e:
        current_app.logger.error(f"Error deleting project: {e}")
        return jsonify({"message": "Invalid project ID or server error"}), 400

# --- Milestone CRUD ---

@jwt_required()
def create_milestone(project_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    
    try:
        # Check if project exists and belongs to user
        project_data = get_project_collection().find_one({"_id": ObjectId(project_id), "user_id": ObjectId(user_id)})
        if not project_data:
            return jsonify({"message": "Project not found or unauthorized"}), 404
            
        new_milestone = Milestone(
            project_id=project_id,
            title=data['title'],
            due_date=data['due_date'],
            status=data.get('status', 'Pending'),
            notes=data.get('notes')
        )
        
        # Auto-create Google Calendar event
        calendar_event_id = create_calendar_event(user_id, new_milestone)
        new_milestone.calendar_event_id = calendar_event_id
        
        result = get_milestone_collection().insert_one(new_milestone.__dict__)
        new_milestone._id = result.inserted_id
        
        return jsonify({
            "message": "Milestone created successfully",
            "milestone": new_milestone.to_dict()
        }), 201
    except Exception as e:
        current_app.logger.error(f"Error creating milestone: {e}")
        return jsonify({"message": "Error creating milestone"}), 500

@jwt_required()
def update_milestone(project_id, milestone_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    
    try:
        # Check if project exists and belongs to user
        project_data = get_project_collection().find_one({"_id": ObjectId(project_id), "user_id": ObjectId(user_id)})
        if not project_data:
            return jsonify({"message": "Project not found or unauthorized"}), 404
            
        update_data = {k: v for k, v in data.items() if k in Milestone.__init__.__code__.co_varnames and k not in ['_id', 'project_id', 'created_at']}
        update_data['updated_at'] = datetime.utcnow()
        
        # If due_date or status changes, update Google Calendar event
        if 'due_date' in update_data or 'status' in update_data:
            # Fetch current milestone data to get calendar_event_id
            current_milestone = get_milestone_collection().find_one({"_id": ObjectId(milestone_id)})
            if current_milestone and current_milestone.get('calendar_event_id'):
                # Logic to update calendar event (requires a dedicated service function)
                pass # Skipping for now, will be implemented in service
        
        result = get_milestone_collection().update_one(
            {"_id": ObjectId(milestone_id), "project_id": ObjectId(project_id)},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            return jsonify({"message": "Milestone not found or unauthorized"}), 404
            
        updated_milestone_data = get_milestone_collection().find_one({"_id": ObjectId(milestone_id)})
        
        return jsonify({
            "message": "Milestone updated successfully",
            "milestone": Milestone.from_dict(updated_milestone_data).to_dict()
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error updating milestone: {e}")
        return jsonify({"message": "Invalid milestone ID or server error"}), 400

@jwt_required()
def delete_milestone(project_id, milestone_id):
    user_id = get_jwt_identity()
    
    try:
        # Check if project exists and belongs to user
        project_data = get_project_collection().find_one({"_id": ObjectId(project_id), "user_id": ObjectId(user_id)})
        if not project_data:
            return jsonify({"message": "Project not found or unauthorized"}), 404
            
        milestone_data = get_milestone_collection().find_one({"_id": ObjectId(milestone_id)})
        
        result = get_milestone_collection().delete_one({"_id": ObjectId(milestone_id), "project_id": ObjectId(project_id)})
        
        if result.deleted_count == 0:
            return jsonify({"message": "Milestone not found or unauthorized"}), 404
            
        # Delete Google Calendar event
        if milestone_data and milestone_data.get('calendar_event_id'):
            delete_calendar_event(user_id, milestone_data['calendar_event_id'])
            
        return jsonify({"message": "Milestone deleted successfully"}), 200
        
    except Exception as e:
        current_app.logger.error(f"Error deleting milestone: {e}")
        return jsonify({"message": "Invalid milestone ID or server error"}), 400
