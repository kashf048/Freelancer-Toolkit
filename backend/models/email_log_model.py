from bson.objectid import ObjectId
from datetime import datetime

class EmailLog:
    def __init__(self, user_id, recipient, subject, body_preview, status, related_invoice_id=None, created_at=None, _id=None):
        self._id = _id if _id else ObjectId()
        self.user_id = ObjectId(user_id)
        self.recipient = recipient
        self.subject = subject
        self.body_preview = body_preview
        self.status = status # e.g., 'Sent', 'Failed'
        self.related_invoice_id = related_invoice_id
        self.created_at = created_at if created_at else datetime.utcnow()

    def to_dict(self):
        return {
            "_id": str(self._id),
            "user_id": str(self.user_id),
            "recipient": self.recipient,
            "subject": self.subject,
            "body_preview": self.body_preview,
            "status": self.status,
            "related_invoice_id": str(self.related_invoice_id) if self.related_invoice_id else None,
            "created_at": self.created_at.isoformat(),
        }

    @staticmethod
    def from_dict(data):
        return EmailLog(
            _id=data.get('_id'),
            user_id=data.get('user_id'),
            recipient=data.get('recipient'),
            subject=data.get('subject'),
            body_preview=data.get('body_preview'),
            status=data.get('status'),
            related_invoice_id=data.get('related_invoice_id'),
            created_at=data.get('created_at')
        )
