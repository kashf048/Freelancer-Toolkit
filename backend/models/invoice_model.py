from bson.objectid import ObjectId
from datetime import datetime

class InvoiceItem:
    def __init__(self, description, quantity, unit_price, created_at=None, _id=None):
        self._id = _id if _id else ObjectId()
        self.description = description
        self.quantity = quantity
        self.unit_price = unit_price
        self.created_at = created_at if created_at else datetime.utcnow()

    def to_dict(self):
        return {
            "_id": str(self._id),
            "description": self.description,
            "quantity": self.quantity,
            "unit_price": self.unit_price,
            "total": round(self.quantity * self.unit_price, 2),
            "created_at": self.created_at.isoformat(),
        }

    @staticmethod
    def from_dict(data):
        return InvoiceItem(
            _id=data.get('_id'),
            description=data.get('description'),
            quantity=data.get('quantity'),
            unit_price=data.get('unit_price'),
            created_at=data.get('created_at')
        )

class Invoice:
    def __init__(self, user_id, client_id, project_id, invoice_number, issue_date, due_date, status, total_amount, currency, items, pdf_url=None, stripe_payment_link=None, stripe_session_id=None, created_at=None, updated_at=None, _id=None):
        self._id = _id if _id else ObjectId()
        self.user_id = ObjectId(user_id)
        self.client_id = ObjectId(client_id)
        self.project_id = ObjectId(project_id) if project_id else None
        self.invoice_number = invoice_number
        self.issue_date = issue_date # ISO format string or datetime object
        self.due_date = due_date # ISO format string or datetime object
        self.status = status # Draft, Sent, Viewed, Paid, Overdue
        self.total_amount = total_amount
        self.currency = currency
        self.items = [InvoiceItem.from_dict(item) if isinstance(item, dict) else item for item in items]
        self.pdf_url = pdf_url
        self.stripe_payment_link = stripe_payment_link
        self.stripe_session_id = stripe_session_id
        self.created_at = created_at if created_at else datetime.utcnow()
        self.updated_at = updated_at if updated_at else datetime.utcnow()

    def to_dict(self):
        return {
            "_id": str(self._id),
            "user_id": str(self.user_id),
            "client_id": str(self.client_id),
            "project_id": str(self.project_id) if self.project_id else None,
            "invoice_number": self.invoice_number,
            "issue_date": self.issue_date,
            "due_date": self.due_date,
            "status": self.status,
            "total_amount": self.total_amount,
            "currency": self.currency,
            "items": [item.to_dict() for item in self.items],
            "pdf_url": self.pdf_url,
            "stripe_payment_link": self.stripe_payment_link,
            "stripe_session_id": self.stripe_session_id,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }

    @staticmethod
    def from_dict(data):
        return Invoice(
            _id=data.get('_id'),
            user_id=data.get('user_id'),
            client_id=data.get('client_id'),
            project_id=data.get('project_id'),
            invoice_number=data.get('invoice_number'),
            issue_date=data.get('issue_date'),
            due_date=data.get('due_date'),
            status=data.get('status'),
            total_amount=data.get('total_amount'),
            currency=data.get('currency'),
            items=data.get('items', []),
            pdf_url=data.get('pdf_url'),
            stripe_payment_link=data.get('stripe_payment_link'),
            stripe_session_id=data.get('stripe_session_id'),
            created_at=data.get('created_at'),
            updated_at=data.get('updated_at')
        )
