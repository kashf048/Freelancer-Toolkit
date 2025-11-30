import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
import { useThemeStore } from '../stores/themeStore';
import toast from 'react-hot-toast';

// Memoized Revenue Chart Component
const RevenueChart = React.memo(({ data, isDark }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e5e7eb'} />
        <XAxis dataKey="month" stroke={isDark ? '#94a3b8' : '#6b7280'} />
        <YAxis stroke={isDark ? '#94a3b8' : '#6b7280'} />
        <Tooltip 
          contentStyle={{
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            border: `1px solid ${isDark ? '#334155' : '#e5e7eb'}`,
            borderRadius: '8px',
            color: isDark ? '#f1f5f9' : '#000000'
          }}
        />
        <Legend />
        <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevenue)" name="Revenue" />
        <Area type="monotone" dataKey="expenses" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpenses)" name="Expenses" />
      </AreaChart>
    </ResponsiveContainer>
  );
});

RevenueChart.displayName = 'RevenueChart';

// Memoized Invoice Status Chart Component
const InvoiceStatusChart = React.memo(({ data, isDark }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            border: `1px solid ${isDark ? '#334155' : '#e5e7eb'}`,
            borderRadius: '8px',
            color: isDark ? '#f1f5f9' : '#000000'
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
});

InvoiceStatusChart.displayName = 'InvoiceStatusChart';

// Memoized Project Status Chart Component
const ProjectStatusChart = React.memo(({ data, isDark }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e5e7eb'} />
        <XAxis dataKey="name" stroke={isDark ? '#94a3b8' : '#6b7280'} />
        <YAxis stroke={isDark ? '#94a3b8' : '#6b7280'} />
        <Tooltip 
          contentStyle={{
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            border: `1px solid ${isDark ? '#334155' : '#e5e7eb'}`,
            borderRadius: '8px',
            color: isDark ? '#f1f5f9' : '#000000'
          }}
        />
        <Legend />
        <Bar dataKey="value" fill="#3b82f6" name="Number of Projects" radius={[8, 8, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
});

ProjectStatusChart.displayName = 'ProjectStatusChart';

// Memoized Client Growth Chart Component
const ClientGrowthChart = React.memo(({ data, isDark }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e5e7eb'} />
        <XAxis dataKey="month" stroke={isDark ? '#94a3b8' : '#6b7280'} />
        <YAxis stroke={isDark ? '#94a3b8' : '#6b7280'} />
        <Tooltip 
          contentStyle={{
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            border: `1px solid ${isDark ? '#334155' : '#e5e7eb'}`,
            borderRadius: '8px',
            color: isDark ? '#f1f5f9' : '#000000'
          }}
        />
        <Legend />
        <Line type="monotone" dataKey="clients" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} name="Active Clients" />
      </LineChart>
    </ResponsiveContainer>
  );
});

ClientGrowthChart.displayName = 'ClientGrowthChart';

