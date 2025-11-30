import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Button } from './ui/button';
import { Input } from './ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '../lib/utils';
import { useThemeStore } from '../stores/themeStore';
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

const AdminNavbar = ({ onMenuClick, className = '' }) => {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const isDark = theme === 'dark';
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = useCallback((notification) => {
    setSelectedNotification(notification);
    setNotifications(prev => 
      prev.map(n => 
        n.id === notification.id ? { ...n, read: true } : n
      )
    );
  }, []);

  const handleMarkAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  }, []);

  const handleClearNotification = useCallback((notificationId, event) => {
    event.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    toast.success('Notification removed');
  }, []);

  const handleLogout = useCallback(() => {
    toast.success('Logged out successfully');
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  }, [navigate]);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.info(`Searching for: ${searchQuery}`);
      setIsSearchModalOpen(false);
      setSearchQuery('');
    }
  }, [searchQuery]);

  const handleMobileSearch = useCallback(() => {
    setIsSearchModalOpen(true);
  }, []);

  return (
    <>
      <header className={cn(
        "sticky top-0 z-40 w-full border-b transition-colors duration-200",
        isDark 
          ? 'bg-slate-900/95 border-slate-700 text-slate-100' 
          : 'bg-white/95 border-gray-200 text-gray-900',
        'backdrop-blur-xl shadow-sm',
        className
      )}>
        <div className="w-full flex h-16 items-center px-4 md:px-6">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "md:hidden mr-2 transition-colors",
              isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100'
            )}
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo - Hidden on desktop */}
          <div className="flex items-center space-x-3 md:hidden">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">FT</span>
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Freelancer Toolkit
            </span>
          </div>

          {/* Desktop Search bar */}
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className={cn(
                  "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors",
                  isDark ? 'text-slate-500' : 'text-gray-400'
                )} />
                <Input
                  placeholder="Search clients, projects, invoices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className={cn(
                    "pl-10 transition-all duration-200",
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:bg-slate-700 focus:border-blue-500'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-blue-500',
                    isSearchFocused && "shadow-md"
                  )}
                />
              </div>
            </form>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-2 ml-auto">
            {/* Mobile Search button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "md:hidden transition-colors",
                isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100'
              )}
              onClick={handleMobileSearch}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn(
                    "relative transition-colors",
                    isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100'
                  )}
                >
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
              <DropdownMenuContent 
                align="end" 
                className={cn(
                  "w-96 p-0",
                  isDark ? 'bg-slate-800 border-slate-700' : ''
                )}
              >
                <div className={cn(
                  "flex items-center justify-between p-4 border-b",
                  isDark ? 'border-slate-700' : 'border-gray-200'
                )}>
                  <DropdownMenuLabel className="p-0 text-lg font-semibold">
                    Notifications
                  </DropdownMenuLabel>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMarkAllAsRead}
                      className={cn(
                        "transition-colors",
                        isDark
                          ? 'text-blue-400 hover:text-blue-300 hover:bg-slate-700'
                          : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
                      )}
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
                            "flex items-start gap-3 p-4 cursor-pointer transition-colors relative group",
                            !notification.read && (isDark ? 'bg-blue-900/30' : 'bg-blue-50/50'),
                            isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-50'
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
                                "text-sm font-medium truncate",
                                isDark ? 'text-slate-100' : 'text-gray-900',
                                !notification.read && "font-semibold"
                              )}>
                                {notification.title}
                              </p>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={cn(
                                  "opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0",
                                  isDark ? 'hover:bg-slate-600' : 'hover:bg-gray-200'
                                )}
                                onClick={(e) => handleClearNotification(notification.id, e)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className={cn(
                              "text-sm truncate mt-1",
                              isDark ? 'text-slate-400' : 'text-gray-600'
                            )}>
                              {notification.message}
                            </p>
                            <p className={cn(
                              "text-xs mt-1",
                              isDark ? 'text-slate-500' : 'text-gray-400'
                            )}>
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
                      <Bell className={cn(
                        "h-12 w-12 mx-auto mb-4",
                        isDark ? 'text-slate-600' : 'text-gray-400'
                      )} />
                      <p className={isDark ? 'text-slate-400' : 'text-gray-500'}>
                        No notifications
                      </p>
                    </div>
                  )}
                </ScrollArea>
                
                {notifications.length > 0 && (
                  <div className={cn(
                    "border-t p-2",
                    isDark ? 'border-slate-700' : 'border-gray-200'
                  )}>
                    <Button 
                      variant="ghost" 
                      className={cn(
                        "w-full justify-center transition-colors",
                        isDark
                          ? 'text-blue-400 hover:text-blue-300 hover:bg-slate-700'
                          : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
                      )}
                    >
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
              className={cn(
                "transition-colors",
                isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100'
              )}
              onClick={() => navigate('/settings')}
            >
              <Settings className="h-5 w-5" />
            </Button>

            {/* Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn(
                    "transition-colors",
                    isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100'
                  )}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-avatar.jpg" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-semibold text-xs">
                      JD
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className={cn(
                  "w-56",
                  isDark ? 'bg-slate-800 border-slate-700' : ''
                )}
              >
                <DropdownMenuLabel className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-avatar.jpg" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-semibold text-xs">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">John Doe</p>
                    <p className={cn("text-xs", isDark ? 'text-slate-400' : 'text-gray-500')}>
                      Premium Plan
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className={isDark ? 'bg-slate-700' : ''} />
                <DropdownMenuItem 
                  onClick={() => navigate('/profile')}
                  className={isDark ? 'cursor-pointer' : 'cursor-pointer'}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => navigate('/settings')}
                  className={isDark ? 'cursor-pointer' : 'cursor-pointer'}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className={isDark ? 'bg-slate-700' : ''} />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className={cn(
                    "text-red-600 cursor-pointer",
                    isDark ? 'hover:bg-slate-700' : ''
                  )}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Mobile Search Modal */}
      <Dialog open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen}>
        <DialogContent className={cn(
          "max-w-md",
          isDark ? 'bg-slate-800 border-slate-700' : ''
        )}>
          <DialogHeader>
            <DialogTitle>Search</DialogTitle>
            <DialogDescription>
              Search for clients, projects, invoices, and more
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <Search className={cn(
                "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4",
                isDark ? 'text-slate-500' : 'text-gray-400'
              )} />
              <Input
                autoFocus
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "pl-10",
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-slate-100'
                    : 'bg-gray-50 border-gray-200'
                )}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                Search
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsSearchModalOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminNavbar;
