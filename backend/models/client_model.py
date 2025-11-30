from bson.objectid import ObjectId
from datetime import datetime

class Client:
    def __init__(self, user_id, name, email, phone, address, company, tax_id=None, notes=None, created_at=None, updated_at=None, _id=None):
        self._id = _id if _id else ObjectId()
        self.user_id = ObjectId(user_id)
        self.name = name
        self.email = email
        self.phone = phone
        self.address = address
        self.company = company
        self.tax_id = tax_id
        self.notes = notes
        self.created_at = created_at if created_at else datetime.utcnow()
        self.updated_at = updated_at if updated_at else datetime.utcnow()

    def to_dict(self):
        return {
            "_id": str(self._id),
            "user_id": str(self.user_id),
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "address": self.address,
            "company": self.company,
            "tax_id": self.tax_id,
            "notes": self.notes,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }

    @staticmethod
    def from_dict(data):
        return Client(
            _id=data.get('_id'),
            user_id=data.get('user_id'),
            name=data.get('name'),
            email=data.get('email'),
            phone=data.get('phone'),
            address=data.get('address'),
            company=data.get('company'),
            tax_id=data.get('tax_id'),
            notes=data.get('notes'),
            created_at=data.get('created_at'),
            updated_at=data.get('updated_at')
        )
