// For now, we'll skip OpenAI integration and use mock data
// import OpenAI from 'openai';

// Initialize OpenAI client (commented out for now)
// const openai = new OpenAI({
//   apiKey: process.env.REACT_APP_OPENAI_API_KEY || 'your-openai-api-key',
//   dangerouslyAllowBrowser: true // Note: In production, API calls should be made from backend
// });

// Document templates for different types
const documentTemplates = {
  proposal: {
    sections: [
      'Executive Summary',
      'Project Overview',
      'Scope of Work',
      'Timeline and Milestones',
      'Team and Resources',
      'Budget and Pricing',
      'Terms and Conditions',
      'Next Steps'
    ],
    systemPrompt: 'You are a professional business consultant creating a comprehensive project proposal. Write in a professional, persuasive tone that demonstrates expertise and builds client confidence.'
  },
  contract: {
    sections: [
      'Agreement Overview',
      'Scope of Services',
      'Payment Terms',
      'Timeline and Deliverables',
      'Intellectual Property Rights',
      'Termination Clause',
      'Liability and Warranties',
      'Signatures'
    ],
    systemPrompt: 'You are a legal professional creating a service contract. Use clear, precise language with appropriate legal terminology while remaining accessible to business clients.'
  },
  invoice: {
    sections: [
      'Invoice Details',
      'Service Description',
      'Itemized Charges',
      'Payment Information',
      'Terms and Conditions'
    ],
    systemPrompt: 'You are creating a professional invoice. Be clear, concise, and include all necessary business and payment information.'
  },
  report: {
    sections: [
      'Executive Summary',
      'Project Status',
      'Accomplishments',
      'Challenges and Solutions',
      'Metrics and Analytics',
      'Next Steps',
      'Recommendations'
    ],
    systemPrompt: 'You are a project manager creating a comprehensive project report. Use data-driven insights and professional reporting standards.'
  },
  letter: {
    sections: [
      'Header and Date',
      'Recipient Information',
      'Subject Line',
      'Opening',
      'Main Content',
      'Closing',
      'Signature'
    ],
    systemPrompt: 'You are writing a professional business letter. Use formal business letter format with appropriate tone and structure.'
  },
  quote: {
    sections: [
      'Quote Overview',
      'Service Description',
      'Detailed Pricing',
      'Terms and Conditions',
      'Validity Period',
      'Contact Information'
    ],
    systemPrompt: 'You are creating a professional price quote. Be detailed, transparent, and persuasive while maintaining competitive positioning.'
  }
};

export const documentService = {
  // Generate AI content for documents
  async generateContent(documentType, formData) {
    try {
      const template = documentTemplates[documentType];
      if (!template) {
        throw new Error(`Unknown document type: ${documentType}`);
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // For now, use mock content generation
      const content = this.generateMockContent(documentType, formData);

      return {
        success: true,
        content: content,
        sections: template.sections
      };
    } catch (error) {
      console.error('Error generating AI content:', error);
      
      // Fallback to mock content if API fails
      return {
        success: false,
        content: this.generateMockContent(documentType, formData),
        sections: documentTemplates[documentType]?.sections || [],
        error: error.message
      };
    }
  },

  // Generate mock content as fallback
  generateMockContent(documentType, formData) {
    const { title, client, description } = formData;
    
    switch (documentType) {
      case 'proposal':
        return `# Project Proposal: ${title}

## Executive Summary
This proposal outlines a comprehensive solution for ${client}'s project requirements. ${description}

## Project Overview
Our team will deliver a high-quality solution that meets your business objectives and exceeds expectations.

## Scope of Work
- Initial consultation and requirements gathering
- Design and development phase
- Testing and quality assurance
- Deployment and launch support

## Timeline and Milestones
The project is estimated to take 8-12 weeks from start to finish, with regular milestone reviews and client feedback sessions.

## Team and Resources
Our experienced team includes:
- Project Manager
- Lead Developer
- UI/UX Designer
- Quality Assurance Specialist

## Budget and Pricing
**Total Project Cost: $25,000**
- Phase 1 (Planning): $5,000
- Phase 2 (Development): $15,000
- Phase 3 (Testing & Launch): $5,000

## Terms and Conditions
- 50% deposit required to begin work
- Monthly progress reviews
- 30-day warranty period

## Next Steps
Upon approval of this proposal, we will:
1. Schedule a kick-off meeting
2. Begin the discovery phase
3. Provide weekly progress updates`;

      case 'contract':
        return `# Service Agreement

**Client:** ${client}
**Service Provider:** Your Company Name
**Project:** ${title}

## Agreement Overview
This agreement outlines the terms and conditions for ${description}.

## Scope of Services
The service provider agrees to deliver the following services:
- [List specific services]
- [Timeline requirements]
- [Quality standards]

## Payment Terms
- Total contract value: [Amount]
- Payment schedule: [Schedule]
- Late payment fees: 1.5% per month

## Timeline and Deliverables
Project timeline: [Start date] to [End date]
Key deliverables and milestones will be agreed upon separately.

## Intellectual Property Rights
All work created under this agreement remains the property of the client upon full payment.

## Termination Clause
Either party may terminate this agreement with 30 days written notice.

## Liability and Warranties
Service provider warrants that all work will be performed in a professional manner.

## Signatures
Client: _________________ Date: _________
Service Provider: _________________ Date: _________`;

      default:
        return `# ${title}

**Client:** ${client}
**Description:** ${description}

## Content
This document has been generated based on your requirements. Please review and edit as needed.

## Additional Information
[Add any additional information or sections as required]

## Conclusion
Thank you for your business. Please don't hesitate to contact us if you have any questions.`;
    }
  },

  // Generate PDF from content
  async generatePDF(documentData) {
    try {
      // In a real implementation, you would use a PDF generation library
      // For now, we'll simulate PDF generation
      const { title, content, client } = documentData;
      
      // Create a blob with the content (simplified PDF simulation)
      const pdfContent = `
PDF Document: ${title}
Client: ${client}
Generated: ${new Date().toLocaleDateString()}

${content}
      `;
      
      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      return {
        success: true,
        url,
        filename: `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`
      };
    } catch (error) {
      console.error('Error generating PDF:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Save document to backend
  async saveDocument(documentData) {
    try {
      // In a real implementation, this would save to your backend
      const savedDocument = {
        id: Date.now(),
        ...documentData,
        createdDate: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        status: 'Draft'
      };
      
      // Simulate saving to localStorage for demo
      const existingDocs = JSON.parse(localStorage.getItem('documents') || '[]');
      existingDocs.push(savedDocument);
      localStorage.setItem('documents', JSON.stringify(existingDocs));
      
      return {
        success: true,
        document: savedDocument
      };
    } catch (error) {
      console.error('Error saving document:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get all documents
  async getDocuments() {
    try {
      const documents = JSON.parse(localStorage.getItem('documents') || '[]');
      return {
        success: true,
        documents
      };
    } catch (error) {
      console.error('Error fetching documents:', error);
      return {
        success: false,
        documents: [],
        error: error.message
      };
    }
  }
};

export default documentService;

