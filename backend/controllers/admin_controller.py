from flask import current_app, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from bson.objectid import ObjectId
from models.user_model import User
from models.tool_model import Tool
from datetime import datetime

def admin_required():
    """Decorator to ensure the user is an admin."""
    def wrapper(fn):
        @jwt_required()
        def decorated_view(*args, **kwargs):
            claims = get_jwt()
            if claims.get('is_admin', False) is True:
                return fn(*args, **kwargs)
            else:
                return jsonify({"message": "Admin access required"}), 403
        decorated_view.__name__ = fn.__name__ # Explicitly set the name
        return decorated_view
    return wrapper

def get_user_collection():
    return current_app.db.users

def get_tool_collection():
    return current_app.db.tools

def get_client_collection():
    return current_app.db.clients

def get_project_collection():
    return current_app.db.projects

def get_invoice_collection():
    return current_app.db.invoices

def get_user_collection():
    return current_app.db.users

@admin_required()
def get_admin_dashboard_stats():
    """Fetches high-level stats for the admin dashboard."""
    try:
        total_users = get_user_collection().count_documents({})
        active_users = get_user_collection().count_documents({"active": True}) # Assuming a field 'active'
        
        # Placeholder for other stats (simplified for now)
        total_tools = get_tool_collection().count_documents({})
        total_tool_usage = sum(t.get('usage_count', 0) for t in get_tool_collection().find({}))
        
        return jsonify({
            "total_users": total_users,
            "active_users": active_users,
            "total_tools": total_tools,
            "total_tool_usage": total_tool_usage,
            "system_status": "Operational"
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error fetching admin dashboard stats: {e}")
        return jsonify({"message": "Server error"}), 500

@admin_required()
def get_all_users():
    """Fetches a list of all users for the Admin Users page."""
    try:
        users_data = get_user_collection().find({}, {"password_hash": 0}).sort("created_at", -1)
        
        # Transform user data to match frontend expectation (id, name, email, role, active, createdAt, lastLogin, subscriptionPlan)
        users = []
        for u in users_data:
            user = User.from_dict(u).to_dict()
            users.append({
                "id": user['_id'],
                "name": f"{user['first_name']} {user['last_name']}",
                "email": user['email'],
                "role": "admin" if user['is_admin'] else "user",
                "active": True, # Assuming all users are active unless a specific field is added
                "createdAt": user['created_at'].split('T')[0],
                "lastLogin": user['updated_at'].split('T')[0], # Using updated_at as a proxy for last login
                "subscriptionPlan": "Premium" # Placeholder
            })
        return jsonify({
            "data": users,
            "total": len(users),
            "page": 1,
            "limit": 10
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error fetching all users: {e}")
        return jsonify({"message": "Server error"}), 500

@admin_required()
def toggle_admin_status(user_id):
    """Toggles the admin status of a user."""
    try:
        user_obj_id = ObjectId(user_id)
        
        # Prevent self-demotion
        if str(user_obj_id) == get_jwt_identity():
            return jsonify({"message": "Cannot change your own admin status"}), 400
            
        user_data = get_user_collection().find_one({"_id": user_obj_id})
        if not user_data:
            return jsonify({"message": "User not found"}), 404
            
        new_status = not user_data.get('is_admin', False)
        
        get_user_collection().update_one(
            {"_id": user_obj_id},
            {"$set": {"is_admin": new_status, "updated_at": datetime.utcnow()}}
        )
        
        return jsonify({
            "message": f"User admin status set to {new_status}",
            "is_admin": new_status
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error toggling admin status: {e}")
        return jsonify({"message": "Invalid user ID or server error"}), 400

@admin_required()
def get_admin_analytics():
    """Fetches detailed analytics for the Admin Analytics page."""
    try:
        # 1. User Stats
        total_users = get_user_collection().count_documents({})
        active_users = get_user_collection().count_documents({"active": True})
        
        # 2. Tool Usage (simplified)
        tool_usage_data = get_tool_collection().find({}, {"name": 1, "usage_count": 1})
        tool_usage = [{"name": t['name'], "value": t.get('usage_count', 0)} for t in tool_usage_data]
        
        # 3. Subscription Stats (placeholder)
        subscription_stats = {
            "basic": 10,
            "premium": 5,
            "enterprise": 1
        }
        
        # 4. Page Visits (placeholder)
        page_visits = [
            {"name": "Mon", "visits": 400},
            {"name": "Tue", "visits": 300},
            {"name": "Wed", "visits": 200},
            {"name": "Thu", "visits": 278},
            {"name": "Fri", "visits": 190},
            {"name": "Sat", "visits": 229},
            {"name": "Sun", "visits": 200},
        ]
        
        return jsonify({
            "activeUsers": active_users,
            "totalUsers": total_users,
            "toolUsage": tool_usage,
            "subscriptionStats": subscription_stats,
            "pageVisits": page_visits
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error fetching admin analytics: {e}")
        return jsonify({"message": "Server error"}), 500

# --- Admin Tools Management ---

@admin_required()
def get_all_tools():
    """Fetches a list of all tools."""
    try:
        tools_data = get_tool_collection().find({}).sort("name", 1)
        tools = [Tool.from_dict(t).to_dict() for t in tools_data]
        
        return jsonify({
            "data": tools,
            "total": len(tools),
            "page": 1,
            "limit": 10
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error fetching all tools: {e}")
        return jsonify({"message": "Server error"}), 500

@admin_required()
def create_tool():
    data = request.get_json()
    
    try:
        new_tool = Tool(
            name=data['name'],
            category=data['category'],
            description=data['description'],
            active=data.get('active', True)
        )
        result = get_tool_collection().insert_one(new_tool.__dict__)
        new_tool._id = result.inserted_id
        
        return jsonify(new_tool.to_dict()), 201
    except Exception as e:
        current_app.logger.error(f"Error creating tool: {e}")
        return jsonify({"message": "Error creating tool"}), 500

@admin_required()
def update_tool(tool_id):
    data = request.get_json()
    
    try:
        update_data = {k: v for k, v in data.items() if k in Tool.__init__.__code__.co_varnames and k not in ['_id', 'created_at', 'usage_count']}
        update_data['updated_at'] = datetime.utcnow()
        
        result = get_tool_collection().update_one(
            {"_id": ObjectId(tool_id)},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            return jsonify({"message": "Tool not found"}), 404
            
        updated_tool_data = get_tool_collection().find_one({"_id": ObjectId(tool_id)})
        
        return jsonify(Tool.from_dict(updated_tool_data).to_dict()), 200
        
    except Exception as e:
        current_app.logger.error(f"Error updating tool: {e}")
        return jsonify({"message": "Invalid tool ID or server error"}), 400

@admin_required()
def delete_tool(tool_id):
    try:
        result = get_tool_collection().delete_one({"_id": ObjectId(tool_id)})
        
        if result.deleted_count == 0:
            return jsonify({"message": "Tool not found"}), 404
            
        return jsonify({"success": True}), 200
        
    except Exception as e:
        current_app.logger.error(f"Error deleting tool: {e}")
        return jsonify({"message": "Invalid tool ID or server error"}), 400

@admin_required()
def toggle_tool_status(tool_id):
    try:
        tool_obj_id = ObjectId(tool_id)
        tool_data = get_tool_collection().find_one({"_id": tool_obj_id})
        if not tool_data:
            return jsonify({"message": "Tool not found"}), 404
            
        new_status = not tool_data.get('active', False)
        
        get_tool_collection().update_one(
            {"_id": tool_obj_id},
            {"$set": {"active": new_status, "updated_at": datetime.utcnow()}}
        )
        
        return jsonify({
            "message": f"Tool status set to {new_status}",
            "active": new_status
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error toggling tool status: {e}")
        return jsonify({"message": "Invalid tool ID or server error"}), 400

# --- Admin Settings (System-wide configuration) ---

@admin_required()
def get_system_settings():
    """Fetches system-wide settings (e.g., global tax rate, default currency)."""
    # System settings are typically stored in a dedicated collection or a single document
    # For simplicity, we'll use a single document in a 'system_settings' collection
    settings = current_app.db.system_settings.find_one({"_id": "global_settings"})
    
    if not settings:
        # Return default settings if none exist
        settings = {
            "default_currency": "USD",
            "global_tax_rate": 0.08,
            "openai_model": "gemini-2.5-flash",
            "frontend_version": "1.0.0",
            "backend_version": "1.0.0"
        }
        current_app.db.system_settings.insert_one({"_id": "global_settings", **settings})
        
    # Remove _id for cleaner API response
    settings.pop('_id', None)
    
    return jsonify(settings), 200

@admin_required()
def update_system_settings():
    data = request.get_json()
    
    try:
        update_data = {k: v for k, v in data.items()}
        
        current_app.db.system_settings.update_one(
            {"_id": "global_settings"},
            {"$set": update_data},
            upsert=True
        )
        
        return jsonify({"message": "System settings updated successfully"}), 200
        
    except Exception as e:
        current_app.logger.error(f"Error updating system settings: {e}")
        return jsonify({"message": "Server error"}), 500
