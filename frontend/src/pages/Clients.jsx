import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  DollarSign,
  FileText,
  Users,
  Star,
  StarOff,
  Edit,
  Trash2,
  Eye,
  Globe,
  Check
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import toast from 'react-hot-toast';

const Clients = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    location: '',
    website: '',
    status: 'Active',
    priority: 'Medium',
    notes: ''
  });

  // Sample client data
  const initialClientsData = [
    {
      id: 1,
      name: 'TechStart Inc.',
      email: 'contact@techstart.com',
      phone: '+1 (555) 123-4567',
      company: 'TechStart Inc.',
      location: 'San Francisco, CA',
      website: 'www.techstart.com',
      status: 'Active',
      priority: 'High',
      totalRevenue: 45000,
      activeProjects: 3,
      totalProjects: 8,
      joinDate: '2023-01-15',
      lastContact: '2024-02-10',
      avatar: null,
      initials: 'TS',
      tags: ['Enterprise', 'Tech'],
      notes: 'Key client with multiple ongoing projects'
    },
    {
      id: 2,
      name: 'Design Studio Pro',
      email: 'hello@designstudio.com',
      phone: '+1 (555) 987-6543',
      company: 'Design Studio Pro',
      location: 'New York, NY',
      website: 'www.designstudio.com',
      status: 'Active',
      priority: 'Medium',
      totalRevenue: 28500,
      activeProjects: 2,
      totalProjects: 5,
      joinDate: '2023-03-22',
      lastContact: '2024-02-08',
      avatar: null,
      initials: 'DS',
      tags: ['Design', 'Creative'],
      notes: 'Creative agency focused on branding'
    },
    {
      id: 3,
      name: 'Global Solutions Ltd',
      email: 'info@globalsolutions.com',
      phone: '+1 (555) 456-7890',
      company: 'Global Solutions Ltd',
      location: 'Chicago, IL',
      website: 'www.globalsolutions.com',
      status: 'Inactive',
      priority: 'Low',
      totalRevenue: 15000,
      activeProjects: 0,
      totalProjects: 3,
      joinDate: '2022-11-10',
      lastContact: '2023-12-15',
      avatar: null,
      initials: 'GS',
      tags: ['Consulting'],
      notes: 'Former client, potential for reactivation'
    },
    {
      id: 4,
      name: 'Local Business Hub',
      email: 'admin@localbusiness.com',
      phone: '+1 (555) 321-0987',
      company: 'Local Business Hub',
      location: 'Austin, TX',
      website: 'www.localbusiness.com',
      status: 'Active',
      priority: 'Medium',
      totalRevenue: 22000,
      activeProjects: 1,
      totalProjects: 4,
      joinDate: '2023-06-08',
      lastContact: '2024-02-05',
      avatar: null,
      initials: 'LB',
      tags: ['Small Business', 'Local'],
      notes: 'Growing local business with expansion plans'
    },
    {
      id: 5,
      name: 'Innovation Labs',
      email: 'team@innovationlabs.com',
      phone: '+1 (555) 654-3210',
      company: 'Innovation Labs',
      location: 'Seattle, WA',
      website: 'www.innovationlabs.com',
      status: 'Active',
      priority: 'High',
      totalRevenue: 67000,
      activeProjects: 4,
      totalProjects: 7,
      joinDate: '2022-09-12',
      lastContact: '2024-02-12',
      avatar: null,
      initials: 'IL',
      tags: ['Tech', 'Innovation', 'Startup'],
      notes: 'High-value client with cutting-edge projects'
    },
    {
      id: 6,
      name: 'Marketing Masters',
      email: 'contact@marketingmasters.com',
      phone: '+1 (555) 789-0123',
      company: 'Marketing Masters',
      location: 'Miami, FL',
      website: 'www.marketingmasters.com',
      status: 'Active',
      priority: 'Medium',
      totalRevenue: 31500,
      activeProjects: 2,
      totalProjects: 6,
      joinDate: '2023-04-18',
      lastContact: '2024-02-07',
      avatar: null,
      initials: 'MM',
      tags: ['Marketing', 'Digital'],
      notes: 'Digital marketing agency with regular projects'
    }
  ];

  useEffect(() => {
    setClients(initialClientsData);
    setFilteredClients(initialClientsData);
  }, []);

  useEffect(() => {
    let filtered = clients;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(client => client.status.toLowerCase() === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(client => client.priority.toLowerCase() === priorityFilter);
    }

    setFilteredClients(filtered);
  }, [clients, searchQuery, statusFilter, priorityFilter]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddClient = (e) => {
    e.preventDefault();
    
    // Generate initials from name
    const nameParts = formData.name.split(' ');
    const initials = nameParts.map(part => part[0]).join('').toUpperCase().slice(0, 2);
    
    const newClient = {
      id: Date.now(),
      ...formData,
      initials,
      totalRevenue: 0,
      activeProjects: 0,
      totalProjects: 0,
      joinDate: new Date().toISOString().split('T')[0],
      lastContact: new Date().toISOString().split('T')[0],
      avatar: null,
      tags: []
    };

    setClients(prev => [newClient, ...prev]);
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      location: '',
      website: '',
      status: 'Active',
      priority: 'Medium',
      notes: ''
    });
    
    toast.success('Client added successfully!');
  };

  const handleDeleteClient = (clientId) => {
    setClients(prev => prev.filter(client => client.id !== clientId));
    toast.success('Client deleted successfully!');
  };

  const handleToggleFavorite = (clientId) => {
    setClients(prev => prev.map(client => 
      client.id === clientId 
        ? { ...client, isFavorite: !client.isFavorite }
        : client
    ));
    toast.success('Client updated!');
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">
            Manage your client relationships and contacts
          </p>
        </div>
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Clients</p>
                <p className="text-2xl font-bold">{clients.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Clients</p>
                <p className="text-2xl font-bold">
                  {clients.filter(c => c.status === 'Active').length}
                </p>
              </div>
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">
                  ${clients.reduce((sum, client) => sum + client.totalRevenue, 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                <p className="text-2xl font-bold">
                  {clients.reduce((sum, client) => sum + client.activeProjects, 0)}
                </p>
              </div>
              <FileText className="h-8 w-8 text-purple-600" />
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
                  placeholder="Search clients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Clients Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filteredClients.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className="hover:shadow-lg transition-all duration-300 group cursor-pointer"
                onClick={() => navigate(`/clients/${client.id}`)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={client.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-semibold">
                          {client.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">{client.name}</h3>
                        <p className="text-sm text-gray-500">{client.company}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/clients/${client.id}`} className="flex items-center">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Client
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(client.id);
                        }}>
                          {client.isFavorite ? (
                            <>
                              <StarOff className="mr-2 h-4 w-4" />
                              Remove from Favorites
                            </>
                          ) : (
                            <>
                              <Star className="mr-2 h-4 w-4" />
                              Add to Favorites
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClient(client.id);
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Client
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Status and Priority */}
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(client.status)}>
                      {client.status}
                    </Badge>
                    <Badge className={getPriorityColor(client.priority)}>
                      {client.priority} Priority
                    </Badge>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="mr-2 h-4 w-4" />
                      {client.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="mr-2 h-4 w-4" />
                      {client.phone}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="mr-2 h-4 w-4" />
                      {client.location}
                    </div>
                    {client.website && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Globe className="mr-2 h-4 w-4" />
                        {client.website}
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <p className="text-lg font-semibold text-green-600">
                        ${client.totalRevenue.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">Revenue</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-blue-600">
                        {client.activeProjects}
                      </p>
                      <p className="text-xs text-gray-500">Active</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-purple-600">
                        {client.totalProjects}
                      </p>
                      <p className="text-xs text-gray-500">Total</p>
                    </div>
                  </div>

                  {/* Tags */}
                  {client.tags && client.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {client.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredClients.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No clients found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'Try adjusting your filters or search query.'
                : 'Get started by adding your first client.'}
            </p>
            {!searchQuery && statusFilter === 'all' && priorityFilter === 'all' && (
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Client
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Add Client Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>
              Create a new client profile with contact information and preferences.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddClient} className="space-y-4">
            <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter client's full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="client@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    placeholder="Company name"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="City, State/Country"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    placeholder="www.example.com"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes about the client..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button type="submit" className="flex-1">
                <Plus className="mr-2 h-4 w-4" />
                Add Client
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default Clients;