from bson.objectid import ObjectId
from datetime import datetime

class Document:
    def __init__(self, user_id, client_id, project_id, doc_type, title, content, pdf_url=None, created_at=None, updated_at=None, _id=None):
        self._id = _id if _id else ObjectId()
        self.user_id = ObjectId(user_id)
        self.client_id = ObjectId(client_id)
        self.project_id = ObjectId(project_id) if project_id else None
        self.doc_type = doc_type # Project Proposal, Contract Agreement, Invoice, Business Letter, Price Quote, Project Report
        self.title = title
        self.content = content # AI drafted text
        self.pdf_url = pdf_url # Cloudinary URL
        self.created_at = created_at if created_at else datetime.utcnow()
        self.updated_at = updated_at if updated_at else datetime.utcnow()

    def to_dict(self):
        return {
            "_id": str(self._id),
            "user_id": str(self.user_id),
            "client_id": str(self.client_id),
            "project_id": str(self.project_id) if self.project_id else None,
            "doc_type": self.doc_type,
            "title": self.title,
            "content": self.content,
            "pdf_url": self.pdf_url,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }

    @staticmethod
    def from_dict(data):
        return Document(
            _id=data.get('_id'),
            user_id=data.get('user_id'),
            client_id=data.get('client_id'),
            project_id=data.get('project_id'),
            doc_type=data.get('doc_type'),
            title=data.get('title'),
            content=data.get('content'),
            pdf_url=data.get('pdf_url'),
            created_at=data.get('created_at'),
            updated_at=data.get('updated_at')
        )
