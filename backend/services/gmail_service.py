from flask import current_app
from googleapiclient.discovery import build
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import base64
from models.invoice_model import Invoice
from models.client_model import Client
from utils.google_oauth_utils import get_google_credentials # To get user's credentials

# Placeholder for a real service function
def get_gmail_service(user_id):
    """Initializes and returns the Gmail service."""
    # credentials = get_google_credentials(user_id)
    # if not credentials:
    #     return None
    # return build('gmail', 'v1', credentials=credentials)
    return None

def create_message(sender, to, subject, message_text):
    """Create a message for API call."""
    message = MIMEText(message_text)
    message['to'] = to
    message['from'] = sender
    message['subject'] = subject
    raw = base64.urlsafe_b64encode(message.as_bytes()).decode()
    return {'raw': raw}

def send_invoice_email(invoice: Invoice, client: Client):
    """Sends an invoice email to the client."""
    user_id = str(invoice.user_id)
    service = get_gmail_service(user_id)
    if not service:
        current_app.logger.warning(f"Gmail service not available for user {user_id}")
        return
        
    try:
        sender = current_app.config['SENDER_EMAIL']
        recipient = client.email
        subject = f"Invoice #{invoice.invoice_number} from {current_app.db.users.find_one({'_id': invoice.user_id}).get('first_name')} - {invoice.status}"
        
        body = f"""
        Dear {client.name},

        Please find attached your invoice #{invoice.invoice_number} for {invoice.total_amount} {invoice.currency}.
        The due date for this invoice is {invoice.due_date}.

        You can view and pay the invoice using the following link:
        {invoice.stripe_payment_link}

        A PDF copy of the invoice is also available here:
        {invoice.pdf_url}

        Thank you for your business.

        Best regards,
        {current_app.db.users.find_one({'_id': invoice.user_id}).get('first_name')}
        """
        
        message = create_message(sender, recipient, subject, body)
        
        # service.users().messages().send(userId='me', body=message).execute()
        current_app.logger.info(f"Simulated sending email for invoice {invoice._id} to {recipient}")
        
        # Log the email
        # TODO: Implement EmailLog model and logging
        
    except Exception as e:
        current_app.logger.error(f"Error sending email via Gmail API: {e}")

def send_overdue_reminder(invoice: Invoice, client: Client):
    """Sends an overdue reminder email to the client."""
    # Similar logic to send_invoice_email, but with a different subject/body
    pass