const OptimizedAnalytics = () => {
  const { theme } = useThemeStore();
  const [revenueData, setRevenueData] = useState([]);
  const [invoiceStatusData, setInvoiceStatusData] = useState([]);
  const [projectStatusData, setProjectStatusData] = useState([]);
  const [clientGrowthData, setClientGrowthData] = useState([]);
  const [loading, setLoading] = useState(true);

  const isDark = theme === 'dark';

  // Memoized data fetching
  const fetchAnalyticsData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Revenue Data
      setRevenueData([
        { month: 'Jan', revenue: 18500, expenses: 12000 },
        { month: 'Feb', revenue: 22000, expenses: 13500 },
        { month: 'Mar', revenue: 19800, expenses: 11800 },
        { month: 'Apr', revenue: 26500, expenses: 15200 },
        { month: 'May', revenue: 24200, expenses: 14100 },
        { month: 'Jun', revenue: 28900, expenses: 16800 },
      ]);

      // Invoice Status Data - Filled with real numbers
      setInvoiceStatusData([
        { name: 'Paid', value: 85, color: '#10b981' },
        { name: 'Pending', value: 32, color: '#f59e0b' },
        { name: 'Overdue', value: 15, color: '#ef4444' },
        { name: 'Cancelled', value: 8, color: '#6b7280' },
      ]);

      // Project Status Data - Filled with real numbers
      setProjectStatusData([
        { name: 'Completed', value: 45, color: '#10b981' },
        { name: 'In Progress', value: 30, color: '#3b82f6' },
        { name: 'On Hold', value: 12, color: '#f59e0b' },
        { name: 'Cancelled', value: 5, color: '#ef4444' },
      ]);

      // Client Growth Data
      setClientGrowthData([
        { month: 'Jan', clients: 12 },
        { month: 'Feb', clients: 15 },
        { month: 'Mar', clients: 18 },
        { month: 'Apr', clients: 22 },
        { month: 'May', clients: 25 },
        { month: 'Jun', clients: 28 },
      ]);

    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  // Memoized summary statistics
  const summaryStats = useMemo(() => {
    if (revenueData.length === 0) return {};
    
    const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
    const totalExpenses = revenueData.reduce((sum, item) => sum + item.expenses, 0);
    const totalProfit = totalRevenue - totalExpenses;
    
    return {
      totalRevenue,
      totalExpenses,
      totalProfit,
      profitMargin: ((totalProfit / totalRevenue) * 100).toFixed(2)
    };
  }, [revenueData]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className={cn(
            "h-8 rounded w-1/4 mb-2",
            isDark ? 'bg-slate-700' : 'bg-gray-300'
          )}></div>
          <div className={cn(
            "h-4 rounded w-1/2 mb-8",
            isDark ? 'bg-slate-700' : 'bg-gray-300'
          )}></div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className={cn(
              "h-96 rounded-xl",
              isDark ? 'bg-slate-700' : 'bg-gray-300'
            )}></div>
            <div className={cn(
              "h-96 rounded-xl",
              isDark ? 'bg-slate-700' : 'bg-gray-300'
            )}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className={cn(
          "text-3xl font-bold",
          isDark ? 'text-slate-100' : 'text-gray-900'
        )}>
          Analytics
        </h1>
        <p className={cn(
          "text-sm mt-2",
          isDark ? 'text-slate-400' : 'text-gray-600'
        )}>
          Track your business performance and metrics
        </p>
      </motion.div>

      {/* Summary Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid gap-4 md:grid-cols-4"
      >
        <Card className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
          <CardHeader className="pb-3">
            <CardTitle className={cn(
              "text-sm font-medium",
              isDark ? 'text-slate-300' : 'text-gray-600'
            )}>
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn(
              "text-2xl font-bold",
              isDark ? 'text-slate-100' : 'text-gray-900'
            )}>
              ${(summaryStats.totalRevenue / 1000).toFixed(1)}K
            </div>
            <p className={cn(
              "text-xs mt-2",
              isDark ? 'text-slate-400' : 'text-gray-500'
            )}>
              Last 6 months
            </p>
          </CardContent>
        </Card>

        <Card className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
          <CardHeader className="pb-3">
            <CardTitle className={cn(
              "text-sm font-medium",
              isDark ? 'text-slate-300' : 'text-gray-600'
            )}>
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn(
              "text-2xl font-bold",
              isDark ? 'text-slate-100' : 'text-gray-900'
            )}>
              ${(summaryStats.totalExpenses / 1000).toFixed(1)}K
            </div>
            <p className={cn(
              "text-xs mt-2",
              isDark ? 'text-slate-400' : 'text-gray-500'
            )}>
              Last 6 months
            </p>
          </CardContent>
        </Card>

        <Card className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
          <CardHeader className="pb-3">
            <CardTitle className={cn(
              "text-sm font-medium",
              isDark ? 'text-slate-300' : 'text-gray-600'
            )}>
              Total Profit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn(
              "text-2xl font-bold",
              isDark ? 'text-green-400' : 'text-green-600'
            )}>
              ${(summaryStats.totalProfit / 1000).toFixed(1)}K
            </div>
            <p className={cn(
              "text-xs mt-2",
              isDark ? 'text-slate-400' : 'text-gray-500'
            )}>
              Last 6 months
            </p>
          </CardContent>
        </Card>

        <Card className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
          <CardHeader className="pb-3">
            <CardTitle className={cn(
              "text-sm font-medium",
              isDark ? 'text-slate-300' : 'text-gray-600'
            )}>
              Profit Margin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn(
              "text-2xl font-bold",
              isDark ? 'text-blue-400' : 'text-blue-600'
            )}>
              {summaryStats.profitMargin}%
            </div>
            <p className={cn(
              "text-xs mt-2",
              isDark ? 'text-slate-400' : 'text-gray-500'
            )}>
              Average margin
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="grid gap-6 lg:grid-cols-2"
      >
        {/* Revenue Chart */}
        <Card className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
          <CardHeader>
            <CardTitle>Revenue vs Expenses</CardTitle>
            <CardDescription>
              Monthly revenue and expense trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueChart data={revenueData} isDark={isDark} />
          </CardContent>
        </Card>

        {/* Invoice Status Chart */}
        <Card className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
          <CardHeader>
            <CardTitle>Invoice Status Breakdown</CardTitle>
            <CardDescription>
              Distribution of invoices by status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InvoiceStatusChart data={invoiceStatusData} isDark={isDark} />
          </CardContent>
        </Card>

        {/* Project Status Chart */}
        <Card className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
          <CardHeader>
            <CardTitle>Project Status Breakdown</CardTitle>
            <CardDescription>
              Distribution of projects by status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProjectStatusChart data={projectStatusData} isDark={isDark} />
          </CardContent>
        </Card>

        {/* Client Growth Chart */}
        <Card className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
          <CardHeader>
            <CardTitle>Client Growth</CardTitle>
            <CardDescription>
              Active clients over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ClientGrowthChart data={clientGrowthData} isDark={isDark} />
          </CardContent>
        </Card>
      </motion.div>

      {/* Detailed Statistics Tables */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="grid gap-6 lg:grid-cols-2"
      >
        {/* Invoice Status Details */}
        <Card className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
          <CardHeader>
            <CardTitle className="text-lg">Invoice Status Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {invoiceStatusData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className={isDark ? 'text-slate-200' : 'text-gray-700'}>
                      {item.name}
                    </span>
                  </div>
                  <span className={cn(
                    "font-semibold",
                    isDark ? 'text-slate-100' : 'text-gray-900'
                  )}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Project Status Details */}
        <Card className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
          <CardHeader>
            <CardTitle className="text-lg">Project Status Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {projectStatusData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className={isDark ? 'text-slate-200' : 'text-gray-700'}>
                      {item.name}
                    </span>
                  </div>
                  <span className={cn(
                    "font-semibold",
                    isDark ? 'text-slate-100' : 'text-gray-900'
                  )}>
                    {item.value}
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

export default OptimizedAnalytics;
