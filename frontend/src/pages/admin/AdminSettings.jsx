import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Switch } from '../../components/ui/switch';
import { Label } from '../../components/ui/label';
import { Separator } from '../../components/ui/separator';
import { useThemeStore } from '../../stores/themeStore';
import { useAdminStore } from '../../stores/adminStore';
import toast from 'react-hot-toast';

const AdminSettings = () => {
  const { theme, toggleTheme } = useThemeStore();
  const { settings, toggleFeature } = useAdminStore();
  const [localFeatures, setLocalFeatures] = useState(settings.featureToggles || {});

  const handleFeatureToggle = (featureName) => {
    toggleFeature(featureName);
    setLocalFeatures((prev) => ({
      ...prev,
      [featureName]: !prev[featureName],
    }));
    toast.success(`${featureName} ${!localFeatures[featureName] ? 'enabled' : 'disabled'}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const features = [
    {
      id: 'invoiceGenerator',
      name: 'Invoice Generator',
      description: 'Allow users to generate professional invoices',
    },
    {
      id: 'timeTracker',
      name: 'Time Tracker',
      description: 'Enable time tracking and billable hours feature',
    },
    {
      id: 'proposalBuilder',
      name: 'Proposal Builder',
      description: 'Allow users to create professional proposals',
    },
    {
      id: 'contractManager',
      name: 'Contract Manager',
      description: 'Enable contract management and storage',
    },
    {
      id: 'expenseTracker',
      name: 'Expense Tracker',
      description: 'Allow users to track business expenses',
    },
    {
      id: 'analytics',
      name: 'Analytics Dashboard',
      description: 'Enable advanced analytics and reporting',
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Settings</h1>
        <p className="text-gray-600 dark:text-slate-400 mt-2">
          Configure system settings and feature toggles
        </p>
      </motion.div>

      {/* Theme Settings */}
      <motion.div variants={itemVariants}>
        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardHeader>
            <CardTitle>Theme Settings</CardTitle>
            <CardDescription className="dark:text-slate-400">
              Customize the appearance of the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium text-gray-900 dark:text-white">
                  Dark Mode
                </Label>
                <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                  Toggle between light and dark theme
                </p>
              </div>
              <Button
                variant="outline"
                size="lg"
                onClick={toggleTheme}
                className="gap-2 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:hover:bg-slate-600"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="h-4 w-4" />
                    Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4" />
                    Dark Mode
                  </>
                )}
              </Button>
            </div>

            <Separator className="dark:bg-slate-700" />

            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-900 dark:text-blue-200">
                Current theme: <span className="font-semibold capitalize">{theme}</span>
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                Theme preference is saved locally and synced across all pages
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Feature Toggles */}
      <motion.div variants={itemVariants}>
        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardHeader>
            <CardTitle>Feature Toggles</CardTitle>
            <CardDescription className="dark:text-slate-400">
              Enable or disable features for all users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {features.map((feature) => (
                <div key={feature.id} className="flex items-center justify-between py-4 border-b dark:border-slate-700 last:border-0">
                  <div className="flex-1">
                    <Label className="text-base font-medium text-gray-900 dark:text-white cursor-pointer">
                      {feature.name}
                    </Label>
                    <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                      {feature.description}
                    </p>
                  </div>
                  <Switch
                    checked={localFeatures[feature.id] || false}
                    onCheckedChange={() => handleFeatureToggle(feature.id)}
                    className="ml-4"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* System Information */}
      <motion.div variants={itemVariants}>
        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardHeader>
            <CardTitle>System Information</CardTitle>
            <CardDescription className="dark:text-slate-400">
              Current system status and configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Version</p>
                <p className="text-gray-900 dark:text-white">1.0.0</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Environment</p>
                <p className="text-gray-900 dark:text-white">Production</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Last Updated</p>
                <p className="text-gray-900 dark:text-white">2024-11-14</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Status</p>
                <p className="text-green-600 dark:text-green-400 font-medium">Operational</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Danger Zone */}
      <motion.div variants={itemVariants}>
        <Card className="border-red-200 dark:border-red-900 dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
            <CardDescription className="dark:text-slate-400">
              Irreversible and destructive actions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="destructive" className="w-full">
              Clear All Cache
            </Button>
            <Button variant="destructive" className="w-full">
              Reset System
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AdminSettings;
