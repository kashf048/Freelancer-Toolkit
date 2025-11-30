import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Wrench, TrendingUp, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { useAdminStore } from '../../stores/adminStore';
import { adminApi } from '../../services/adminApi';

const AdminDashboard = () => {
  const { users, tools, analytics, setUsers, setTools, setAnalytics, setAnalyticsLoading } = useAdminStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setAnalyticsLoading(true);
        
        // Fetch users
        const usersResponse = await adminApi.getUsers();
        setUsers(usersResponse.data);

        // Fetch tools
        const toolsResponse = await adminApi.getTools();
        setTools(toolsResponse.data);

        // Fetch analytics
        const analyticsData = await adminApi.getAnalytics();
        setAnalytics(analyticsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setAnalyticsLoading(false);
      }
    };

    fetchData();
  }, [setUsers, setTools, setAnalytics, setAnalyticsLoading]);

  const stats = [
    {
      title: 'Total Users',
      value: users.length,
      icon: Users,
      color: 'bg-blue-500',
      change: '+2.5%',
    },
    {
      title: 'Active Users',
      value: users.filter((u) => u.active).length,
      icon: Activity,
      color: 'bg-green-500',
      change: '+1.2%',
    },
    {
      title: 'Total Tools',
      value: tools.length,
      icon: Wrench,
      color: 'bg-purple-500',
      change: '+0.5%',
    },
    {
      title: 'Tool Usage',
      value: tools.reduce((sum, t) => sum + t.usageCount, 0),
      icon: TrendingUp,
      color: 'bg-orange-500',
      change: '+5.3%',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-slate-400 mt-2">
          Welcome to the admin panel. Monitor system activity and manage resources.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div key={index} variants={itemVariants}>
              <Card className="hover:shadow-lg transition-shadow dark:bg-slate-800 dark:border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-slate-400">
                    {stat.title}
                  </CardTitle>
                  <div className={`${stat.color} p-2 rounded-lg`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    {stat.change} from last month
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Recent Activity Section */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.5 }}
      >
        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription className="dark:text-slate-400">
              Latest system events and user actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'New user registered', time: '2 hours ago', type: 'user' },
                { action: 'Tool usage spike detected', time: '4 hours ago', type: 'tool' },
                { action: 'System backup completed', time: '6 hours ago', type: 'system' },
                { action: 'Admin settings updated', time: '1 day ago', type: 'settings' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b dark:border-slate-700 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      {activity.time}
                    </p>
                  </div>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    activity.type === 'user' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                    activity.type === 'tool' ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200' :
                    activity.type === 'system' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                    'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}>
                    {activity.type}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
