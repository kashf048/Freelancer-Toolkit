import stripe
from flask import current_app, jsonify, request
from bson.objectid import ObjectId
from models.invoice_model import Invoice
from datetime import datetime

def init_stripe():
    """Initializes Stripe API key."""
    stripe.api_key = current_app.config['STRIPE_SECRET_KEY']

def create_payment_link(invoice: Invoice):
    """Creates a Stripe Payment Link for an invoice."""
    init_stripe()
    
    # 1. Create Stripe Product and Price (or use existing ones)
    # For simplicity, we'll create a one-time price for the total invoice amount.
    try:
        # Convert total amount to cents/smallest currency unit
        amount_in_cents = int(invoice.total_amount * 100)
        
        # Create a product for the invoice
        product = stripe.Product.create(
            name=f"Invoice #{invoice.invoice_number}",
            description=f"Payment for invoice {invoice.invoice_number} (Client: {invoice.client_id})",
        )
        
        # Create a price for the product
        price = stripe.Price.create(
            unit_amount=amount_in_cents,
            currency=invoice.currency.lower(),
            product=product.id,
        )
        
        # 2. Create a Payment Link
        payment_link = stripe.PaymentLink.create(
            line_items=[
                {
                    "price": price.id,
                    "quantity": 1,
                },
            ],
            # Pass invoice ID as metadata for webhook
            metadata={"invoice_id": str(invoice._id)},
            # After payment, redirect to a success page (e.g., frontend's invoice detail)
            after_completion={"type": "redirect", "redirect": {"url": f"{current_app.config['FRONTEND_URL']}/invoices/{str(invoice._id)}?payment=success"}},
        )
        
        # The payment link ID can be used as the session ID for tracking
        return payment_link.url, payment_link.id
        
    except stripe.error.StripeError as e:
        current_app.logger.error(f"Stripe error in create_payment_link: {e}")
        return None, None
    except Exception as e:
        current_app.logger.error(f"General error in create_payment_link: {e}")
        return None, None

def handle_stripe_webhook():
    """Handles incoming Stripe webhook events."""
    init_stripe()
    
    payload = request.data
    sig_header = request.headers.get('stripe-signature')
    endpoint_secret = current_app.config['STRIPE_WEBHOOK_SECRET']
    
    event = None
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError as e:
        # Invalid payload
        current_app.logger.error(f"Stripe Webhook Error: Invalid payload: {e}")
        return jsonify({'success': False, 'message': 'Invalid payload'}), 400
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        current_app.logger.error(f"Stripe Webhook Error: Invalid signature: {e}")
        return jsonify({'success': False, 'message': 'Invalid signature'}), 400

    # Handle the event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        
        # Retrieve the invoice ID from the metadata
        invoice_id = session.get('metadata', {}).get('invoice_id')
        
        if invoice_id:
            # Update the invoice status to 'Paid'
            result = current_app.db.invoices.update_one(
                {"_id": ObjectId(invoice_id)},
                {"$set": {"status": "Paid", "updated_at": datetime.utcnow()}}
            )
            
            if result.matched_count > 0:
                current_app.logger.info(f"Invoice {invoice_id} successfully marked as Paid.")
                # TODO: Add notification logic here
            else:
                current_app.logger.warning(f"Invoice {invoice_id} not found for webhook update.")
        
    # Other events can be handled here (e.g., payment_intent.succeeded, invoice.paid)
    
    return jsonify({'success': True}), 200
