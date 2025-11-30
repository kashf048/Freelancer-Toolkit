from flask import current_app, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId
from models.notification_model import Notification
from datetime import datetime

def get_notification_collection():
    return current_app.db.notifications

@jwt_required()
def get_notifications():
    user_id = get_jwt_identity()
    
    try:
        # Fetch unread notifications first, then read ones, limited to a recent number (e.g., 50)
        notifications_data = get_notification_collection().find({"user_id": ObjectId(user_id)}).sort([("is_read", 1), ("created_at", -1)]).limit(50)
        notifications = [Notification.from_dict(n).to_dict() for n in notifications_data]
        
        unread_count = get_notification_collection().count_documents({"user_id": ObjectId(user_id), "is_read": False})
        
        return jsonify({
            "notifications": notifications,
            "unread_count": unread_count
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error fetching notifications: {e}")
        return jsonify({"message": "Error fetching notifications"}), 500

@jwt_required()
def mark_as_read(notification_id):
    user_id = get_jwt_identity()
    
    try:
        result = get_notification_collection().update_one(
            {"_id": ObjectId(notification_id), "user_id": ObjectId(user_id)},
            {"$set": {"is_read": True, "updated_at": datetime.utcnow()}}
        )
        
        if result.matched_count == 0:
            return jsonify({"message": "Notification not found or unauthorized"}), 404
            
        return jsonify({"message": "Notification marked as read"}), 200
        
    except Exception as e:
        current_app.logger.error(f"Error marking notification as read: {e}")
        return jsonify({"message": "Invalid notification ID or server error"}), 400

@jwt_required()
def mark_all_as_read():
    user_id = get_jwt_identity()
    
    try:
        result = get_notification_collection().update_many(
            {"user_id": ObjectId(user_id), "is_read": False},
            {"$set": {"is_read": True, "updated_at": datetime.utcnow()}}
        )
        
        return jsonify({"message": f"Marked {result.modified_count} notifications as read"}), 200
        
    except Exception as e:
        current_app.logger.error(f"Error marking all notifications as read: {e}")
        return jsonify({"message": "Server error"}), 500
