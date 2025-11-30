// Payment service for Stripe integration and invoice management

// Mock Stripe integration (in production, this would use actual Stripe API)
const STRIPE_PUBLISHABLE_KEY = import.meta.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_mock';

export const paymentService = {
  // Initialize Stripe (mock implementation)
  async initializeStripe() {
    // In production, this would load the actual Stripe library
    return {
      createPaymentIntent: this.createPaymentIntent,
      confirmPayment: this.confirmPayment,
      createPaymentLink: this.createPaymentLink
    };
  },

  // Create payment intent for invoice
  async createPaymentIntent(invoiceData) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock payment intent creation
      const paymentIntent = {
        id: `pi_${Date.now()}`,
        amount: invoiceData.amount * 100, // Convert to cents
        currency: 'usd',
        status: 'requires_payment_method',
        client_secret: `pi_${Date.now()}_secret_mock`,
        invoice_id: invoiceData.id
      };

      return {
        success: true,
        paymentIntent
      };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Confirm payment
  async confirmPayment(paymentIntentId, paymentMethodId) {
    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock payment confirmation (90% success rate for demo)
      const isSuccess = Math.random() > 0.1;

      if (isSuccess) {
        return {
          success: true,
          paymentIntent: {
            id: paymentIntentId,
            status: 'succeeded',
            amount_received: 25000 * 100, // Mock amount in cents
            created: Date.now() / 1000
          }
        };
      } else {
        return {
          success: false,
          error: 'Your card was declined. Please try a different payment method.'
        };
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Create payment link for invoice
  async createPaymentLink(invoiceData) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock payment link creation
      const paymentLink = {
        id: `plink_${Date.now()}`,
        url: `https://pay.stripe.com/invoice/${invoiceData.id}`,
        invoice_id: invoiceData.id,
        active: true,
        created: Date.now() / 1000
      };

      return {
        success: true,
        paymentLink
      };
    } catch (error) {
      console.error('Error creating payment link:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Process webhook events (mock implementation)
  async processWebhookEvent(event) {
    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          return this.handlePaymentSuccess(event.data.object);
        case 'payment_intent.payment_failed':
          return this.handlePaymentFailure(event.data.object);
        case 'invoice.payment_succeeded':
          return this.handleInvoicePaymentSuccess(event.data.object);
        default:
          console.log(`Unhandled event type: ${event.type}`);
          return { success: true };
      }
    } catch (error) {
      console.error('Error processing webhook:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Handle successful payment
  async handlePaymentSuccess(paymentIntent) {
    try {
      // Update invoice status to paid
      const invoiceId = paymentIntent.invoice_id;
      await this.updateInvoiceStatus(invoiceId, 'Paid', {
        paidDate: new Date().toISOString(),
        paymentIntentId: paymentIntent.id,
        amountPaid: paymentIntent.amount_received / 100
      });

      return {
        success: true,
        message: 'Payment processed successfully'
      };
    } catch (error) {
      console.error('Error handling payment success:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Handle failed payment
  async handlePaymentFailure(paymentIntent) {
    try {
      // Log payment failure
      console.log('Payment failed for invoice:', paymentIntent.invoice_id);
      
      // Could send notification to client about failed payment
      return {
        success: true,
        message: 'Payment failure handled'
      };
    } catch (error) {
      console.error('Error handling payment failure:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Update invoice status
  async updateInvoiceStatus(invoiceId, status, additionalData = {}) {
    try {
      // In production, this would update the database
      const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
      const invoiceIndex = invoices.findIndex(inv => inv.id === invoiceId);
      
      if (invoiceIndex !== -1) {
        invoices[invoiceIndex] = {
          ...invoices[invoiceIndex],
          status,
          ...additionalData
        };
        localStorage.setItem('invoices', JSON.stringify(invoices));
      }

      return {
        success: true,
        invoice: invoices[invoiceIndex]
      };
    } catch (error) {
      console.error('Error updating invoice status:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get payment analytics
  async getPaymentAnalytics(dateRange = 'month') {
    try {
      // Mock analytics data
      const analytics = {
        totalRevenue: 115000,
        totalInvoices: 5,
        paidInvoices: 1,
        pendingAmount: 90000,
        overdueAmount: 45000,
        averagePaymentTime: 8.5, // days
        paymentMethods: {
          card: 85,
          bank_transfer: 15
        },
        monthlyRevenue: [
          { month: 'Jan', revenue: 45000 },
          { month: 'Feb', revenue: 70000 },
          { month: 'Mar', revenue: 0 }
        ],
        recentPayments: [
          {
            id: 'pay_001',
            invoice: 'INV-2024-001',
            amount: 25000,
            client: 'TechStart Inc.',
            date: '2024-02-10',
            method: 'card'
          }
        ]
      };

      return {
        success: true,
        analytics
      };
    } catch (error) {
      console.error('Error fetching payment analytics:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Send invoice via email
  async sendInvoice(invoiceId, emailData) {
    try {
      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock email sending
      const emailResult = {
        id: `email_${Date.now()}`,
        invoice_id: invoiceId,
        recipient: emailData.to,
        subject: emailData.subject,
        sent_at: new Date().toISOString(),
        status: 'sent'
      };

      // Update invoice status to 'Sent' if it was 'Draft'
      await this.updateInvoiceStatus(invoiceId, 'Sent', {
        sentDate: new Date().toISOString()
      });

      return {
        success: true,
        emailResult
      };
    } catch (error) {
      console.error('Error sending invoice:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Generate invoice PDF
  async generateInvoicePDF(invoiceData) {
    try {
      // Simulate PDF generation delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock PDF generation
      const pdfContent = this.createInvoicePDFContent(invoiceData);
      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      return {
        success: true,
        url,
        filename: `${invoiceData.number}.pdf`
      };
    } catch (error) {
      console.error('Error generating PDF:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Create PDF content (simplified)
  createInvoicePDFContent(invoice) {
    return `
INVOICE: ${invoice.number}

Bill To:
${invoice.client}
${invoice.clientEmail}

Invoice Details:
Issue Date: ${invoice.issueDate}
Due Date: ${invoice.dueDate}
Status: ${invoice.status}

Project: ${invoice.project}
Description: ${invoice.description}

Line Items:
${invoice.items.map(item => 
  `${item.description} - Qty: ${item.quantity} - Rate: $${item.rate} - Amount: $${item.amount}`
).join('\n')}

Total Amount: $${invoice.amount}

${invoice.paymentLink ? `Payment Link: ${invoice.paymentLink}` : ''}

Thank you for your business!
    `;
  }
};

export default paymentService;

