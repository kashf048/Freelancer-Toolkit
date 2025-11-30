import React, { useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  FileText,
  Receipt,
  Calendar,
  Settings,
  CreditCard,
  BarChart3,
  X,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
  Crown,
  Moon,
  Sun
} from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { cn } from '../lib/utils';
import { useThemeStore } from '../stores/themeStore';
import toast from 'react-hot-toast';

const navigationItems = [
  {
    title: 'Overview',
    items: [
      {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
      },
      {
        title: 'Analytics',
        href: '/analytics',
        icon: BarChart3,
      },
    ],
  },
  {
    title: 'Management',
    items: [
      {
        title: 'Clients',
        href: '/clients',
        icon: Users,
      },
      {
        title: 'Projects',
        href: '/projects',
        icon: FolderOpen,
      },
      {
        title: 'Documents',
        href: '/documents',
        icon: FileText,
      },
      {
        title: 'Invoices',
        href: '/invoices',
        icon: Receipt,
      },
    ],
  },
  {
    title: 'Tools',
    items: [
      {
        title: 'Calendar',
        href: '/calendar',
        icon: Calendar,
      },
      {
        title: 'Payments',
        href: '/payments',
        icon: CreditCard,
      },
    ],
  },
  {
    title: 'Settings',
    items: [
      {
        title: 'Settings',
        href: '/settings',
        icon: Settings,
      },
    ],
  },
];

const AdminSidebar = ({ isOpen, onClose, className = '' }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme, toggleTheme } = useThemeStore();

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    toast.success('Logged out successfully');
    localStorage.removeItem('isAuthenticated');
    // In a real app, this would redirect to login
  };

  const sidebarVariants = {
    expanded: {
      width: 256,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    collapsed: {
      width: 80,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const contentVariants = {
    expanded: {
      opacity: 1,
      transition: {
        delay: 0.1,
        duration: 0.2
      }
    },
    collapsed: {
      opacity: 0,
      transition: {
        duration: 0.1
      }
    }
  };

  const isDark = theme === 'dark';

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        animate={isCollapsed ? "collapsed" : "expanded"}
        className={cn(
          'fixed left-0 top-0 z-50 h-full transform border-r transition-all duration-300 ease-in-out md:relative md:translate-x-0',
          isDark 
            ? 'bg-slate-900/95 border-slate-700 text-slate-100' 
            : 'bg-white/95 border-gray-200 text-gray-900',
          'shadow-xl backdrop-blur-xl',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          className
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className={cn(
            "flex h-16 items-center justify-between px-4 border-b",
            isDark ? 'border-slate-700' : 'border-gray-200'
          )}>
            <AnimatePresence mode="wait">
              {!isCollapsed ? (
                <motion.div
                  key="expanded-header"
                  variants={contentVariants}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  className="flex items-center space-x-3"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm">FT</span>
                  </div>
                  <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Freelancer Toolkit
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="collapsed-header"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg mx-auto"
                >
                  <span className="text-white font-bold text-sm">FT</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Desktop controls */}
            <div className="hidden md:flex items-center gap-1">
              {/* Theme toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className={cn(
                  "h-8 w-8 transition-colors",
                  isDark 
                    ? 'hover:bg-slate-700 text-yellow-400' 
                    : 'hover:bg-gray-100 text-gray-600'
                )}
              >
                {isDark ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>

              {/* Collapse toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleToggleCollapse}
                className={cn(
                  "h-8 w-8 transition-colors",
                  isDark 
                    ? 'hover:bg-slate-700' 
                    : 'hover:bg-gray-100'
                )}
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Mobile close button */}
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose}
                className={isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-6">
              {navigationItems.map((section, sectionIndex) => (
                <div key={section.title}>
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.h3
                        variants={contentVariants}
                        initial="collapsed"
                        animate="expanded"
                        exit="collapsed"
                        className={cn(
                          "mb-2 px-3 text-xs font-semibold uppercase tracking-wider",
                          isDark ? 'text-slate-400' : 'text-gray-500'
                        )}
                      >
                        {section.title}
                      </motion.h3>
                    )}
                  </AnimatePresence>
                  
                  <div className="space-y-1">
                    {section.items.map((item) => (
                      <NavLink
                        key={item.href}
                        to={item.href}
                        onClick={() => {
                          if (window.innerWidth < 768) {
                            onClose();
                          }
                        }}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all group relative',
                            isActive
                              ? isDark
                                ? 'bg-blue-600/20 text-blue-400 shadow-sm border-l-4 border-blue-600'
                                : 'bg-blue-100 text-blue-700 shadow-sm border-l-4 border-blue-600'
                              : isDark
                              ? 'text-slate-300 hover:bg-slate-800/50 hover:text-blue-400'
                              : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700',
                            isCollapsed && 'justify-center px-2'
                          )
                        }
                      >
                        <item.icon className={cn("h-5 w-5 flex-shrink-0", isCollapsed && "h-6 w-6")} />
                        
                        <AnimatePresence>
                          {!isCollapsed && (
                            <motion.span
                              variants={contentVariants}
                              initial="collapsed"
                              animate="expanded"
                              exit="collapsed"
                              className="truncate"
                            >
                              {item.title}
                            </motion.span>
                          )}
                        </AnimatePresence>

                        {/* Tooltip for collapsed state */}
                        {isCollapsed && (
                          <div className={cn(
                            "absolute left-full ml-2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50",
                            isDark 
                              ? 'bg-slate-800 text-slate-100' 
                              : 'bg-gray-900 text-white'
                          )}>
                            {item.title}
                          </div>
                        )}
                      </NavLink>
                    ))}
                  </div>
                  
                  {sectionIndex < navigationItems.length - 1 && (
                    <Separator className={cn("mt-4", isDark ? 'bg-slate-700' : 'bg-gray-200')} />
                  )}
                </div>
              ))}
            </nav>
          </ScrollArea>

          {/* User Profile Section */}
          <div className={cn("border-t p-4", isDark ? 'border-slate-700' : 'border-gray-200')}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start p-3 h-auto transition-colors",
                    isDark 
                      ? 'hover:bg-slate-800' 
                      : 'hover:bg-gray-50',
                    isCollapsed && "justify-center px-2"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-avatar.jpg" />
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-semibold">
                        JD
                      </AvatarFallback>
                    </Avatar>
                    
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.div
                          variants={contentVariants}
                          initial="collapsed"
                          animate="expanded"
                          exit="collapsed"
                          className="flex-1 min-w-0 text-left"
                        >
                          <div className="flex items-center gap-1">
                            <p className={cn("text-sm font-medium truncate", isDark ? 'text-slate-100' : 'text-gray-900')}>
                              John Doe
                            </p>
                            <Crown className="h-3 w-3 text-yellow-500" />
                          </div>
                          <p className={cn("text-xs truncate", isDark ? 'text-slate-400' : 'text-gray-500')}>
                            Premium Plan
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent 
                align="end" 
                className={cn(
                  "w-56",
                  isDark ? 'bg-slate-800 border-slate-700' : ''
                )}
              >
                <DropdownMenuItem asChild>
                  <NavLink to="/profile" className="flex items-center cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink to="/settings" className="flex items-center cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuSeparator className={isDark ? 'bg-slate-700' : ''} />
                <DropdownMenuItem 
                  onClick={handleLogout} 
                  className={cn("text-red-600 cursor-pointer", isDark ? 'hover:bg-slate-700' : '')}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default AdminSidebar;
