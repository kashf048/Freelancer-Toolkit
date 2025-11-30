import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Calendar,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  FolderOpen,
  Target,
  Eye,
  Edit,
  Trash2,
  Star,
  StarOff,
  X
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Progress } from '../components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import toast from 'react-hot-toast';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    client: '',
    status: 'Planning',
    priority: 'Medium',
    budget: '',
    startDate: '',
    endDate: '',
    tags: ''
  });

  // Sample project data
  const initialProjectsData = [
    {
      id: 1,
      name: 'E-commerce Website Redesign',
      description: 'Complete redesign of the TechStart Inc. e-commerce platform with modern UI/UX',
      client: 'TechStart Inc.',
      clientId: 1,
      status: 'In Progress',
      priority: 'High',
      progress: 65,
      budget: 25000,
      spent: 16250,
      startDate: '2024-01-15',
      endDate: '2024-03-30',
      dueDate: '2024-03-30',
      team: [
        { id: 1, name: 'John Doe', avatar: null, initials: 'JD' },
        { id: 2, name: 'Jane Smith', avatar: null, initials: 'JS' },
        { id: 3, name: 'Mike Johnson', avatar: null, initials: 'MJ' }
      ],
      tags: ['Web Design', 'E-commerce', 'React'],
      milestones: [
        { id: 1, name: 'Design Phase', completed: true, dueDate: '2024-02-15' },
        { id: 2, name: 'Development Phase', completed: false, dueDate: '2024-03-15' },
        { id: 3, name: 'Testing & Launch', completed: false, dueDate: '2024-03-30' }
      ],
      lastActivity: '2024-02-12'
    },
    {
      id: 2,
      name: 'Brand Identity Package',
      description: 'Complete brand identity design including logo, colors, and guidelines',
      client: 'Design Studio Pro',
      clientId: 2,
      status: 'In Progress',
      priority: 'Medium',
      progress: 40,
      budget: 15000,
      spent: 6000,
      startDate: '2024-02-01',
      endDate: '2024-04-15',
      dueDate: '2024-04-15',
      team: [
        { id: 1, name: 'John Doe', avatar: null, initials: 'JD' },
        { id: 4, name: 'Sarah Wilson', avatar: null, initials: 'SW' }
      ],
      tags: ['Branding', 'Design', 'Identity'],
      milestones: [
        { id: 1, name: 'Research & Discovery', completed: true, dueDate: '2024-02-15' },
        { id: 2, name: 'Logo Design', completed: false, dueDate: '2024-03-15' },
        { id: 3, name: 'Brand Guidelines', completed: false, dueDate: '2024-04-15' }
      ],
      lastActivity: '2024-02-10'
    },
    {
      id: 3,
      name: 'Mobile App Development',
      description: 'Native iOS and Android app for Local Business Hub',
      client: 'Local Business Hub',
      clientId: 4,
      status: 'Planning',
      priority: 'High',
      progress: 15,
      budget: 45000,
      spent: 6750,
      startDate: '2024-02-15',
      endDate: '2024-06-30',
      dueDate: '2024-06-30',
      team: [
        { id: 1, name: 'John Doe', avatar: null, initials: 'JD' },
        { id: 5, name: 'Alex Chen', avatar: null, initials: 'AC' }
      ],
      tags: ['Mobile', 'iOS', 'Android', 'React Native'],
      milestones: [
        { id: 1, name: 'Planning & Architecture', completed: false, dueDate: '2024-03-15' },
        { id: 2, name: 'UI/UX Design', completed: false, dueDate: '2024-04-15' },
        { id: 3, name: 'Development', completed: false, dueDate: '2024-06-15' },
        { id: 4, name: 'Testing & Launch', completed: false, dueDate: '2024-06-30' }
      ],
      lastActivity: '2024-02-08'
    },
    {
      id: 4,
      name: 'Marketing Website',
      description: 'Modern marketing website with CMS integration',
      client: 'Marketing Masters',
      clientId: 6,
      status: 'Completed',
      priority: 'Medium',
      progress: 100,
      budget: 12000,
      spent: 11500,
      startDate: '2023-12-01',
      endDate: '2024-01-31',
      dueDate: '2024-01-31',
      team: [
        { id: 2, name: 'Jane Smith', avatar: null, initials: 'JS' },
        { id: 6, name: 'Tom Brown', avatar: null, initials: 'TB' }
      ],
      tags: ['Web Design', 'CMS', 'Marketing'],
      milestones: [
        { id: 1, name: 'Design & Wireframes', completed: true, dueDate: '2023-12-15' },
        { id: 2, name: 'Development', completed: true, dueDate: '2024-01-15' },
        { id: 3, name: 'Content & Launch', completed: true, dueDate: '2024-01-31' }
      ],
      lastActivity: '2024-01-31'
    },
    {
      id: 5,
      name: 'AI Dashboard Platform',
      description: 'Advanced analytics dashboard with AI-powered insights',
      client: 'Innovation Labs',
      clientId: 5,
      status: 'In Progress',
      priority: 'High',
      progress: 75,
      budget: 65000,
      spent: 48750,
      startDate: '2023-11-01',
      endDate: '2024-03-15',
      dueDate: '2024-03-15',
      team: [
        { id: 1, name: 'John Doe', avatar: null, initials: 'JD' },
        { id: 3, name: 'Mike Johnson', avatar: null, initials: 'MJ' },
        { id: 5, name: 'Alex Chen', avatar: null, initials: 'AC' },
        { id: 7, name: 'Lisa Wang', avatar: null, initials: 'LW' }
      ],
      tags: ['AI', 'Dashboard', 'Analytics', 'Machine Learning'],
      milestones: [
        { id: 1, name: 'Backend Development', completed: true, dueDate: '2023-12-15' },
        { id: 2, name: 'AI Model Integration', completed: true, dueDate: '2024-01-31' },
        { id: 3, name: 'Frontend Development', completed: false, dueDate: '2024-02-28' },
        { id: 4, name: 'Testing & Deployment', completed: false, dueDate: '2024-03-15' }
      ],
      lastActivity: '2024-02-11'
    },
    {
      id: 6,
      name: 'Content Management System',
      description: 'Custom CMS solution for content creators',
      client: 'Global Solutions Ltd',
      clientId: 3,
      status: 'On Hold',
      priority: 'Low',
      progress: 25,
      budget: 18000,
      spent: 4500,
      startDate: '2024-01-01',
      endDate: '2024-05-31',
      dueDate: '2024-05-31',
      team: [
        { id: 6, name: 'Tom Brown', avatar: null, initials: 'TB' }
      ],
      tags: ['CMS', 'Backend', 'API'],
      milestones: [
        { id: 1, name: 'Requirements Analysis', completed: true, dueDate: '2024-01-15' },
        { id: 2, name: 'System Architecture', completed: false, dueDate: '2024-02-28' },
        { id: 3, name: 'Development', completed: false, dueDate: '2024-04-30' },
        { id: 4, name: 'Testing & Launch', completed: false, dueDate: '2024-05-31' }
      ],
      lastActivity: '2024-01-20'
    }
  ];

  // Available clients for dropdown
  const availableClients = [
    'TechStart Inc.',
    'Design Studio Pro',
    'Global Solutions Ltd',
    'Local Business Hub',
    'Innovation Labs',
    'Marketing Masters'
  ];

  useEffect(() => {
    setProjects(initialProjectsData);
    setFilteredProjects(initialProjectsData);
  }, []);

  useEffect(() => {
    let filtered = projects;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => {
        const projectStatus = project.status.toLowerCase().replace(' ', '-');
        return projectStatus === statusFilter;
      });
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(project => project.priority.toLowerCase() === priorityFilter);
    }

    setFilteredProjects(filtered);
  }, [projects, searchQuery, statusFilter, priorityFilter]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    
    const tagsArray = formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [];
    
    const newProject = {
      id: Date.now(),
      ...formData,
      budget: parseFloat(formData.budget) || 0,
      spent: 0,
      progress: 0,
      team: [{ id: 1, name: 'John Doe', avatar: null, initials: 'JD' }],
      tags: tagsArray,
      milestones: [],
      lastActivity: new Date().toISOString().split('T')[0],
      clientId: availableClients.indexOf(formData.client) + 1,
      dueDate: formData.endDate || formData.startDate
    };

    setProjects(prev => [newProject, ...prev]);
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      description: '',
      client: '',
      status: 'Planning',
      priority: 'Medium',
      budget: '',
      startDate: '',
      endDate: '',
      tags: ''
    });
    
    toast.success('Project created successfully!');
  };

  const handleDeleteProject = (projectId) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
    toast.success('Project deleted successfully!');
  };

  const handleToggleFavorite = (projectId) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, isFavorite: !project.isFavorite }
        : project
    ));
    toast.success('Project updated!');
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in progress': return 'bg-blue-100 text-blue-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'on hold': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return CheckCircle;
      case 'in progress': return Play;
      case 'planning': return Clock;
      case 'on hold': return Pause;
      case 'cancelled': return X;
      default: return Clock;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage your projects and track their progress
          </p>
        </div>
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                <p className="text-2xl font-bold">{projects.length}</p>
              </div>
              <FolderOpen className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                <p className="text-2xl font-bold">
                  {projects.filter(p => p.status === 'In Progress').length}
                </p>
              </div>
              <Play className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">
                  {projects.filter(p => p.status === 'Completed').length}
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
                <p className="text-sm font-medium text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(projects.reduce((sum, project) => sum + project.budget, 0))}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
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
                  placeholder="Search projects..."
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
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
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

      {/* Projects Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filteredProjects.map((project, index) => {
            const StatusIcon = getStatusIcon(project.status);
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 group">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{project.name}</h3>
                        <p className="text-sm text-gray-500 mb-2">{project.client}</p>
                        <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/projects/${project.id}`} className="flex items-center">
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Project
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleFavorite(project.id)}>
                            {project.isFavorite ? (
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
                            onClick={() => handleDeleteProject(project.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Project
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Status and Priority */}
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(project.status)}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {project.status}
                      </Badge>
                      <Badge className={getPriorityColor(project.priority)}>
                        {project.priority} Priority
                      </Badge>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>

                    {/* Budget */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Budget</span>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(project.budget)}</p>
                        <p className="text-xs text-gray-500">
                          Spent: {formatCurrency(project.spent)}
                        </p>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-500">
                        <Calendar className="mr-1 h-4 w-4" />
                        <span>Due</span>
                      </div>
                      <span className="font-medium">
                        {new Date(project.dueDate).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Team */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Team</span>
                      <div className="flex -space-x-2">
                        {project.team.slice(0, 3).map((member) => (
                          <Avatar key={member.id} className="h-6 w-6 border-2 border-white">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-xs">
                              {member.initials}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {project.team.length > 3 && (
                          <div className="h-6 w-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                            <span className="text-xs text-gray-600">+{project.team.length - 3}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tags */}
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.tags.slice(0, 3).map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {project.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{project.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No projects found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'Try adjusting your filters or search query.'
                : 'Get started by creating your first project.'}
            </p>
            {!searchQuery && statusFilter === 'all' && priorityFilter === 'all' && (
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Project
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Add Project Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Start a new project by filling out the details below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddProject} className="space-y-6">
            <div className="max-h-[60vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="name">Project Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter project name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the project goals and scope"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    required
                  />
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
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget</Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="Project budget"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Planning">Planning</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="On Hold">On Hold</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
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
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    placeholder="Enter tags separated by commas (e.g., Web Design, React, E-commerce)"
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-4 border-t">
              <Button type="submit" className="flex-1">
                <Plus className="mr-2 h-4 w-4" />
                Create Project
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

export default Projects;