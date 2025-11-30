import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import toast from 'react-hot-toast';

// Mock payment data
const mockPayments = [
  {
    id: 1,
    type: 'income',
    description: 'Website Development - TechStart Inc.',
    amount: 5500,
    status: 'completed',
    date: '2024-01-15',
    method: 'Bank Transfer',
    reference: 'INV-2024-001',
    client: 'TechStart Inc.',
    category: 'Web Development'
  },
  {
    id: 2,
    type: 'expense',
    description: 'Adobe Creative Suite Subscription',
    amount: 52.99,
    status: 'completed',
    date: '2024-01-14',
    method: 'Credit Card',
    reference: 'SUB-2024-001',
    client: null,
    category: 'Software'
  },
  {
    id: 3,
    type: 'income',
    description: 'Brand Identity Package - Design Studio Pro',
    amount: 2750,
    status: 'pending',
    date: '2024-01-20',
    method: 'PayPal',
    reference: 'INV-2024-002',
    client: 'Design Studio Pro',
    category: 'Design'
  },
  {
    id: 4,
    type: 'expense',
    description: 'Domain Registration - example.com',
    amount: 15.99,
    status: 'completed',
    date: '2024-01-12',
    method: 'Credit Card',
    reference: 'DOM-2024-001',
    client: null,
    category: 'Hosting'
  },
  {
    id: 5,
    type: 'income',
    description: 'Mobile App Development - Startup Ventures',
    amount: 4620,
    status: 'overdue',
    date: '2023-12-15',
    method: 'Bank Transfer',
    reference: 'INV-2023-015',
    client: 'Startup Ventures',
    category: 'Mobile Development'
  },
  {
    id: 6,
    type: 'expense',
    description: 'Office Supplies - Staples',
    amount: 127.45,
    status: 'completed',
    date: '2024-01-10',
    method: 'Credit Card',
    reference: 'EXP-2024-003',
    client: null,
    category: 'Office'
  },
  {
    id: 7,
    type: 'income',
    description: 'SEO Consultation - Local Business',
    amount: 850,
    status: 'completed',
    date: '2024-01-08',
    method: 'PayPal',
    reference: 'INV-2024-003',
    client: 'Local Business',
    category: 'Consulting'
  },
  {
    id: 8,
    type: 'expense',
    description: 'Cloud Hosting - AWS',
    amount: 89.32,
    status: 'completed',
    date: '2024-01-05',
    method: 'Credit Card',
    reference: 'AWS-2024-001',
    client: null,
    category: 'Hosting'
  }
];
const Payments = () => {
  const [payments, setPayments] = useState(mockPayments);
  const [filteredPayments, setFilteredPayments] = useState(mockPayments);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'income',
    description: '',
    amount: '',
    method: 'Bank Transfer',
    reference: '',
    client: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    let filtered = payments;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(payment =>
        payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (payment.client && payment.client.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(payment => payment.type === typeFilter);
    }

    setFilteredPayments(filtered);
  }, [payments, searchTerm, statusFilter, typeFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'failed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
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
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate statistics
  const totalIncome = payments
    .filter(p => p.type === 'income' && p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalExpenses = payments
    .filter(p => p.type === 'expense' && p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingIncome = payments
    .filter(p => p.type === 'income' && p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const overdueAmount = payments
    .filter(p => p.type === 'income' && p.status === 'overdue')
    .reduce((sum, p) => sum + p.amount, 0);

  const netIncome = totalIncome - totalExpenses;

  const handleExport = () => {
    toast.success('Payment data exported successfully!');
    // In a real app, this would generate and download a CSV/Excel file
  };

  const handleViewPayment = (payment) => {
    setSelectedPayment(payment);
  };

  const handleAddPayment = (e) => {
    e.preventDefault();
    
    const newPayment = {
      id: payments.length + 1,
      type: formData.type,
      description: formData.description,
      amount: parseFloat(formData.amount),
      status: 'completed',
      date: formData.date,
      method: formData.method,
      reference: formData.reference || `REF-${Date.now()}`,
      client: formData.client || null,
      category: formData.category
    };

    setPayments(prev => [newPayment, ...prev]);
    setIsAddPaymentModalOpen(false);
    setFormData({
      type: 'income',
      description: '',
      amount: '',
      method: 'Bank Transfer',
      reference: '',
      client: '',
      category: '',
      date: new Date().toISOString().split('T')[0]
    });
    
    toast.success('Payment added successfully!');
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
        <div className="h-96 bg-gray-200 rounded animate-pulse"></div>
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground">Track payments and financial transactions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleExport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setIsAddPaymentModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Payment
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Income</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <ArrowUpRight className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <ArrowDownRight className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Net Income</p>
                <p className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(netIncome)}
                </p>
              </div>
              <div className={`p-2 rounded-lg ${netIncome >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                <DollarSign className={`h-6 w-6 ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{formatCurrency(pendingIncome)}</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            A list of all your recent payments and expenses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {payment.type === 'income' ? (
                        <ArrowUpRight className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-600" />
                      )}
                      <span className="capitalize font-medium">{payment.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{payment.description}</p>
                      {payment.client && (
                        <p className="text-sm text-gray-500">{payment.client}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`font-semibold ${
                      payment.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {payment.type === 'income' ? '+' : '-'}{formatCurrency(payment.amount)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(payment.status)} flex items-center gap-1 w-fit`}>
                      {getStatusIcon(payment.status)}
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {formatDate(payment.date)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-gray-400" />
                      {payment.method}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewPayment(payment)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download Receipt
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredPayments.length === 0 && (
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No payments found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Detail Modal */}
      <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>
              Detailed information about this transaction
            </DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Type</span>
                <div className="flex items-center gap-2">
                  {selectedPayment.type === 'income' ? (
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-600" />
                  )}
                  <span className="capitalize font-medium">{selectedPayment.type}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Amount</span>
                <span className={`font-semibold ${
                  selectedPayment.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {selectedPayment.type === 'income' ? '+' : '-'}{formatCurrency(selectedPayment.amount)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Status</span>
                <Badge className={`${getStatusColor(selectedPayment.status)} flex items-center gap-1`}>
                  {getStatusIcon(selectedPayment.status)}
                  {selectedPayment.status.charAt(0).toUpperCase() + selectedPayment.status.slice(1)}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Date</span>
                <span>{formatDate(selectedPayment.date)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Method</span>
                <span>{selectedPayment.method}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Reference</span>
                <span className="font-mono text-sm">{selectedPayment.reference}</span>
              </div>
              
              {selectedPayment.client && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Client</span>
                  <span>{selectedPayment.client}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Category</span>
                <span>{selectedPayment.category}</span>
              </div>
              
              <div className="pt-4 border-t">
                <span className="text-sm font-medium text-gray-500">Description</span>
                <p className="mt-1 text-sm">{selectedPayment.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Payment Modal */}
      <Dialog open={isAddPaymentModalOpen} onOpenChange={setIsAddPaymentModalOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Add New Payment</DialogTitle>
            <DialogDescription>
              Record a new payment transaction (income or expense).
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddPayment} className="space-y-4">
            <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
              <div className="space-y-2">
                <label htmlFor="type" className="text-sm font-medium">Type *</label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Description *</label>
                <Input
                  id="description"
                  placeholder="Payment description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="amount" className="text-sm font-medium">Amount *</label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="method" className="text-sm font-medium">Payment Method</label>
                <Select value={formData.method} onValueChange={(value) => handleInputChange('method', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                    <SelectItem value="PayPal">PayPal</SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Check">Check</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="date" className="text-sm font-medium">Date *</label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="reference" className="text-sm font-medium">Reference</label>
                <Input
                  id="reference"
                  placeholder="Invoice number, receipt, etc."
                  value={formData.reference}
                  onChange={(e) => handleInputChange('reference', e.target.value)}
                />
              </div>
              
              {formData.type === 'income' && (
                <div className="space-y-2">
                  <label htmlFor="client" className="text-sm font-medium">Client</label>
                  <Input
                    id="client"
                    placeholder="Client name"
                    value={formData.client}
                    onChange={(e) => handleInputChange('client', e.target.value)}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">Category</label>
                <Input
                  id="category"
                  placeholder="e.g., Web Development, Software, etc."
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-3 pt-4 border-t">
              <Button type="submit" className="flex-1">
                <Plus className="mr-2 h-4 w-4" />
                Add Payment
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsAddPaymentModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default Payments;

