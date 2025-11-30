import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Wrench,
  Settings,
  BarChart3,
  X,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
  Shield,
} from 'lucide-react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';

const adminNavigationItems = [
  {
    title: 'Overview',
    items: [
      {
        title: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard,
      },
      {
        title: 'Analytics',
        href: '/admin/analytics',
        icon: BarChart3,
      },
    ],
  },
  {
    title: 'Management',
    items: [
      {
        title: 'Users',
        href: '/admin/users',
        icon: Users,
      },
      {
        title: 'Tools',
        href: '/admin/tools',
        icon: Wrench,
      },
    ],
  },
  {
    title: 'Configuration',
    items: [
      {
        title: 'Settings',
        href: '/admin/settings',
        icon: Settings,
      },
    ],
  },
];

const AdminSidebar = ({ isOpen, onClose, className = '' }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    toast.success('Logged out successfully');
    // In a real app, this would clear auth state and redirect to login
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
          'fixed left-0 top-0 z-50 h-full transform border-r bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-xl transition-transform duration-300 ease-in-out md:relative md:translate-x-0 dark:border-slate-800',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          className
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b dark:border-slate-800">
            {/* Admin Badge */}
            <div className="hidden md:flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              {!isCollapsed && (
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">ADMIN</span>
              )}
            </div>

            {/* Desktop collapse toggle */}
            <div className="hidden md:flex">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleToggleCollapse}
                className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-slate-800"
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
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-6">
              {adminNavigationItems.map((section, sectionIndex) => (
                <div key={section.title}>
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.h3
                        variants={contentVariants}
                        initial="collapsed"
                        animate="expanded"
                        exit="collapsed"
                        className="mb-2 px-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider"
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
                            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-700 dark:hover:text-blue-400 group relative',
                            isActive
                              ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 shadow-sm border-l-4 border-blue-600 dark:border-blue-400'
                              : 'text-gray-600 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-400',
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
                          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-slate-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                            {item.title}
                          </div>
                        )}
                      </NavLink>
                    ))}
                  </div>
                  
                  {sectionIndex < adminNavigationItems.length - 1 && (
                    <Separator className="mt-4 dark:bg-slate-800" />
                  )}
                </div>
              ))}
            </nav>
          </ScrollArea>

          {/* User Profile Section */}
          <div className="border-t dark:border-slate-800 p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start p-3 h-auto hover:bg-gray-50 dark:hover:bg-slate-800",
                    isCollapsed && "justify-center px-2"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-avatar.jpg" />
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-semibold">
                        AD
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
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">Admin User</p>
                            <Shield className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                          </div>
                          <p className="text-xs text-gray-500 dark:text-slate-400 truncate">Administrator</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="w-56 dark:bg-slate-800 dark:border-slate-700">
                <DropdownMenuItem asChild>
                  <NavLink to="/admin/settings" className="flex items-center dark:text-slate-200">
                    <User className="mr-2 h-4 w-4" />
                    Admin Profile
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink to="/admin/settings" className="flex items-center dark:text-slate-200">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="dark:bg-slate-700" />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
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
