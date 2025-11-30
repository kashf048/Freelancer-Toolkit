import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  Calendar,
  User,
  Building,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Send,
  CreditCard,
  ExternalLink,
  Copy,
  Share,
  Printer,
  Mail
} from 'lucide-react';
import toast from 'react-hot-toast';
import paymentService from '../services/paymentService';
import NewInvoiceModal from '../components/NewInvoiceModal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';

// Sample invoices data
const invoicesData = [
  {
    id: 'INV-001',
    number: 'INV-2024-001',
    client: 'TechStart Inc.',
    clientEmail: 'billing@techstart.com',
    project: 'E-commerce Website Redesign',
    amount: 25000,
    status: 'Paid',
    issueDate: '2024-02-01',
    dueDate: '2024-02-15',
    paidDate: '2024-02-10',
    description: 'Website redesign project - Phase 1 completion',
    items: [
      { description: 'UI/UX Design', quantity: 1, rate: 15000, amount: 15000 },
      { description: 'Frontend Development', quantity: 1, rate: 10000, amount: 10000 }
    ],
    paymentLink: 'https://pay.stripe.com/invoice/acct_123/inv_001'
  },
  {
    id: 'INV-002',
    number: 'INV-2024-002',
    client: 'Design Studio Pro',
    clientEmail: 'accounts@designstudio.com',
    project: 'Brand Identity Package',
    amount: 15000,
    status: 'Sent',
    issueDate: '2024-02-05',
    dueDate: '2024-02-20',
    paidDate: null,
    description: 'Brand identity design and guidelines',
    items: [
      { description: 'Logo Design', quantity: 1, rate: 8000, amount: 8000 },
      { description: 'Brand Guidelines', quantity: 1, rate: 7000, amount: 7000 }
    ],
    paymentLink: 'https://pay.stripe.com/invoice/acct_123/inv_002'
  },
  {
    id: 'INV-003',
    number: 'INV-2024-003',
    client: 'Startup Ventures',
    clientEmail: 'finance@startupventures.com',
    project: 'Mobile App Development',
    amount: 45000,
    status: 'Overdue',
    issueDate: '2024-01-15',
    dueDate: '2024-01-30',
    paidDate: null,
    description: 'Mobile app development - Milestone 1',
    items: [
      { description: 'App Architecture', quantity: 1, rate: 20000, amount: 20000 },
      { description: 'Core Features Development', quantity: 1, rate: 25000, amount: 25000 }
    ],
    paymentLink: 'https://pay.stripe.com/invoice/acct_123/inv_003'
  },
  {
    id: 'INV-004',
    number: 'INV-2024-004',
    client: 'Enterprise Corp',
    clientEmail: 'procurement@enterprise.com',
    project: 'Corporate Website',
    amount: 18000,
    status: 'Draft',
    issueDate: '2024-02-12',
    dueDate: '2024-02-27',
    paidDate: null,
    description: 'Corporate website development',
    items: [
      { description: 'Website Development', quantity: 1, rate: 18000, amount: 18000 }
    ],
    paymentLink: null
  },
  {
    id: 'INV-005',
    number: 'INV-2024-005',
    client: 'Creative Agency',
    clientEmail: 'billing@creative.com',
    project: 'Portfolio Website',
    amount: 12000,
    status: 'Sent',
    issueDate: '2024-02-08',
    dueDate: '2024-02-23',
    paidDate: null,
    description: 'Portfolio website design and development',
    items: [
      { description: 'Portfolio Design', quantity: 1, rate: 7000, amount: 7000 },
      { description: 'Development & CMS', quantity: 1, rate: 5000, amount: 5000 }
    ],
    paymentLink: 'https://pay.stripe.com/invoice/acct_123/inv_005'
  }
];

