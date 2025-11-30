import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  DollarSign,
  Users,
  FileText,
  TrendingUp,
  Calendar,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  FolderOpen,
  X
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import toast from 'react-hot-toast';

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2000, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [end, duration]);

  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
};

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [projectStatusData, setProjectStatusData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [activeModal, setActiveModal] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Mock data since API might not be available
      const totalRevenue = 45000;
      const totalExpenses = 12000;
      const pendingInvoices = 8;
      const activeClients = 24;
      const activeProjects = 12;

      setStats([
        {
          title: 'Total Revenue',
          value: totalRevenue,
          prefix: '$',
          change: '+12.5%',
          changeType: 'positive',
          description: 'From last month',
          icon: DollarSign,
          color: 'text-green-600'
        },
        {
          title: 'Active Clients',
          value: activeClients,
          change: '+3',
          changeType: 'positive',
          description: 'New this month',
          icon: Users,
          color: 'text-blue-600'
        },
        {
          title: 'Active Projects',
          value: activeProjects,
          change: '+2',
          changeType: 'positive',
          description: 'In progress',
          icon: FolderOpen,
          color: 'text-purple-600'
        },
        {
          title: 'Pending Invoices',
          value: pendingInvoices,
          prefix: '',
          suffix: '',
          change: '-2',
          changeType: 'negative',
          description: 'Awaiting payment',
          icon: FileText,
          color: 'text-orange-600'
        }
      ]);

      // Mock revenue data
      setRevenueData([
        { month: 'Jan', revenue: 12000, expenses: 8000 },
        { month: 'Feb', revenue: 15000, expenses: 9000 },
        { month: 'Mar', revenue: 18000, expenses: 10000 },
        { month: 'Apr', revenue: 22000, expenses: 11000 },
        { month: 'May', revenue: 25000, expenses: 12000 },
        { month: 'Jun', revenue: 28000, expenses: 13000 },
      ]);

      // Mock project status data
      setProjectStatusData([
        { name: 'Completed', value: 45, color: '#10b981' },
        { name: 'In Progress', value: 30, color: '#3b82f6' },
        { name: 'Planning', value: 15, color: '#f59e0b' },
        { name: 'On Hold', value: 10, color: '#ef4444' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const recentActivities = [
    {
      id: 1,
      type: 'payment',
      title: 'Payment received',
      description: '$2,500 from TechStart Inc.',
      time: '2 hours ago',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      id: 2,
      type: 'project',
      title: 'Project milestone completed',
      description: 'E-commerce Website Redesign - Design Phase',
      time: '4 hours ago',
      icon: Activity,
      color: 'text-blue-600'
    },
    {
      id: 3,
      type: 'invoice',
      title: 'Invoice sent',
      description: 'INV-002 sent to TechStart Inc.',
      time: '1 day ago',
      icon: FileText,
      color: 'text-purple-600'
    },
    {
      id: 4,
      type: 'client',
      title: 'New client added',
      description: 'Design Studio Pro joined',
      time: '2 days ago',
      icon: Users,
      color: 'text-orange-600'
    },
    {
      id: 5,
      type: 'document',
      title: 'Document generated',
      description: 'Project proposal for Mobile App Development',
      time: '3 days ago',
      icon: FileText,
      color: 'text-gray-600'
    }
  ];

  const quickActions = [
    {
      id: 'invoice',
      title: 'Create Invoice',
      description: 'Generate a new invoice',
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      id: 'client',
      title: 'Add Client',
      description: 'Add a new client',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      id: 'project',
      title: 'New Project',
      description: 'Start a new project',
      icon: Plus,
      color: 'bg-purple-500'
    },
    {
      id: 'document',
      title: 'Generate Document',
      description: 'Create a document',
      icon: FileText,
      color: 'bg-orange-500'
    }
  ];

  const handleQuickAction = (actionId) => {
    setActiveModal(actionId);
    setFormData({});
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    switch (activeModal) {
      case 'invoice':
        toast.success('Invoice created successfully!');
        break;
      case 'client':
        toast.success('Client added successfully!');
        break;
      case 'project':
        toast.success('Project created successfully!');
        break;
      case 'document':
        toast.success('Document generated successfully!');
        break;
      default:
        break;
    }
    
    setActiveModal(null);
    setFormData({});
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderModal = () => {
    switch (activeModal) {
      case 'invoice':
        return (
          <Dialog open={true} onOpenChange={() => setActiveModal(null)}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Invoice</DialogTitle>
                <DialogDescription>
                  Generate a new invoice for your client
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="client">Client</Label>
                  <Select value={formData.client} onValueChange={(value) => handleInputChange('client', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="techstart">TechStart Inc.</SelectItem>
                      <SelectItem value="designstudio">Design Studio Pro</SelectItem>
                      <SelectItem value="localbusiness">Local Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={formData.amount || ''}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Invoice description"
                    value={formData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">Create Invoice</Button>
                  <Button type="button" variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        );

      case 'client':
        return (
          <Dialog open={true} onOpenChange={() => setActiveModal(null)}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Client</DialogTitle>
                <DialogDescription>
                  Add a new client to your database
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    placeholder="Enter client name"
                    value={formData.clientName || ''}
                    onChange={(e) => handleInputChange('clientName', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="client@example.com"
                    value={formData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    placeholder="Company name"
                    value={formData.company || ''}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="Phone number"
                    value={formData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">Add Client</Button>
                  <Button type="button" variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        );

      case 'project':
        return (
          <Dialog open={true} onOpenChange={() => setActiveModal(null)}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>
                  Start a new project for your client
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    placeholder="Enter project name"
                    value={formData.projectName || ''}
                    onChange={(e) => handleInputChange('projectName', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectClient">Client</Label>
                  <Select value={formData.projectClient} onValueChange={(value) => handleInputChange('projectClient', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="techstart">TechStart Inc.</SelectItem>
                      <SelectItem value="designstudio">Design Studio Pro</SelectItem>
                      <SelectItem value="localbusiness">Local Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget</Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="Project budget"
                    value={formData.budget || ''}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectDescription">Description</Label>
                  <Textarea
                    id="projectDescription"
                    placeholder="Project description"
                    value={formData.projectDescription || ''}
                    onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">Create Project</Button>
                  <Button type="button" variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        );

      case 'document':
        return (
          <Dialog open={true} onOpenChange={() => setActiveModal(null)}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Generate Document</DialogTitle>
                <DialogDescription>
                  Create a new business document
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="documentType">Document Type</Label>
                  <Select value={formData.documentType} onValueChange={(value) => handleInputChange('documentType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="proposal">Project Proposal</SelectItem>
                      <SelectItem value="contract">Contract Agreement</SelectItem>
                      <SelectItem value="quote">Price Quote</SelectItem>
                      <SelectItem value="report">Project Report</SelectItem>
                      <SelectItem value="letter">Business Letter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="documentClient">Client</Label>
                  <Select value={formData.documentClient} onValueChange={(value) => handleInputChange('documentClient', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="techstart">TechStart Inc.</SelectItem>
                      <SelectItem value="designstudio">Design Studio Pro</SelectItem>
                      <SelectItem value="localbusiness">Local Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="documentTitle">Title</Label>
                  <Input
                    id="documentTitle"
                    placeholder="Document title"
                    value={formData.documentTitle || ''}
                    onChange={(e) => handleInputChange('documentTitle', e.target.value)}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">Generate Document</Button>
                  <Button type="button" variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        );

      default:
        return null;
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your business.
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Quick Add
        </Button>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold">
                          <AnimatedCounter
                            end={stat.value}
                            prefix={stat.prefix}
                            suffix={stat.suffix}
                          />
                        </p>
                        <div className="flex items-center text-sm">
                          {stat.changeType === 'positive' ? (
                            <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 text-red-600 mr-1" />
                          )}
                          <span className={stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}>
                            {stat.change}
                          </span>
                          <span className="text-muted-foreground ml-1">
                            {stat.description}
                          </span>
                        </div>
                      </div>
                      <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Revenue vs Expenses
            </CardTitle>
            <CardDescription>
              Monthly comparison of revenue and expenses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stackId="1"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stackId="2"
                  stroke="#ef4444"
                  fillOpacity={1}
                  fill="url(#colorExpenses)"
                />
                <Legend />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Project Status Chart */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5" />
              Project Status
            </CardTitle>
            <CardDescription>
              Distribution of project statuses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest business activities and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <motion.div 
                    key={activity.id} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className={`p-2 rounded-full bg-gray-100 ${activity.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.description}</p>
                    </div>
                    <div className="text-xs text-gray-400">
                      {activity.time}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.button
                    key={action.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleQuickAction(action.id)}
                    className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group cursor-pointer"
                  >
                    <div className={`p-3 rounded-full ${action.color} text-white mb-2 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-medium text-center">{action.title}</p>
                    <p className="text-xs text-gray-500 text-center">{action.description}</p>
                  </motion.button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Render Active Modal */}
      {renderModal()}
    </motion.div>
  );
};

export default Dashboard;
