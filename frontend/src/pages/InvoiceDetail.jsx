import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Send, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Calendar,
  DollarSign,
  FileText,
  User,
  Building
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import toast from 'react-hot-toast';

// Mock invoice data
const mockInvoices = {
  1: {
    id: 1,
    invoiceNumber: 'INV-2024-001',
    clientName: 'TechStart Inc.',
    clientEmail: 'contact@techstart.com',
    clientCompany: 'TechStart Inc.',
    clientAddress: '123 Tech Street, Silicon Valley, CA 94000',
    status: 'paid',
    issueDate: '2024-01-15',
    dueDate: '2024-02-15',
    paidDate: '2024-02-10',
    subtotal: 5000,
    tax: 500,
    total: 5500,
    currency: 'USD',
    notes: 'Thank you for your business!',
    paymentTerms: 'Net 30',
    lineItems: [
      {
        id: 1,
        description: 'Website Design & Development',
        quantity: 1,
        rate: 3000,
        amount: 3000
      },
      {
        id: 2,
        description: 'SEO Optimization',
        quantity: 20,
        rate: 75,
        amount: 1500
      },
      {
        id: 3,
        description: 'Content Management System Setup',
        quantity: 1,
        rate: 500,
        amount: 500
      }
    ]
  },
  2: {
    id: 2,
    invoiceNumber: 'INV-2024-002',
    clientName: 'Design Studio Pro',
    clientEmail: 'hello@designstudio.com',
    clientCompany: 'Design Studio Pro',
    clientAddress: '456 Creative Ave, New York, NY 10001',
    status: 'unpaid',
    issueDate: '2024-01-20',
    dueDate: '2024-02-20',
    paidDate: null,
    subtotal: 2500,
    tax: 250,
    total: 2750,
    currency: 'USD',
    notes: 'Payment due within 30 days.',
    paymentTerms: 'Net 30',
    lineItems: [
      {
        id: 1,
        description: 'Brand Identity Design',
        quantity: 1,
        rate: 2000,
        amount: 2000
      },
      {
        id: 2,
        description: 'Logo Design Revisions',
        quantity: 5,
        rate: 100,
        amount: 500
      }
    ]
  },
  3: {
    id: 3,
    invoiceNumber: 'INV-2024-003',
    clientName: 'Startup Ventures',
    clientEmail: 'info@startupventures.com',
    clientCompany: 'Startup Ventures LLC',
    clientAddress: '789 Innovation Blvd, Austin, TX 78701',
    status: 'overdue',
    issueDate: '2023-12-15',
    dueDate: '2024-01-15',
    paidDate: null,
    subtotal: 4200,
    tax: 420,
    total: 4620,
    currency: 'USD',
    notes: 'This invoice is overdue. Please remit payment immediately.',
    paymentTerms: 'Net 30',
    lineItems: [
      {
        id: 1,
        description: 'Mobile App Development',
        quantity: 1,
        rate: 3500,
        amount: 3500
      },
      {
        id: 2,
        description: 'App Store Submission',
        quantity: 2,
        rate: 200,
        amount: 400
      },
      {
        id: 3,
        description: 'Testing & QA',
        quantity: 1,
        rate: 300,
        amount: 300
      }
    ]
  }
};

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPDFViewer, setShowPDFViewer] = useState(false);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const invoiceData = mockInvoices[id];
      setInvoice(invoiceData);
      setIsLoading(false);
    }, 500);
  }, [id]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'unpaid':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4" />;
      case 'unpaid':
        return <Clock className="h-4 w-4" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const handleDownload = () => {
    toast.success('Invoice PDF downloaded successfully!');
    // In a real app, this would generate and download a PDF
  };

  const handleView = () => {
    setShowPDFViewer(true);
  };

  const handleSend = () => {
    toast.success('Invoice sent to client successfully!');
    // In a real app, this would send the invoice via email
  };

  const handleEdit = () => {
    toast.info('Edit functionality would open invoice editor');
    // In a real app, this would navigate to edit page or open modal
  };

  const handleDelete = () => {
    toast.success('Invoice deleted successfully!');
    navigate('/invoices');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid gap-6">
          <div className="h-96 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/invoices')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Invoices
          </Button>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-96">
            <div className="text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Invoice Not Found</h3>
              <p className="text-gray-500">The invoice you're looking for doesn't exist.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/invoices')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Invoices
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{invoice.invoiceNumber}</h1>
            <p className="text-muted-foreground">Invoice details and line items</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge className={`${getStatusColor(invoice.status)} flex items-center gap-1`}>
            {getStatusIcon(invoice.status)}
            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
          </Badge>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Button onClick={handleView} variant="outline">
          <Eye className="h-4 w-4 mr-2" />
          View PDF
        </Button>
        <Button onClick={handleDownload} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        {invoice.status !== 'paid' && (
          <Button onClick={handleSend} variant="outline">
            <Send className="h-4 w-4 mr-2" />
            Send to Client
          </Button>
        )}
        <Button onClick={handleEdit} variant="outline">
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Invoice</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this invoice? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Invoice Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Invoice Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Invoice Number</label>
                  <p className="text-lg font-semibold">{invoice.invoiceNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">
                    <Badge className={`${getStatusColor(invoice.status)} flex items-center gap-1 w-fit`}>
                      {getStatusIcon(invoice.status)}
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Issue Date</label>
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {formatDate(invoice.issueDate)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Due Date</label>
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {formatDate(invoice.dueDate)}
                  </p>
                </div>
                {invoice.paidDate && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Paid Date</label>
                    <p className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {formatDate(invoice.paidDate)}
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-500">Payment Terms</label>
                  <p>{invoice.paymentTerms}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Client Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Client Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Client Name</label>
                  <p className="font-semibold">{invoice.clientName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p>{invoice.clientEmail}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500">Company</label>
                  <p className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-400" />
                    {invoice.clientCompany}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500">Address</label>
                  <p className="text-gray-700">{invoice.clientAddress}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card>
            <CardHeader>
              <CardTitle>Line Items</CardTitle>
              <CardDescription>Detailed breakdown of services and costs</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-center">Qty</TableHead>
                    <TableHead className="text-right">Rate</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.lineItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.description}</TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.rate)}</TableCell>
                      <TableCell className="text-right font-semibold">{formatCurrency(item.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Notes */}
          {invoice.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{invoice.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Total Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Total Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>{formatCurrency(invoice.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax:</span>
                  <span>{formatCurrency(invoice.tax)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>{formatCurrency(invoice.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button onClick={handleView} className="w-full" variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview Invoice
              </Button>
              <Button onClick={handleDownload} className="w-full" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              {invoice.status !== 'paid' && (
                <Button onClick={handleSend} className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Send to Client
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* PDF Viewer Modal */}
      <Dialog open={showPDFViewer} onOpenChange={setShowPDFViewer}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>Invoice Preview - {invoice.invoiceNumber}</DialogTitle>
            <DialogDescription>
              Preview of the invoice PDF document
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">PDF Preview</h3>
              <p className="text-gray-500 mb-4">Invoice PDF would be displayed here</p>
              <Button onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default InvoiceDetail;

