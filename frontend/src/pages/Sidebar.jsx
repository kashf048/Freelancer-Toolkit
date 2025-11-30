import React, { useState } from 'react';
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
  Crown
} from 'lucide-react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { cn } from '../../lib/utils';
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

const Sidebar = ({ isOpen, onClose, className = '' }) => {
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
          'fixed left-0 top-0 z-50 h-full transform border-r bg-white/95 backdrop-blur-xl shadow-xl transition-transform duration-300 ease-in-out md:relative md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          className
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b">
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

            {/* Desktop collapse toggle */}
            <div className="hidden md:flex">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleToggleCollapse}
                className="h-8 w-8 hover:bg-gray-100"
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
              {navigationItems.map((section, sectionIndex) => (
                <div key={section.title}>
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.h3
                        variants={contentVariants}
                        initial="collapsed"
                        animate="expanded"
                        exit="collapsed"
                        className="mb-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
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
                          // Close mobile sidebar when navigating
                          if (window.innerWidth < 768) {
                            onClose();
                          }
                        }}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-blue-50 hover:text-blue-700 group relative',
                            isActive
                              ? 'bg-blue-100 text-blue-700 shadow-sm border-l-4 border-blue-600'
                              : 'text-gray-600 hover:text-blue-700',
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
                          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                            {item.title}
                          </div>
                        )}
                      </NavLink>
                    ))}
                  </div>
                  
                  {sectionIndex < navigationItems.length - 1 && (
                    <Separator className="mt-4" />
                  )}
                </div>
              ))}
            </nav>
          </ScrollArea>

          {/* User Profile Section */}
          <div className="border-t p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start p-3 h-auto hover:bg-gray-50",
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
                            <p className="text-sm font-medium text-gray-900 truncate">John Doe</p>
                            <Crown className="h-3 w-3 text-yellow-500" />
                          </div>
                          <p className="text-xs text-gray-500 truncate">Premium Plan</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <NavLink to="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink to="/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
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

export default Sidebar;

