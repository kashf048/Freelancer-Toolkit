import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
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
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Check,
  Upload,
  Copy,
  Share,
  Star,
  Clock,
  CheckCircle,
  X,
  FileCheck,
  FileX,
  Loader2,
  Send,
  DollarSign,
  Hash,
  Mail,
  Phone,
  MapPin,
  Globe
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Textarea } from '../components/ui/textarea';
import { ScrollArea } from '../components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [formData, setFormData] = useState({
    documentType: '',
    client: '',
    title: '',
    description: '',
    // Project Proposal fields
    projectName: '',
    projectScope: '',
    timeline: '',
    budget: '',
    deliverables: '',
    // Contract fields
    serviceDescription: '',
    paymentTerms: '',
    startDate: '',
    endDate: '',
    // Invoice fields
    invoiceNumber: '',
    amount: '',
    dueDate: '',
    items: '',
    // Quote fields
    quoteNumber: '',
    validUntil: '',
    // Report fields
    reportPeriod: '',
    summary: '',
    // Letter fields
    recipient: '',
    subject: '',
    content: ''
  });

  // Sample documents data
  const initialDocumentsData = [
    {
      id: 1,
      name: 'Project Proposal - TechStart Inc.',
      type: 'Project Proposal',
      client: 'TechStart Inc.',
      status: 'Completed',
      createdDate: '2024-02-10',
      lastModified: '2024-02-12',
      size: '2.4 MB',
      pages: 15,
      description: 'Comprehensive project proposal for e-commerce website redesign',
      tags: ['Proposal', 'Web Design', 'E-commerce'],
      content: 'This is a detailed project proposal for the e-commerce website redesign project...'
    },
    {
      id: 2,
      name: 'Contract Agreement - Design Studio',
      type: 'Contract Agreement',
      client: 'Design Studio Pro',
      status: 'Draft',
      createdDate: '2024-02-08',
      lastModified: '2024-02-09',
      size: '1.8 MB',
      pages: 8,
      description: 'Service agreement for brand identity package',
      tags: ['Contract', 'Legal', 'Branding'],
      content: 'This service agreement outlines the terms and conditions for the brand identity package...'
    },
    {
      id: 3,
      name: 'Invoice Template - Standard',
      type: 'Invoice',
      client: 'General',
      status: 'Completed',
      createdDate: '2024-01-15',
      lastModified: '2024-01-20',
      size: '0.5 MB',
      pages: 2,
      description: 'Standard invoice template for all clients',
      tags: ['Template', 'Invoice', 'Standard'],
      content: 'Standard invoice template with company branding and payment terms...'
    },
    {
      id: 4,
      name: 'Project Report - Q1 2024',
      type: 'Project Report',
      client: 'Innovation Labs',
      status: 'Completed',
      createdDate: '2024-01-30',
      lastModified: '2024-02-01',
      size: '3.2 MB',
      pages: 22,
      description: 'Quarterly project progress report',
      tags: ['Report', 'Progress', 'Q1'],
      content: 'Comprehensive quarterly report covering all project milestones and achievements...'
    },
    {
      id: 5,
      name: 'Price Quote - Mobile App',
      type: 'Price Quote',
      client: 'Local Business Hub',
      status: 'Sent',
      createdDate: '2024-02-05',
      lastModified: '2024-02-06',
      size: '1.1 MB',
      pages: 5,
      description: 'Detailed price quote for mobile app development',
      tags: ['Quote', 'Mobile', 'Development'],
      content: 'Detailed pricing breakdown for the mobile application development project...'
    },
    {
      id: 6,
      name: 'Business Letter - Partnership',
      type: 'Business Letter',
      client: 'Marketing Masters',
      status: 'Draft',
      createdDate: '2024-02-11',
      lastModified: '2024-02-11',
      size: '0.3 MB',
      pages: 1,
      description: 'Partnership proposal letter',
      tags: ['Letter', 'Partnership', 'Business'],
      content: 'Formal business letter proposing a strategic partnership opportunity...'
    }
  ];

  // Available clients
  const availableClients = [
    'TechStart Inc.',
    'Design Studio Pro',
    'Global Solutions Ltd',
    'Local Business Hub',
    'Innovation Labs',
    'Marketing Masters'
  ];

  // Document types with their form fields
  const documentTypes = [
    {
      value: 'Project Proposal',
      label: 'Project Proposal',
      fields: ['projectName', 'projectScope', 'timeline', 'budget', 'deliverables']
    },
    {
      value: 'Contract Agreement',
      label: 'Contract Agreement',
      fields: ['serviceDescription', 'paymentTerms', 'startDate', 'endDate']
    },
    {
      value: 'Invoice',
      label: 'Invoice',
      fields: ['invoiceNumber', 'amount', 'dueDate', 'items']
    },
    {
      value: 'Project Report',
      label: 'Project Report',
      fields: ['reportPeriod', 'summary']
    },
    {
      value: 'Price Quote',
      label: 'Price Quote',
      fields: ['quoteNumber', 'validUntil', 'items']
    },
    {
      value: 'Business Letter',
      label: 'Business Letter',
      fields: ['recipient', 'subject', 'content']
    }
  ];

  useEffect(() => {
    setDocuments(initialDocumentsData);
    setFilteredDocuments(initialDocumentsData);
  }, []);

  useEffect(() => {
    let filtered = documents;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(doc =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(doc => doc.type === typeFilter);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(doc => doc.status.toLowerCase() === statusFilter);
    }

    setFilteredDocuments(filtered);
  }, [documents, searchQuery, typeFilter, statusFilter]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerateDocument = async (e) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      // Simulate document generation
      await new Promise(resolve => setTimeout(resolve, 3000));

      const newDocument = {
        id: Date.now(),
        name: `${formData.documentType} - ${formData.client}`,
        type: formData.documentType,
        client: formData.client,
        status: 'Draft',
        createdDate: new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0],
        size: '1.2 MB',
        pages: Math.floor(Math.random() * 10) + 1,
        description: formData.description,
        tags: [formData.documentType.split(' ')[0], 'Generated'],
        content: `Generated ${formData.documentType} for ${formData.client}...`
      };

      setDocuments(prev => [newDocument, ...prev]);
      setIsGenerateModalOpen(false);
      setFormData({
        documentType: '',
        client: '',
        title: '',
        description: '',
        projectName: '',
        projectScope: '',
        timeline: '',
        budget: '',
        deliverables: '',
        serviceDescription: '',
        paymentTerms: '',
        startDate: '',
        endDate: '',
        invoiceNumber: '',
        amount: '',
        dueDate: '',
        items: '',
        quoteNumber: '',
        validUntil: '',
        reportPeriod: '',
        summary: '',
        recipient: '',
        subject: '',
        content: ''
      });

      toast.success('Document generated successfully!');
    } catch (error) {
      toast.error('Failed to generate document');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleViewDocument = (document) => {
    setSelectedDocument(document);
    setIsViewModalOpen(true);
  };

  const handleDownloadDocument = (document) => {
    // Simulate download
    toast.success(`Downloading ${document.name}...`);
    
    // Create a mock PDF blob and trigger download
    const element = document.createElement('a');
    const file = new Blob([`Mock PDF content for ${document.name}`], { type: 'application/pdf' });
    element.href = URL.createObjectURL(file);
    element.download = `${document.name}.pdf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDeleteDocument = (docId) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId));
    toast.success('Document deleted successfully!');
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return CheckCircle;
      case 'draft': return Edit;
      case 'sent': return Send;
      case 'approved': return Check;
      case 'rejected': return X;
      default: return Clock;
    }
  };

  const getTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'project proposal': return FileText;
      case 'contract agreement': return FileCheck;
      case 'invoice': return DollarSign;
      case 'project report': return FileText;
      case 'price quote': return Hash;
      case 'business letter': return Mail;
      default: return FileText;
    }
  };

  const getCurrentTypeFields = () => {
    const selectedType = documentTypes.find(type => type.value === formData.documentType);
    return selectedType ? selectedType.fields : [];
  };

  const renderDynamicFields = () => {
    const fields = getCurrentTypeFields();
    
    return fields.map(field => {
      switch (field) {
        case 'projectName':
          return (
            <div key={field} className="space-y-2">
              <Label htmlFor={field}>Project Name</Label>
              <Input
                id={field}
                placeholder="Enter project name"
                value={formData[field]}
                onChange={(e) => handleInputChange(field, e.target.value)}
              />
            </div>
          );
        case 'projectScope':
          return (
            <div key={field} className="space-y-2">
              <Label htmlFor={field}>Project Scope</Label>
              <Textarea
                id={field}
                placeholder="Describe the project scope and objectives"
                value={formData[field]}
                onChange={(e) => handleInputChange(field, e.target.value)}
                rows={3}
              />
            </div>
          );
        case 'timeline':
          return (
            <div key={field} className="space-y-2">
              <Label htmlFor={field}>Timeline</Label>
              <Input
                id={field}
                placeholder="e.g., 8-12 weeks"
                value={formData[field]}
                onChange={(e) => handleInputChange(field, e.target.value)}
              />
            </div>
          );
        case 'budget':
          return (
            <div key={field} className="space-y-2">
              <Label htmlFor={field}>Budget</Label>
              <Input
                id={field}
                type="number"
                placeholder="Enter budget amount"
                value={formData[field]}
                onChange={(e) => handleInputChange(field, e.target.value)}
              />
            </div>
          );
        case 'deliverables':
          return (
            <div key={field} className="space-y-2">
              <Label htmlFor={field}>Deliverables</Label>
              <Textarea
                id={field}
                placeholder="List the key deliverables"
                value={formData[field]}
                onChange={(e) => handleInputChange(field, e.target.value)}
                rows={3}
              />
            </div>
          );
        case 'serviceDescription':
          return (
            <div key={field} className="space-y-2">
              <Label htmlFor={field}>Service Description</Label>
              <Textarea
                id={field}
                placeholder="Describe the services to be provided"
                value={formData[field]}
                onChange={(e) => handleInputChange(field, e.target.value)}
                rows={3}
              />
            </div>
          );
        case 'paymentTerms':
          return (
            <div key={field} className="space-y-2">
              <Label htmlFor={field}>Payment Terms</Label>
              <Input
                id={field}
                placeholder="e.g., Net 30, 50% upfront"
                value={formData[field]}
                onChange={(e) => handleInputChange(field, e.target.value)}
              />
            </div>
          );
        case 'startDate':
          return (
            <div key={field} className="space-y-2">
              <Label htmlFor={field}>Start Date</Label>
              <Input
                id={field}
                type="date"
                value={formData[field]}
                onChange={(e) => handleInputChange(field, e.target.value)}
              />
            </div>
          );
        case 'endDate':
          return (
            <div key={field} className="space-y-2">
              <Label htmlFor={field}>End Date</Label>
              <Input
                id={field}
                type="date"
                value={formData[field]}
                onChange={(e) => handleInputChange(field, e.target.value)}
              />
            </div>
          );
        case 'invoiceNumber':
          return (
            <div key={field} className="space-y-2">
              <Label htmlFor={field}>Invoice Number</Label>
              <Input
                id={field}
                placeholder="e.g., INV-001"
                value={formData[field]}
                onChange={(e) => handleInputChange(field, e.target.value)}
              />
            </div>
          );
        case 'amount':
          return (
            <div key={field} className="space-y-2">
              <Label htmlFor={field}>Amount</Label>
              <Input
                id={field}
                type="number"
                placeholder="Enter amount"
                value={formData[field]}
                onChange={(e) => handleInputChange(field, e.target.value)}
              />
            </div>
          );
        case 'dueDate':
          return (
            <div key={field} className="space-y-2">
              <Label htmlFor={field}>Due Date</Label>
              <Input
                id={field}
                type="date"
                value={formData[field]}
                onChange={(e) => handleInputChange(field, e.target.value)}
              />
            </div>
          );
        case 'items':
          return (
            <div key={field} className="space-y-2">
              <Label htmlFor={field}>Items/Services</Label>
              <Textarea
                id={field}
                placeholder="List items or services (one per line)"
                value={formData[field]}
                onChange={(e) => handleInputChange(field, e.target.value)}
                rows={4}
              />
            </div>
          );
        case 'quoteNumber':
          return (
            <div key={field} className="space-y-2">
              <Label htmlFor={field}>Quote Number</Label>
              <Input
                id={field}
                placeholder="e.g., QUO-001"
                value={formData[field]}
                onChange={(e) => handleInputChange(field, e.target.value)}
              />
            </div>
          );
        case 'validUntil':
          return (
            <div key={field} className="space-y-2">
              <Label htmlFor={field}>Valid Until</Label>
              <Input
                id={field}
                type="date"
                value={formData[field]}
                onChange={(e) => handleInputChange(field, e.target.value)}
              />
            </div>
          );
        case 'reportPeriod':
          return (
            <div key={field} className="space-y-2">
              <Label htmlFor={field}>Report Period</Label>
              <Input
                id={field}
                placeholder="e.g., Q1 2024, January 2024"
                value={formData[field]}
                onChange={(e) => handleInputChange(field, e.target.value)}
              />
            </div>
          );
        case 'summary':
          return (
            <div key={field} className="space-y-2">
              <Label htmlFor={field}>Summary</Label>
              <Textarea
                id={field}
                placeholder="Provide a summary of the report"
                value={formData[field]}
                onChange={(e) => handleInputChange(field, e.target.value)}
                rows={4}
              />
            </div>
          );
        case 'recipient':
          return (
            <div key={field} className="space-y-2">
              <Label htmlFor={field}>Recipient</Label>
              <Input
                id={field}
                placeholder="Enter recipient name"
                value={formData[field]}
                onChange={(e) => handleInputChange(field, e.target.value)}
              />
            </div>
          );
        case 'subject':
          return (
            <div key={field} className="space-y-2">
              <Label htmlFor={field}>Subject</Label>
              <Input
                id={field}
                placeholder="Enter letter subject"
                value={formData[field]}
                onChange={(e) => handleInputChange(field, e.target.value)}
              />
            </div>
          );
        case 'content':
          return (
            <div key={field} className="space-y-2">
              <Label htmlFor={field}>Content</Label>
              <Textarea
                id={field}
                placeholder="Enter letter content"
                value={formData[field]}
                onChange={(e) => handleInputChange(field, e.target.value)}
                rows={6}
              />
            </div>
          );
        default:
          return null;
      }
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">
            Generate and manage your business documents
          </p>
        </div>
        <Button 
          onClick={() => setIsGenerateModalOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Generate Document
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Documents</p>
                <p className="text-2xl font-bold">{documents.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">
                  {documents.filter(d => d.status === 'Completed').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Drafts</p>
                <p className="text-2xl font-bold">
                  {documents.filter(d => d.status === 'Draft').length}
                </p>
              </div>
              <Edit className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">
                  {documents.filter(d => new Date(d.createdDate).getMonth() === new Date().getMonth()).length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
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
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {documentTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Documents Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filteredDocuments.map((document, index) => {
            const StatusIcon = getStatusIcon(document.status);
            const TypeIcon = getTypeIcon(document.type);
            return (
              <motion.div
                key={document.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 group">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-blue-100">
                          <TypeIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg line-clamp-2">{document.name}</h3>
                          <p className="text-sm text-gray-500">{document.client}</p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDocument(document)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Document
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownloadDocument(document)}>
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Document
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share className="mr-2 h-4 w-4" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteDocument(document.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Status and Type */}
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(document.status)}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {document.status}
                      </Badge>
                      <Badge variant="secondary">
                        {document.type}
                      </Badge>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {document.description}
                    </p>

                    {/* Document Info */}
                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex justify-between">
                        <span>Size</span>
                        <span>{document.size}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pages</span>
                        <span>{document.pages}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Modified</span>
                        <span>{new Date(document.lastModified).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    {document.tags && document.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {document.tags.slice(0, 3).map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {document.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{document.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleViewDocument(document)}
                      >
                        <Eye className="mr-1 h-4 w-4" />
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleDownloadDocument(document)}
                      >
                        <Download className="mr-1 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredDocuments.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No documents found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || typeFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your filters or search query.'
                : 'Get started by generating your first document.'}
            </p>
            {!searchQuery && typeFilter === 'all' && statusFilter === 'all' && (
              <Button onClick={() => setIsGenerateModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Generate Your First Document
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Generate Document Modal */}
      <Dialog open={isGenerateModalOpen} onOpenChange={setIsGenerateModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Generate New Document</DialogTitle>
            <DialogDescription>
              Choose a document type and fill in the details to generate a professional document.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-4">
            <form onSubmit={handleGenerateDocument} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="documentType">Document Type *</Label>
                    <Select 
                      value={formData.documentType} 
                      onValueChange={(value) => handleInputChange('documentType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose document type" />
                      </SelectTrigger>
                      <SelectContent>
                        {documentTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client">Client *</Label>
                    <Select value={formData.client} onValueChange={(value) => handleInputChange('client', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a client" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableClients.map((client) => (
                          <SelectItem key={client} value={client}>{client}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="title">Document Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter document title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Brief description of the document"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Fields Based on Document Type */}
              {formData.documentType && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">{formData.documentType} Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {renderDynamicFields()}
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-4">
                <Button 
                  type="submit" 
                  className="flex-1" 
                  disabled={isGenerating || !formData.documentType || !formData.client}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Document
                    </>
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsGenerateModalOpen(false)}
                  disabled={isGenerating}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* View Document Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[100vh]">
          <DialogHeader>
            <DialogTitle>{selectedDocument?.name}</DialogTitle>
            <DialogDescription>
              Document preview and details
            </DialogDescription>
          </DialogHeader>
          {selectedDocument && (
            <div className="space-y-6">
              {/* Document Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-500">Type</p>
                  <p className="text-sm">{selectedDocument.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Client</p>
                  <p className="text-sm">{selectedDocument.client}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <Badge className={getStatusColor(selectedDocument.status)}>
                    {selectedDocument.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Pages</p>
                  <p className="text-sm">{selectedDocument.pages}</p>
                </div>
              </div>

              {/* Document Content Preview */}
              <div className="border rounded-lg p-6 bg-white min-h-[200px]">
                <h3 className="text-lg font-semibold mb-4">Document Preview</h3>
                <div className="prose max-w-none">
                  <p className="text-gray-600 leading-relaxed">
                    {selectedDocument.content}
                  </p>
                  <div className="mt-6 p-4 bg-gray-50 rounded border-l-4 border-blue-500 ">
                    <p className="text-sm text-gray-600">
                      This is a preview of the document content. The actual document contains 
                      formatted text, styling, and professional layout optimized for printing and sharing.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button 
                  onClick={() => handleDownloadDocument(selectedDocument)}
                  className="flex-1"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
                <Button variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button variant="outline">
                  <Share className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default Documents;