const Invoices = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);
  const [invoices, setInvoices] = useState(invoicesData);
  const [isLoading, setIsLoading] = useState(false);

  // Load invoices from localStorage on component mount
  useEffect(() => {
    const savedInvoices = localStorage.getItem('invoices');
    if (savedInvoices) {
      setInvoices(JSON.parse(savedInvoices));
    } else {
      // Save initial data to localStorage
      localStorage.setItem('invoices', JSON.stringify(invoicesData));
    }
  }, []);

  // Save invoices to localStorage whenever invoices change
  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }, [invoices]);

  // Filter invoices based on search and filters
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.project.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || invoice.status.toLowerCase() === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'sent': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'paid': return <CheckCircle className="h-3 w-3" />;
      case 'sent': return <Send className="h-3 w-3" />;
      case 'overdue': return <AlertCircle className="h-3 w-3" />;
      case 'draft': return <Edit className="h-3 w-3" />;
      default: return <FileText className="h-3 w-3" />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysOverdue = (dueDate, status) => {
    if (status !== 'Overdue') return 0;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getTotalAmount = () => {
    return filteredInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  };

  const getStatusCounts = () => {
    return {
      total: invoices.length,
      paid: invoices.filter(i => i.status === 'Paid').length,
      sent: invoices.filter(i => i.status === 'Sent').length,
      overdue: invoices.filter(i => i.status === 'Overdue').length,
      draft: invoices.filter(i => i.status === 'Draft').length
    };
  };

  const statusCounts = getStatusCounts();

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceModal(true);
  };

  const handleSaveInvoice = async (newInvoice) => {
    setInvoices(prev => [...prev, newInvoice]);
    
    // If invoice is being sent, create payment link
    if (newInvoice.status === 'Sent') {
      const paymentLinkResult = await paymentService.createPaymentLink(newInvoice);
      if (paymentLinkResult.success) {
        setInvoices(prev => 
          prev.map(inv => 
            inv.id === newInvoice.id 
              ? { ...inv, paymentLink: paymentLinkResult.paymentLink.url }
              : inv
          )
        );
      }
    }
  };

  const handleDeleteInvoice = async (invoiceId) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      setInvoices(prev => prev.filter(inv => inv.id !== invoiceId));
      toast.success('Invoice deleted successfully');
    }
  };

  const handleSendInvoice = async (invoice) => {
    setIsLoading(true);
    try {
      const emailData = {
        to: invoice.clientEmail,
        subject: `Invoice ${invoice.number} from Your Company`,
        body: `Please find attached your invoice for ${invoice.project}.`
      };

      const result = await paymentService.sendInvoice(invoice.id, emailData);
      if (result.success) {
        setInvoices(prev => 
          prev.map(inv => 
            inv.id === invoice.id 
              ? { ...inv, status: 'Sent', sentDate: new Date().toISOString() }
              : inv
          )
        );
        toast.success('Invoice sent successfully!');
      } else {
        toast.error('Failed to send invoice');
      }
    } catch (error) {
      toast.error('Failed to send invoice');
      console.error('Error sending invoice:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = async (invoice) => {
    setIsLoading(true);
    try {
      const result = await paymentService.generateInvoicePDF(invoice);
      if (result.success) {
        const link = document.createElement('a');
        link.href = result.url;
        link.download = result.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('PDF downloaded successfully!');
      } else {
        toast.error('Failed to generate PDF');
      }
    } catch (error) {
      toast.error('Failed to download PDF');
      console.error('Error downloading PDF:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPaymentLink = (paymentLink) => {
    if (paymentLink) {
      navigator.clipboard.writeText(paymentLink);
      toast.success('Payment link copied to clipboard!');
    } else {
      toast.error('No payment link available');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground">
            Create, manage, and track your invoices and payments.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button 
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            onClick={() => setShowNewInvoiceModal(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.total}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(getTotalAmount())} total value
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{statusCounts.paid}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0))}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sent</CardTitle>
            <Send className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{statusCounts.sent}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(invoices.filter(i => i.status === 'Sent').reduce((sum, i) => sum + i.amount, 0))}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{statusCounts.overdue}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(invoices.filter(i => i.status === 'Overdue').reduce((sum, i) => sum + i.amount, 0))}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft</CardTitle>
            <Edit className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{statusCounts.draft}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(invoices.filter(i => i.status === 'Draft').reduce((sum, i) => sum + i.amount, 0))}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl shadow-lg">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search invoices by number, client, or project..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50 border-border/50 focus:border-primary transition-colors"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px] bg-background/50 border-border/50">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredInvoices.length} of {invoicesData.length} invoices
        </p>
      </div>

      {/* Invoices Table */}
      <Card className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl shadow-lg">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead className="font-semibold">Invoice</TableHead>
                <TableHead className="font-semibold">Client</TableHead>
                <TableHead className="font-semibold">Project</TableHead>
                <TableHead className="font-semibold">Amount</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Due Date</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow 
                  key={invoice.id} 
                  className="border-border/50 hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/invoices/${invoice.id}`)}
                >
                  <TableCell>
                    <div>
                      <div className="font-medium">{invoice.number}</div>
                      <div className="text-sm text-muted-foreground">
                        Issued: {formatDate(invoice.issueDate)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{invoice.client}</div>
                      <div className="text-sm text-muted-foreground">{invoice.clientEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px]">
                      <div className="font-medium truncate">{invoice.project}</div>
                      <div className="text-sm text-muted-foreground truncate">{invoice.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold">{formatCurrency(invoice.amount)}</div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge className={`flex items-center gap-1 w-fit ${getStatusColor(invoice.status)}`}>
                        {getStatusIcon(invoice.status)}
                        {invoice.status}
                      </Badge>
                      {invoice.status === 'Overdue' && (
                        <div className="text-xs text-red-600">
                          {getDaysOverdue(invoice.dueDate, invoice.status)} days overdue
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className={`font-medium ${invoice.status === 'Overdue' ? 'text-red-600' : ''}`}>
                        {formatDate(invoice.dueDate)}
                      </div>
                      {invoice.paidDate && (
                        <div className="text-sm text-green-600">
                          Paid: {formatDate(invoice.paidDate)}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewInvoice(invoice)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      {invoice.paymentLink && invoice.status !== 'Paid' && (
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                          onClick={() => window.open(invoice.paymentLink, '_blank')}
                        >
                          <CreditCard className="h-3 w-3 mr-1" />
                          Pay
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Invoice
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Invoice View Modal */}
      <Dialog open={showInvoiceModal} onOpenChange={setShowInvoiceModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedInvoice && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>Invoice {selectedInvoice.number}</span>
                  <Badge className={`${getStatusColor(selectedInvoice.status)} flex items-center gap-1`}>
                    {getStatusIcon(selectedInvoice.status)}
                    {selectedInvoice.status}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  Invoice details and payment information
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Invoice Header */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Bill To:</h3>
                    <div className="space-y-1">
                      <div className="font-medium">{selectedInvoice.client}</div>
                      <div className="text-sm text-muted-foreground">{selectedInvoice.clientEmail}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-muted-foreground">Issue Date: </span>
                        <span className="font-medium">{formatDate(selectedInvoice.issueDate)}</span>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Due Date: </span>
                        <span className="font-medium">{formatDate(selectedInvoice.dueDate)}</span>
                      </div>
                      {selectedInvoice.paidDate && (
                        <div>
                          <span className="text-sm text-muted-foreground">Paid Date: </span>
                          <span className="font-medium text-green-600">{formatDate(selectedInvoice.paidDate)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Project Info */}
                <div>
                  <h3 className="font-semibold mb-2">Project:</h3>
                  <div className="font-medium">{selectedInvoice.project}</div>
                  <div className="text-sm text-muted-foreground">{selectedInvoice.description}</div>
                </div>

                {/* Invoice Items */}
                <div>
                  <h3 className="font-semibold mb-4">Invoice Items:</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Rate</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedInvoice.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.description}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.rate)}</TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(item.amount)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Total */}
                <div className="border-t pt-4">
                  <div className="flex justify-end">
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        Total: {formatCurrency(selectedInvoice.amount)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Link */}
                {selectedInvoice.paymentLink && selectedInvoice.status !== 'Paid' && (
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Payment Link</h4>
                        <p className="text-sm text-muted-foreground">
                          Click the button below to pay this invoice securely via Stripe
                        </p>
                      </div>
                      <Button
                        className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                        onClick={() => window.open(selectedInvoice.paymentLink, '_blank')}
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        Pay Now
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-between pt-4 border-t">
                  <div className="flex space-x-2">
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </Button>
                    <Button variant="outline">
                      <Printer className="mr-2 h-4 w-4" />
                      Print
                    </Button>
                    <Button variant="outline">
                      <Share className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </div>
                  <Button variant="outline" onClick={() => setShowInvoiceModal(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Empty State */}
      {filteredInvoices.length === 0 && (
        <Card className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl shadow-lg">
          <CardContent className="py-16">
            <div className="text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No invoices found</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by creating your first invoice'}
              </p>
              <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                <Plus className="mr-2 h-4 w-4" />
                Create Invoice
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* New Invoice Modal */}
      <NewInvoiceModal
        isOpen={showNewInvoiceModal}
        onClose={() => setShowNewInvoiceModal(false)}
        onSave={handleSaveInvoice}
      />
    </div>
  );
};

export default Invoices;

