from flask import current_app, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId
from models.user_model import User
from utils.auth_utils import hash_password
from services.cloudinary_service import upload_file
from datetime import datetime

def get_user_collection():
    return current_app.db.users

@jwt_required()
def get_user_settings():
    user_id = get_jwt_identity()
    
    try:
        user_data = get_user_collection().find_one({"_id": ObjectId(user_id)})
        if not user_data:
            return jsonify({"message": "User not found"}), 404
            
        user = User.from_dict(user_data).to_dict()
        
        # Return only the settings-related fields
        return jsonify({
            "profile": {
                "first_name": user['first_name'],
                "last_name": user['last_name'],
                "email": user['email'],
            },
            "business_settings": user['business_settings'],
            "api_keys": user['api_keys'],
            "notification_preferences": user['notification_preferences'],
            "user_preferences": user['user_preferences']
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error fetching user settings: {e}")
        return jsonify({"message": "Server error"}), 500

@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    try:
        update_data = {}
        if 'first_name' in data:
            update_data['first_name'] = data['first_name']
        if 'last_name' in data:
            update_data['last_name'] = data['last_name']
        if 'email' in data:
            update_data['email'] = data['email']
        
        if not update_data:
            return jsonify({"message": "No fields to update"}), 400
            
        update_data['updated_at'] = datetime.utcnow()
        
        result = get_user_collection().update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            return jsonify({"message": "User not found"}), 404
            
        return jsonify({"message": "Profile updated successfully"}), 200
        
    except Exception as e:
        current_app.logger.error(f"Error updating profile: {e}")
        return jsonify({"message": "Server error"}), 500

@jwt_required()
def update_password():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    new_password = data.get('new_password')
    
    if not new_password:
        return jsonify({"message": "New password is required"}), 400
        
    try:
        password_hash = hash_password(new_password)
        
        result = get_user_collection().update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"password_hash": password_hash, "updated_at": datetime.utcnow()}}
        )
        
        if result.matched_count == 0:
            return jsonify({"message": "User not found"}), 404
            
        return jsonify({"message": "Password updated successfully"}), 200
        
    except Exception as e:
        current_app.logger.error(f"Error updating password: {e}")
        return jsonify({"message": "Server error"}), 500

@jwt_required()
def update_business_settings():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    try:
        # Handle logo upload separately if it's a file upload, but assuming JSON data for now
        # If the frontend sends a base64 string or a file, the logic needs to be adjusted
        
        update_data = {f"business_settings.{k}": v for k, v in data.items()}
        update_data['updated_at'] = datetime.utcnow()
        
        result = get_user_collection().update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            return jsonify({"message": "User not found"}), 404
            
        return jsonify({"message": "Business settings updated successfully"}), 200
        
    except Exception as e:
        current_app.logger.error(f"Error updating business settings: {e}")
        return jsonify({"message": "Server error"}), 500

@jwt_required()
def upload_logo():
    user_id = get_jwt_identity()
    
    # Assuming file upload is handled via a form-data request
    if 'logo' not in request.files:
        return jsonify({"message": "No logo file provided"}), 400
        
    logo_file = request.files['logo']
    
    try:
        # Save file temporarily
        temp_path = f"/tmp/logo_{user_id}_{logo_file.filename}"
        logo_file.save(temp_path)
        
        # Upload to Cloudinary
        cloudinary_url = upload_file(temp_path, folder="logos")
        
        # Clean up local file
        os.remove(temp_path)
        
        if not cloudinary_url:
            return jsonify({"message": "Failed to upload logo to cloud"}), 500
            
        # Update user's business settings
        result = get_user_collection().update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"business_settings.logo_url": cloudinary_url, "updated_at": datetime.utcnow()}}
        )
        
        if result.matched_count == 0:
            return jsonify({"message": "User not found"}), 404
            
        return jsonify({
            "message": "Logo uploaded and updated successfully",
            "logo_url": cloudinary_url
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error uploading logo: {e}")
        return jsonify({"message": "Server error during logo upload"}), 500

@jwt_required()
def update_api_keys():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    try:
        update_data = {f"api_keys.{k}": v for k, v in data.items()}
        update_data['updated_at'] = datetime.utcnow()
        
        result = get_user_collection().update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            return jsonify({"message": "User not found"}), 404
            
        return jsonify({"message": "API keys updated successfully"}), 200
        
    except Exception as e:
        current_app.logger.error(f"Error updating API keys: {e}")
        return jsonify({"message": "Server error"}), 500

@jwt_required()
def update_notification_preferences():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    try:
        update_data = {f"notification_preferences.{k}": v for k, v in data.items()}
        update_data['updated_at'] = datetime.utcnow()
        
        result = get_user_collection().update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            return jsonify({"message": "User not found"}), 404
            
        return jsonify({"message": "Notification preferences updated successfully"}), 200
        
    except Exception as e:
        current_app.logger.error(f"Error updating notification preferences: {e}")
        return jsonify({"message": "Server error"}), 500

@jwt_required()
def update_user_preferences():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    try:
        update_data = {f"user_preferences.{k}": v for k, v in data.items()}
        update_data['updated_at'] = datetime.utcnow()
        
        result = get_user_collection().update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            return jsonify({"message": "User not found"}), 404
            
        return jsonify({"message": "User preferences updated successfully"}), 200
        
    except Exception as e:
        current_app.logger.error(f"Error updating user preferences: {e}")
        return jsonify({"message": "Server error"}), 500
