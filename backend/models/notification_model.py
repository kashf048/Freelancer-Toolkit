from bson.objectid import ObjectId
from datetime import datetime

class Notification:
    def __init__(self, user_id, message, type, related_id=None, is_read=False, created_at=None, _id=None):
        self._id = _id if _id else ObjectId()
        self.user_id = ObjectId(user_id)
        self.message = message
        self.type = type # e.g., 'invoice_paid', 'new_project', 'overdue_reminder', 'system'
        self.related_id = related_id # ID of the related object (e.g., invoice_id, project_id)
        self.is_read = is_read
        self.created_at = created_at if created_at else datetime.utcnow()

    def to_dict(self):
        return {
            "_id": str(self._id),
            "user_id": str(self.user_id),
            "message": self.message,
            "type": self.type,
            "related_id": str(self.related_id) if self.related_id else None,
            "is_read": self.is_read,
            "created_at": self.created_at.isoformat(),
        }

    @staticmethod
    def from_dict(data):
        return Notification(
            _id=data.get('_id'),
            user_id=data.get('user_id'),
            message=data.get('message'),
            type=data.get('type'),
            related_id=data.get('related_id'),
            is_read=data.get('is_read', False),
            created_at=data.get('created_at')
        )
