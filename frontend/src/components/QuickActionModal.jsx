import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Users,
  Plus,
  X,
  Zap,
  Trash2
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { cn } from '../lib/utils';
import { useThemeStore } from '../stores/themeStore';
import toast from 'react-hot-toast';

const QUICK_ACTION_ICONS = [
  { id: 'invoice', label: 'Invoice', icon: FileText, color: 'bg-blue-500' },
  { id: 'client', label: 'Client', icon: Users, color: 'bg-green-500' },
  { id: 'project', label: 'Project', icon: Plus, color: 'bg-purple-500' },
  { id: 'document', label: 'Document', icon: FileText, color: 'bg-orange-500' },
  { id: 'task', label: 'Task', icon: Zap, color: 'bg-yellow-500' },
];

const QuickActionModal = ({ isOpen, onClose, onAddAction, existingActions = [] }) => {
  const { theme } = useThemeStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'invoice',
    action: ''
  });

  const isDark = theme === 'dark';

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!formData.action.trim()) {
      toast.error('Please enter an action');
      return;
    }

    const newAction = {
      id: `quick-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      icon: formData.icon,
      color: QUICK_ACTION_ICONS.find(i => i.id === formData.icon)?.color || 'bg-blue-500',
      action: formData.action
    };

    onAddAction(newAction);
    toast.success(`Quick action "${formData.title}" added!`);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      icon: 'invoice',
      action: ''
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "max-w-md",
        isDark ? 'bg-slate-800 border-slate-700' : ''
      )}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Add Quick Action
          </DialogTitle>
          <DialogDescription>
            Create a new quick action shortcut for your dashboard
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className={isDark ? 'text-slate-200' : ''}>
              Action Title
            </Label>
            <Input
              id="title"
              placeholder="e.g., Create Invoice"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={cn(
                isDark ? 'bg-slate-700 border-slate-600 text-slate-100' : ''
              )}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className={isDark ? 'text-slate-200' : ''}>
              Description (Optional)
            </Label>
            <Input
              id="description"
              placeholder="e.g., Generate a new invoice"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={cn(
                isDark ? 'bg-slate-700 border-slate-600 text-slate-100' : ''
              )}
            />
          </div>

          {/* Icon Selection */}
          <div className="space-y-2">
            <Label className={isDark ? 'text-slate-200' : ''}>
              Icon
            </Label>
            <div className="grid grid-cols-5 gap-2">
              {QUICK_ACTION_ICONS.map((iconOption) => {
                const IconComponent = iconOption.icon;
                const isSelected = formData.icon === iconOption.id;
                return (
                  <motion.button
                    key={iconOption.id}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleInputChange('icon', iconOption.id)}
                    className={cn(
                      "p-3 rounded-lg transition-all flex items-center justify-center",
                      isSelected
                        ? `${iconOption.color} text-white shadow-lg`
                        : isDark
                        ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                      "border-2",
                      isSelected ? 'border-white' : isDark ? 'border-slate-600' : 'border-transparent'
                    )}
                    title={iconOption.label}
                  >
                    <IconComponent className="h-5 w-5" />
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Action Type */}
          <div className="space-y-2">
            <Label htmlFor="action" className={isDark ? 'text-slate-200' : ''}>
              Action Type
            </Label>
            <Select value={formData.action} onValueChange={(value) => handleInputChange('action', value)}>
              <SelectTrigger className={cn(
                isDark ? 'bg-slate-700 border-slate-600 text-slate-100' : ''
              )}>
                <SelectValue placeholder="Select an action" />
              </SelectTrigger>
              <SelectContent className={isDark ? 'bg-slate-700 border-slate-600' : ''}>
                <SelectItem value="create-invoice">Create Invoice</SelectItem>
                <SelectItem value="add-client">Add Client</SelectItem>
                <SelectItem value="new-project">New Project</SelectItem>
                <SelectItem value="generate-document">Generate Document</SelectItem>
                <SelectItem value="schedule-meeting">Schedule Meeting</SelectItem>
                <SelectItem value="send-proposal">Send Proposal</SelectItem>
                <SelectItem value="view-reports">View Reports</SelectItem>
                <SelectItem value="manage-payments">Manage Payments</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              <Plus className="mr-2 h-4 w-4" />
              Add Action
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </form>

        {/* Existing Actions Preview */}
        {existingActions.length > 0 && (
          <div className={cn(
            "mt-6 pt-6 border-t",
            isDark ? 'border-slate-700' : 'border-gray-200'
          )}>
            <p className={cn(
              "text-sm font-medium mb-3",
              isDark ? 'text-slate-200' : 'text-gray-700'
            )}>
              Your Quick Actions ({existingActions.length})
            </p>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {existingActions.map((action) => (
                <div
                  key={action.id}
                  className={cn(
                    "flex items-center justify-between p-2 rounded-lg text-sm",
                    isDark ? 'bg-slate-700' : 'bg-gray-100'
                  )}
                >
                  <span className={isDark ? 'text-slate-200' : 'text-gray-700'}>
                    {action.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuickActionModal;
