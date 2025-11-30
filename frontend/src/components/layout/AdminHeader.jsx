import React from 'react';
import { Menu, Moon, Sun, Bell } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { useThemeStore } from '../../stores/themeStore';

const AdminHeader = ({ onMenuClick, sidebarOpen, isMobile }) => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="sticky top-0 z-30 border-b bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl dark:border-slate-800">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left side - Menu button */}
        <div className="flex items-center gap-4">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Admin Dashboard</h1>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </Button>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
