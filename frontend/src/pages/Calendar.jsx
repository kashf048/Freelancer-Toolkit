import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  MapPin, 
  Users,
  AlertCircle,
  CheckCircle,
  Target,
  DollarSign,
  FileText,
  Phone,
  Video,
  X,
  Edit,
  Trash2,
  MoreHorizontal,
  Bell,
  Calendar as CalendarDays
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import toast from 'react-hot-toast';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('month');
  const [formData, setFormData] = useState({
    title: '',
    type: 'meeting',
    client: '',
    date: '',
    time: '',
    duration: '60',
    location: '',
    description: '',
    priority: 'medium'
  });

  // Sample calendar events data
  const initialEventsData = [
    {
      id: 1,
      title: 'Client Meeting - TechStart Inc.',
      type: 'meeting',
      client: 'TechStart Inc.',
      date: '2024-02-15',
      time: '10:00',
      duration: 60,
      location: 'Zoom',
      description: 'Project kickoff meeting for e-commerce redesign',
      status: 'confirmed',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Project Deadline - Brand Identity',
      type: 'deadline',
      client: 'Design Studio Pro',
      date: '2024-02-20',
      time: '17:00',
      duration: 0,
      location: null,
      description: 'Final delivery of brand identity package',
      status: 'pending',
      priority: 'high'
    },
    {
      id: 3,
      title: 'Milestone Review - Mobile App',
      type: 'milestone',
      client: 'Local Business Hub',
      date: '2024-02-18',
      time: '14:00',
      duration: 90,
      location: 'Office',
      description: 'Review of mobile app development progress',
      status: 'confirmed',
      priority: 'medium'
    },
    {
      id: 4,
      title: 'Invoice Due - Corporate Website',
      type: 'payment',
      client: 'Innovation Labs',
      date: '2024-02-27',
      time: '23:59',
      duration: 0,
      location: null,
      description: 'Payment due for corporate website project',
      status: 'pending',
      priority: 'high'
    },
    {
      id: 5,
      title: 'Coffee Chat - Creative Agency',
      type: 'meeting',
      client: 'Marketing Masters',
      date: '2024-02-22',
      time: '15:30',
      duration: 45,
      location: 'Starbucks Downtown',
      description: 'Informal discussion about portfolio website',
      status: 'confirmed',
      priority: 'low'
    },
    {
      id: 6,
      title: 'Design Review Session',
      type: 'review',
      client: 'Design Studio Pro',
      date: '2024-02-25',
      time: '11:00',
      duration: 120,
      location: 'Client Office',
      description: 'Review and finalize brand identity designs',
      status: 'confirmed',
      priority: 'medium'
    },
    {
      id: 7,
      title: 'Project Proposal Presentation',
      type: 'presentation',
      client: 'Global Solutions Ltd',
      date: '2024-02-28',
      time: '16:00',
      duration: 60,
      location: 'Teams Meeting',
      description: 'Present new project proposal to stakeholders',
      status: 'confirmed',
      priority: 'high'
    },
    {
      id: 8,
      title: 'Weekly Team Standup',
      type: 'meeting',
      client: 'Internal',
      date: '2024-02-19',
      time: '09:00',
      duration: 30,
      location: 'Office',
      description: 'Weekly team sync and project updates',
      status: 'confirmed',
      priority: 'medium'
    },
    {
      id: 9,
      title: 'Client Onboarding Call',
      type: 'meeting',
      client: 'TechStart Inc.',
      date: '2024-02-26',
      time: '13:00',
      duration: 45,
      location: 'Zoom',
      description: 'Onboarding session for new client project',
      status: 'confirmed',
      priority: 'medium'
    },
    {
      id: 10,
      title: 'Contract Signing',
      type: 'contract',
      client: 'Innovation Labs',
      date: '2024-02-29',
      time: '10:30',
      duration: 30,
      location: 'DocuSign',
      description: 'Final contract signing for AI dashboard project',
      status: 'pending',
      priority: 'high'
    }
  ];

  // Available clients
  const availableClients = [
    'TechStart Inc.',
    'Design Studio Pro',
    'Global Solutions Ltd',
    'Local Business Hub',
    'Innovation Labs',
    'Marketing Masters',
    'Internal'
  ];

  // Event types
  const eventTypes = [
    { value: 'meeting', label: 'Meeting', icon: Users },
    { value: 'deadline', label: 'Deadline', icon: AlertCircle },
    { value: 'milestone', label: 'Milestone', icon: Target },
    { value: 'payment', label: 'Payment Due', icon: DollarSign },
    { value: 'review', label: 'Review', icon: CheckCircle },
    { value: 'presentation', label: 'Presentation', icon: FileText },
    { value: 'contract', label: 'Contract', icon: FileText },
    { value: 'call', label: 'Phone Call', icon: Phone },
    { value: 'video', label: 'Video Call', icon: Video }
  ];

  useEffect(() => {
    setEvents(initialEventsData);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    
    const newEvent = {
      id: Date.now(),
      ...formData,
      duration: parseInt(formData.duration),
      status: 'confirmed'
    };

    setEvents(prev => [...prev, newEvent]);
    setIsAddEventModalOpen(false);
    setFormData({
      title: '',
      type: 'meeting',
      client: '',
      date: '',
      time: '',
      duration: '60',
      location: '',
      description: '',
      priority: 'medium'
    });
    
    toast.success('Event added successfully!');
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
    toast.success('Event deleted successfully!');
  };

  const getEventTypeIcon = (type) => {
    const eventType = eventTypes.find(t => t.value === type);
    return eventType ? eventType.icon : CalendarIcon;
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'meeting': return 'bg-blue-100 text-blue-800';
      case 'deadline': return 'bg-red-100 text-red-800';
      case 'milestone': return 'bg-green-100 text-green-800';
      case 'payment': return 'bg-yellow-100 text-yellow-800';
      case 'review': return 'bg-purple-100 text-purple-800';
      case 'presentation': return 'bg-indigo-100 text-indigo-800';
      case 'contract': return 'bg-orange-100 text-orange-800';
      case 'call': return 'bg-teal-100 text-teal-800';
      case 'video': return 'bg-cyan-100 text-cyan-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDuration = (duration) => {
    if (!duration || duration === 0) return '';
    if (duration < 60) return `${duration}m`;
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  };

  const getUpcomingEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcoming = events
      .filter(event => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= today;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 10);
    return upcoming;
  };

  const getTodayEvents = () => {
    const today = new Date().toISOString().split('T')[0];
    return events.filter(event => event.date === today);
  };

  const getThisWeekEvents = () => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    
    return events.filter(event => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate >= weekStart && eventDate <= weekEnd;
    });
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Generate calendar days
  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay());
    
    const endDate = new Date(lastDay);
    endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay()));
    
    const days = [];
    const currentDay = new Date(startDate);
    
    while (currentDay <= endDate) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return days;
  };

  const calendarDays = getCalendarDays();

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
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">
            Manage your schedule and upcoming events
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={viewMode} onValueChange={setViewMode}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="day">Day</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={() => setIsAddEventModalOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today's Events</p>
                <p className="text-2xl font-bold">{getTodayEvents().length}</p>
              </div>
              <CalendarDays className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold">{getThisWeekEvents().length}</p>
              </div>
              <CalendarIcon className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
                <p className="text-2xl font-bold">{getUpcomingEvents().length}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold">{events.length}</p>
              </div>
              <Target className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar View */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigateMonth(-1)}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                    Today
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigateMonth(1)}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, i) => {
                  const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                  const isToday = day.toDateString() === new Date().toDateString();
                  const dayNumber = day.getDate();
                  const hasEvents = events.some(event => {
                    const eventDate = new Date(event.date);
                    return eventDate.toDateString() === day.toDateString();
                  });
                  
                  return (
                    <div
                      key={i}
                      className={`
                        aspect-square p-1 border rounded cursor-pointer transition-colors
                        ${isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'}
                        ${isToday ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}
                        ${hasEvents ? 'border-blue-200 bg-blue-50' : ''}
                        hover:bg-gray-50
                      `}
                      onClick={() => isCurrentMonth && setSelectedDate(dayNumber)}
                    >
                      <div className={`text-sm ${isToday ? 'font-bold text-blue-600' : ''}`}>
                        {dayNumber}
                      </div>
                      {hasEvents && (
                        <div className="mt-1 flex justify-center">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Upcoming Events
              </CardTitle>
              <CardDescription>
                Your next scheduled events and deadlines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <AnimatePresence>
                {getUpcomingEvents().map((event, index) => {
                  const EventIcon = getEventTypeIcon(event.type);
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-blue-100">
                        <EventIcon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium line-clamp-1">{event.title}</h4>
                            <p className="text-xs text-gray-500">{event.client}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getEventTypeColor(event.type)} variant="secondary">
                                {eventTypes.find(t => t.value === event.type)?.label || event.type}
                              </Badge>
                              <Badge className={getPriorityColor(event.priority)} variant="secondary">
                                {event.priority}
                              </Badge>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Event
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Bell className="mr-2 h-4 w-4" />
                                Set Reminder
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDeleteEvent(event.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Event
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            {new Date(event.date).toLocaleDateString()}
                          </div>
                          {event.time && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTime(event.time)}
                              {event.duration > 0 && ` (${formatDuration(event.duration)})`}
                            </div>
                          )}
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              
              {getUpcomingEvents().length === 0 && (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-sm font-medium text-gray-900 mb-1">No upcoming events</h3>
                  <p className="text-xs text-gray-500">Add your first event to get started</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Event Modal */}
      <Dialog open={isAddEventModalOpen} onOpenChange={setIsAddEventModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
            <DialogDescription>
              Schedule a new event, meeting, or deadline in your calendar.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddEvent} className="space-y-6">
            <div className="max-h-[60vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter event title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Event Type</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client">Client</Label>
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
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Select value={formData.duration} onValueChange={(value) => handleInputChange('duration', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="180">3 hours</SelectItem>
                      <SelectItem value="0">All day</SelectItem>
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
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Meeting location or platform (e.g., Zoom, Office, etc.)"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Event description or agenda"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-4 border-t">
              <Button type="submit" className="flex-1">
                <Plus className="mr-2 h-4 w-4" />
                Add Event
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsAddEventModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default Calendar;