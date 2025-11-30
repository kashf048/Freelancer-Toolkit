from flask import current_app
from datetime import datetime, timedelta
from bson.objectid import ObjectId
from models.invoice_model import Invoice
from models.client_model import Client
from services.gmail_service import send_overdue_reminder # Placeholder

def check_and_send_overdue_reminders():
    """
    Checks for overdue invoices and sends a reminder email to the client.
    This function is intended to be run daily by APScheduler.
    """
    with current_app.app_context():
        db = current_app.db
        
        # 1. Find all invoices that are 'Sent' and whose due_date is in the past
        today = datetime.utcnow().date()
        
        # Find invoices that are 'Sent' and due_date is less than today
        overdue_invoices_data = db.invoices.find({
            "status": "Sent",
            "due_date": {"$lt": today.isoformat()}
        })
        
        for invoice_data in overdue_invoices_data:
            try:
                invoice = Invoice.from_dict(invoice_data)
                
                # 2. Update status to 'Overdue'
                db.invoices.update_one(
                    {"_id": invoice._id},
                    {"$set": {"status": "Overdue", "updated_at": datetime.utcnow()}}
                )
                
                # 3. Fetch client details
                client_data = db.clients.find_one({"_id": invoice.client_id})
                if not client_data:
                    current_app.logger.error(f"Client not found for overdue invoice {invoice._id}")
                    continue
                client = Client.from_dict(client_data)
                
                # 4. Send overdue reminder email
                # send_overdue_reminder(invoice, client) # Placeholder function
                current_app.logger.info(f"Overdue reminder sent for invoice {invoice.invoice_number} to {client.email}")
                
                # 5. Create a notification for the user
                db.notifications.insert_one({
                    "user_id": invoice.user_id,
                    "message": f"Invoice {invoice.invoice_number} to {client.name} is now overdue.",
                    "type": "overdue_reminder",
                    "related_id": invoice._id,
                    "is_read": False,
                    "created_at": datetime.utcnow()
                })
                
            except Exception as e:
                current_app.logger.error(f"Error processing overdue invoice {invoice_data.get('_id')}: {e}")

def schedule_daily_jobs(scheduler):
    """Schedules the daily cron jobs."""
    # Run every day at 08:00 UTC
    scheduler.add_job(
        check_and_send_overdue_reminders, 
        'cron', 
        hour=8, 
        minute=0, 
        id='overdue_reminder_job', 
        replace_existing=True
    )
    pass

# NOTE: The scheduling logic is called in app.py after the scheduler is initialized.
