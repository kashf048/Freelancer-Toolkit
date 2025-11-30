import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Search, 
  Settings, 
  User, 
  Menu, 
  LogOut, 
  Crown,
  CheckCircle,
  Clock,
  DollarSign,
  AlertCircle,
  X,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';

// Mock notifications data
const mockNotifications = [
  {
    id: 1,
    type: 'payment',
    title: 'Payment received',
    message: '$2,500 from TechStart Inc.',
    time: '2 minutes ago',
    read: false,
    icon: DollarSign,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    id: 2,
    type: 'overdue',
    title: 'Invoice #1234 is overdue',
    message: 'Client: Acme Corp - Due 3 days ago',
    time: '1 hour ago',
    read: false,
    icon: AlertCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-100'
  },
  {
    id: 3,
    type: 'milestone',
    title: 'New project milestone',
    message: 'Website redesign - Phase 2 completed',
    time: '3 hours ago',
    read: false,
    icon: CheckCircle,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    id: 4,
    type: 'reminder',
    title: 'Meeting reminder',
    message: 'Client call with Design Studio Pro in 30 minutes',
    time: '5 hours ago',
    read: true,
    icon: Clock,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100'
  },
  {
    id: 5,
    type: 'payment',
    title: 'Payment received',
    message: '$1,200 from Local Business',
    time: '1 day ago',
    read: true,
    icon: DollarSign,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  }
];

const Header = ({ onMenuClick, className = '' }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    // Mark as read
    setNotifications(prev => 
      prev.map(n => 
        n.id === notification.id ? { ...n, read: true } : n
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const handleClearNotification = (notificationId, event) => {
    event.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    toast.success('Notification removed');
  };

  const handleLogout = () => {
    toast.success('Logged out successfully');
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.info(`Searching for: ${searchQuery}`);
      // In a real app, this would trigger a search
    }
  };

  return (
    <>
      <header className={cn(
        "sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-xl shadow-sm",
        className
      )}>
        <div className="container flex h-16 items-center px-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden mr-2 hover:bg-gray-100"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo - Hidden on desktop since it's in sidebar */}
          <div className="flex items-center space-x-3 md:hidden">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">FT</span>
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Freelancer Toolkit
            </span>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search clients, projects, invoices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className={cn(
                    "pl-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500 transition-all duration-200",
                    isSearchFocused && "shadow-md"
                  )}
                />
              </div>
            </form>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            {/* Search button for mobile */}
            <Button variant="ghost" size="icon" className="md:hidden hover:bg-gray-100">
              <Search className="h-5 w-5" />
            </Button>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover:bg-gray-100">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center"
                    >
                      <Badge className="h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white border-2 border-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </Badge>
                    </motion.div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-96 p-0">
                <div className="flex items-center justify-between p-4 border-b">
                  <DropdownMenuLabel className="p-0 text-lg font-semibold">
                    Notifications
                  </DropdownMenuLabel>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMarkAllAsRead}
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                    >
                      Mark all as read
                    </Button>
                  )}
                </div>
                
                <ScrollArea className="max-h-96">
                  {notifications.length > 0 ? (
                    <div className="space-y-1">
                      {notifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={cn(
                            "flex items-start gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors relative group",
                            !notification.read && "bg-blue-50/50"
                          )}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className={cn(
                            "p-2 rounded-full flex-shrink-0",
                            notification.bgColor
                          )}>
                            <notification.icon className={cn("h-4 w-4", notification.color)} />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <p className={cn(
                                "text-sm font-medium text-gray-900 truncate",
                                !notification.read && "font-semibold"
                              )}>
                                {notification.title}
                              </p>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 hover:bg-gray-200"
                                onClick={(e) => handleClearNotification(notification.id, e)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="text-sm text-gray-600 truncate mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {notification.time}
                            </p>
                          </div>
                          
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2"></div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No notifications</p>
                    </div>
                  )}
                </ScrollArea>
                
                {notifications.length > 0 && (
                  <div className="border-t p-2">
                    <Button variant="ghost" className="w-full justify-center text-blue-600 hover:text-blue-800 hover:bg-blue-50">
                      View all notifications
                    </Button>
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Settings */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:bg-gray-100"
              onClick={() => navigate('/settings')}
            >
              <Settings className="h-5 w-5" />
            </Button>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-gray-100">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-semibold">
                      JD
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium leading-none">John Doe</p>
                      <Crown className="h-3 w-3 text-yellow-500" />
                    </div>
                    <p className="text-xs leading-none text-gray-500">
                      john@freelancer.com
                    </p>
                    <Badge variant="secondary" className="w-fit text-xs">
                      Premium Plan
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Notification Detail Modal */}
      <Dialog open={!!selectedNotification} onOpenChange={() => setSelectedNotification(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedNotification && (
                <>
                  <div className={cn(
                    "p-2 rounded-full",
                    selectedNotification.bgColor
                  )}>
                    <selectedNotification.icon className={cn("h-4 w-4", selectedNotification.color)} />
                  </div>
                  {selectedNotification.title}
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {selectedNotification?.message}
            </DialogDescription>
          </DialogHeader>
          {selectedNotification && (
            <div className="space-y-4">
              <div className="text-sm text-gray-500">
                <strong>Time:</strong> {selectedNotification.time}
              </div>
              <div className="text-sm text-gray-500">
                <strong>Type:</strong> {selectedNotification.type}
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => setSelectedNotification(null)}
                  className="flex-1"
                >
                  Close
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    toast.success('Notification action performed');
                    setSelectedNotification(null);
                  }}
                  className="flex-1"
                >
                  Take Action
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Header;

