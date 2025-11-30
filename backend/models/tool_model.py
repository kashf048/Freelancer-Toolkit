from bson.objectid import ObjectId
from datetime import datetime

class Tool:
    def __init__(self, name, category, description, active=True, usage_count=0, created_at=None, updated_at=None, _id=None):
        self._id = _id if _id else ObjectId()
        self.name = name
        self.category = category
        self.description = description
        self.active = active
        self.usage_count = usage_count
        self.created_at = created_at if created_at else datetime.utcnow()
        self.updated_at = updated_at if updated_at else datetime.utcnow()

    def to_dict(self):
        return {
            "id": str(self._id), # Frontend expects 'id'
            "name": self.name,
            "category": self.category,
            "description": self.description,
            "active": self.active,
            "usageCount": self.usage_count, # Frontend expects 'usageCount'
            "createdAt": self.created_at.isoformat().split('T')[0], # Frontend expects 'createdAt' in YYYY-MM-DD
        }

    @staticmethod
    def from_dict(data):
        return Tool(
            _id=data.get('_id'),
            name=data.get('name'),
            category=data.get('category'),
            description=data.get('description'),
            active=data.get('active', True),
            usage_count=data.get('usage_count', 0),
            created_at=data.get('created_at'),
            updated_at=data.get('updated_at')
        )
