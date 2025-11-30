from flask import current_app, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId
from models.event_model import Event
from services.google_calendar_service import create_calendar_event, delete_calendar_event, get_calendar_events # Placeholder
from datetime import datetime

def get_event_collection():
    return current_app.db.events

@jwt_required()
def create_event():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    try:
        new_event = Event(
            user_id=user_id,
            title=data['title'],
            start_time=data['start_time'],
            end_time=data['end_time'],
            description=data.get('description'),
            location=data.get('location')
        )
        
        # Auto-sync with Google Calendar
        # Note: create_calendar_event expects a Milestone object, we need to adapt or create a wrapper
        # For simplicity, we'll just save to local DB for now, and the service function is a placeholder
        # google_event_id = create_calendar_event(user_id, new_event) 
        # new_event.google_event_id = google_event_id
        
        result = get_event_collection().insert_one(new_event.__dict__)
        new_event._id = result.inserted_id
        
        return jsonify({
            "message": "Event created successfully",
            "event": new_event.to_dict()
        }), 201
    except Exception as e:
        current_app.logger.error(f"Error creating event: {e}")
        return jsonify({"message": "Error creating event"}), 500

@jwt_required()
def get_events():
    user_id = get_jwt_identity()
    
    # Get time range from query parameters (e.g., for a month view)
    time_min = request.args.get('time_min')
    time_max = request.args.get('time_max')
    
    try:
        # 1. Fetch local events
        query = {"user_id": ObjectId(user_id)}
        if time_min and time_max:
            query["start_time"] = {"$gte": time_min, "$lte": time_max}
            
        local_events_data = get_event_collection().find(query).sort("start_time", 1)
        local_events = [Event.from_dict(e).to_dict() for e in local_events_data]
        
        # 2. Fetch Google Calendar events (if integrated)
        # google_events = get_calendar_events(user_id, time_min, time_max)
        # events = local_events + google_events # Merge events
        
        return jsonify(local_events), 200
        
    except Exception as e:
        current_app.logger.error(f"Error fetching events: {e}")
        return jsonify({"message": "Error fetching events"}), 500

@jwt_required()
def update_event(event_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    
    try:
        update_data = {k: v for k, v in data.items() if k in Event.__init__.__code__.co_varnames and k not in ['_id', 'user_id', 'created_at']}
        update_data['updated_at'] = datetime.utcnow()
        
        result = get_event_collection().update_one(
            {"_id": ObjectId(event_id), "user_id": ObjectId(user_id)},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            return jsonify({"message": "Event not found or unauthorized"}), 404
            
        # TODO: Update Google Calendar event if google_event_id exists
            
        updated_event_data = get_event_collection().find_one({"_id": ObjectId(event_id)})
        
        return jsonify({
            "message": "Event updated successfully",
            "event": Event.from_dict(updated_event_data).to_dict()
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error updating event: {e}")
        return jsonify({"message": "Invalid event ID or server error"}), 400

@jwt_required()
def delete_event(event_id):
    user_id = get_jwt_identity()
    
    try:
        event_data = get_event_collection().find_one({"_id": ObjectId(event_id), "user_id": ObjectId(user_id)})
        if not event_data:
            return jsonify({"message": "Event not found or unauthorized"}), 404
            
        result = get_event_collection().delete_one({"_id": ObjectId(event_id)})
        
        # TODO: Delete Google Calendar event if google_event_id exists
        # if event_data.get('google_event_id'):
        #     delete_calendar_event(user_id, event_data['google_event_id'])
            
        return jsonify({"message": "Event deleted successfully"}), 200
        
    except Exception as e:
        current_app.logger.error(f"Error deleting event: {e}")
        return jsonify({"message": "Invalid event ID or server error"}), 400
