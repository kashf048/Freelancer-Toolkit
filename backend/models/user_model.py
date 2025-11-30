from bson.objectid import ObjectId
from datetime import datetime

class User:
    def __init__(self, email, password_hash, first_name, last_name, is_admin=False, business_settings=None, api_keys=None, notification_preferences=None, user_preferences=None, created_at=None, updated_at=None, _id=None):
        self._id = _id if _id else ObjectId()
        self.email = email
        self.password_hash = password_hash
        self.first_name = first_name
        self.last_name = last_name
        self.is_admin = is_admin
        self.business_settings = business_settings if business_settings is not None else self._default_business_settings()
        self.api_keys = api_keys if api_keys is not None else self._default_api_keys()
        self.notification_preferences = notification_preferences if notification_preferences is not None else self._default_notification_preferences()
        self.user_preferences = user_preferences if user_preferences is not None else self._default_user_preferences()
        self.created_at = created_at if created_at else datetime.utcnow()
        self.updated_at = updated_at if updated_at else datetime.utcnow()

    def to_dict(self):
        return {
            "_id": str(self._id),
            "email": self.email,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "is_admin": self.is_admin,
            "business_settings": self.business_settings,
            "api_keys": self.api_keys,
            "notification_preferences": self.notification_preferences,
            "user_preferences": self.user_preferences,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }

    @staticmethod
    def from_dict(data):
        return User(
            _id=data.get('_id'),
            email=data.get('email'),
            password_hash=data.get('password_hash'),
            first_name=data.get('first_name'),
            last_name=data.get('last_name'),
            is_admin=data.get('is_admin', False),
            business_settings=data.get('business_settings'),
            api_keys=data.get('api_keys'),
            notification_preferences=data.get('notification_preferences'),
            user_preferences=data.get('user_preferences'),
            created_at=data.get('created_at'),
            updated_at=data.get('updated_at')
        )

    def _default_business_settings(self):
        return {
            "company_name": f"{self.first_name} {self.last_name} Freelance",
            "logo_url": None,
            "address": "",
            "phone": "",
            "tax_id": "",
            "bank_details": ""
        }

    def _default_api_keys(self):
        return {
            "openai_key": None,
            "stripe_key": None,
            "google_calendar_token": None,
            "google_gmail_token": None,
        }

    def _default_notification_preferences(self):
        return {
            "invoice_paid": True,
            "new_project": True,
            "overdue_reminder": True,
            "system_updates": True
        }

    def _default_user_preferences(self):
        return {
            "theme": "system",
            "currency": "USD",
            "language": "en"
        }
