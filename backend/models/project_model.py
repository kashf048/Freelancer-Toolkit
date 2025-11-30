from bson.objectid import ObjectId
from datetime import datetime

class Project:
    def __init__(self, user_id, client_id, title, description, status, start_date, end_date, budget, created_at=None, updated_at=None, _id=None):
        self._id = _id if _id else ObjectId()
        self.user_id = ObjectId(user_id)
        self.client_id = ObjectId(client_id)
        self.title = title
        self.description = description
        self.status = status # e.g., 'Pending', 'In Progress', 'Completed', 'On Hold'
        self.start_date = start_date # ISO format string or datetime object
        self.end_date = end_date # ISO format string or datetime object
        self.budget = budget
        self.created_at = created_at if created_at else datetime.utcnow()
        self.updated_at = updated_at if updated_at else datetime.utcnow()

    def to_dict(self):
        return {
            "_id": str(self._id),
            "user_id": str(self.user_id),
            "client_id": str(self.client_id),
            "title": self.title,
            "description": self.description,
            "status": self.status,
            "start_date": self.start_date,
            "end_date": self.end_date,
            "budget": self.budget,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }

    @staticmethod
    def from_dict(data):
        return Project(
            _id=data.get('_id'),
            user_id=data.get('user_id'),
            client_id=data.get('client_id'),
            title=data.get('title'),
            description=data.get('description'),
            status=data.get('status'),
            start_date=data.get('start_date'),
            end_date=data.get('end_date'),
            budget=data.get('budget'),
            created_at=data.get('created_at'),
            updated_at=data.get('updated_at')
        )

class Milestone:
    def __init__(self, project_id, title, due_date, status, notes=None, calendar_event_id=None, created_at=None, updated_at=None, _id=None):
        self._id = _id if _id else ObjectId()
        self.project_id = ObjectId(project_id)
        self.title = title
        self.due_date = due_date # ISO format string or datetime object
        self.status = status # e.g., 'Pending', 'Completed'
        self.notes = notes
        self.calendar_event_id = calendar_event_id # Google Calendar Event ID
        self.created_at = created_at if created_at else datetime.utcnow()
        self.updated_at = updated_at if updated_at else datetime.utcnow()

    def to_dict(self):
        return {
            "_id": str(self._id),
            "project_id": str(self.project_id),
            "title": self.title,
            "due_date": self.due_date,
            "status": self.status,
            "notes": self.notes,
            "calendar_event_id": self.calendar_event_id,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }

    @staticmethod
    def from_dict(data):
        return Milestone(
            _id=data.get('_id'),
            project_id=data.get('project_id'),
            title=data.get('title'),
            due_date=data.get('due_date'),
            status=data.get('status'),
            notes=data.get('notes'),
            calendar_event_id=data.get('calendar_event_id'),
            created_at=data.get('created_at'),
            updated_at=data.get('updated_at')
        )
