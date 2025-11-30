from bson.objectid import ObjectId
from datetime import datetime

class Event:
    def __init__(self, user_id, title, start_time, end_time, description=None, location=None, google_event_id=None, created_at=None, updated_at=None, _id=None):
        self._id = _id if _id else ObjectId()
        self.user_id = ObjectId(user_id)
        self.title = title
        self.start_time = start_time # ISO format string or datetime object
        self.end_time = end_time # ISO format string or datetime object
        self.description = description
        self.location = location
        self.google_event_id = google_event_id # Google Calendar Event ID
        self.created_at = created_at if created_at else datetime.utcnow()
        self.updated_at = updated_at if updated_at else datetime.utcnow()

    def to_dict(self):
        return {
            "_id": str(self._id),
            "user_id": str(self.user_id),
            "title": self.title,
            "start_time": self.start_time,
            "end_time": self.end_time,
            "description": self.description,
            "location": self.location,
            "google_event_id": self.google_event_id,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }

    @staticmethod
    def from_dict(data):
        return Event(
            _id=data.get('_id'),
            user_id=data.get('user_id'),
            title=data.get('title'),
            start_time=data.get('start_time'),
            end_time=data.get('end_time'),
            description=data.get('description'),
            location=data.get('location'),
            google_event_id=data.get('google_event_id'),
            created_at=data.get('created_at'),
            updated_at=data.get('updated_at')
        )
