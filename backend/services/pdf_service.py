from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib import colors
from models.invoice_model import Invoice
from models.document_model import Document
from datetime import datetime
import os

# --- PDF Generation Utilities ---

def get_styles():
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name='TitleStyle', fontSize=24, leading=30, alignment=1))
    styles.add(ParagraphStyle(name='Heading2', fontSize=14, leading=18, spaceBefore=12, spaceAfter=6))
    styles.add(ParagraphStyle(name='BodyText', fontSize=10, leading=12))
    return styles

def generate_invoice_pdf(invoice: Invoice):
    """Generates a PDF for an invoice and saves it to a temporary file."""
    temp_file_path = f"/tmp/invoice_{str(invoice._id)}.pdf"
    doc = SimpleDocTemplate(temp_file_path, pagesize=letter)
    styles = get_styles()
    story = []

    # Title
    story.append(Paragraph(f"INVOICE #{invoice.invoice_number}", styles['TitleStyle']))
    story.append(Spacer(1, 0.5 * 72)) # 0.5 inch spacer

    # Invoice Details Table (Placeholder for client/user info)
    # In a real app, you'd fetch user and client details here
    data = [
        ['Issue Date:', invoice.issue_date],
        ['Due Date:', invoice.due_date],
        ['Status:', invoice.status],
        ['Client ID:', str(invoice.client_id)],
        ['Project ID:', str(invoice.project_id) if invoice.project_id else 'N/A'],
    ]
    
    table = Table(data, colWidths=[1.5 * 72, 3.5 * 72])
    table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(table)
    story.append(Spacer(1, 0.25 * 72))

    # Items Table
    story.append(Paragraph("Invoice Items", styles['Heading2']))
    
    table_data = [['Description', 'Quantity', 'Unit Price', 'Total']]
    for item in invoice.items:
        table_data.append([
            item.description,
            str(item.quantity),
            f"{invoice.currency} {item.unit_price:.2f}",
            f"{invoice.currency} {item.total:.2f}"
        ])
        
    # Total Row
    table_data.append(['', '', 'Total:', f"{invoice.currency} {invoice.total_amount:.2f}"])
    
    item_table = Table(table_data, colWidths=[3.5 * 72, 1 * 72, 1 * 72, 1.5 * 72])
    item_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('ALIGN', (1, 0), (-1, -1), 'RIGHT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, -1), (-1, -1), colors.lightgrey),
        ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ]))
    story.append(item_table)
    
    doc.build(story)
    return temp_file_path

def generate_document_pdf(document: Document):
    """Generates a PDF for a general document (e.g., proposal, contract) from Markdown content."""
    temp_file_path = f"/tmp/document_{str(document._id)}.pdf"
    doc = SimpleDocTemplate(temp_file_path, pagesize=letter)
    styles = get_styles()
    story = []

    # Title
    story.append(Paragraph(document.title, styles['TitleStyle']))
    story.append(Spacer(1, 0.25 * 72))
    story.append(Paragraph(f"Document Type: {document.doc_type}", styles['Heading2']))
    story.append(Spacer(1, 0.25 * 72))

    # Content (Assuming content is Markdown/simple text)
    # Note: ReportLab does not natively support full Markdown. 
    # We'll convert simple paragraphs for display.
    content_lines = document.content.split('\n')
    for line in content_lines:
        if line.strip().startswith('#'):
            # Simple heading detection
            story.append(Paragraph(line.strip().lstrip('#').strip(), styles['Heading2']))
        elif line.strip():
            story.append(Paragraph(line.strip(), styles['BodyText']))
        story.append(Spacer(1, 0.1 * 72))

    doc.build(story)
    return temp_file_path
