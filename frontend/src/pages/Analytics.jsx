import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
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
  Legend
} from 'recharts';
import { projectsAPI, clientsAPI, invoicesAPI } from '../utils/api';
import toast from 'react-hot-toast';

const Analytics = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [invoiceStatusData, setInvoiceStatusData] = useState([]);
  const [projectStatusData, setProjectStatusData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const [projectStats, clientStats, invoiceStats] = await Promise.all([
        projectsAPI.getStats(),
        clientsAPI.getStats(),
        invoicesAPI.getStats()
      ]);

      // Revenue Data (mock for now, replace with real data from backend)
      setRevenueData([
        { month: 'Jan', revenue: 18500, expenses: 12000 },
        { month: 'Feb', revenue: 22000, expenses: 13500 },
        { month: 'Mar', revenue: 19800, expenses: 11800 },
        { month: 'Apr', revenue: 26500, expenses: 15200 },
        { month: 'May', revenue: 24200, expenses: 14100 },
        { month: 'Jun', revenue: 28900, expenses: 16800 },
      ]);

      // Invoice Status Data
      setInvoiceStatusData([
        { name: 'Paid', value: invoiceStats.data.paid_invoices || 0, color: '#10b981' },
        { name: 'Pending', value: invoiceStats.data.pending_invoices || 0, color: '#f59e0b' },
        { name: 'Overdue', value: invoiceStats.data.overdue_invoices || 0, color: '#ef4444' },
      ]);

      // Project Status Data
      setProjectStatusData([
        { name: 'Completed', value: projectStats.data.completed_projects || 0, color: '#10b981' },
        { name: 'In Progress', value: projectStats.data.active_projects || 0, color: '#3b82f6' },
        { name: 'Planning', value: projectStats.data.total_projects - projectStats.data.completed_projects - projectStats.data.active_projects || 0, color: '#f59e0b' },
        { name: 'On Hold', value: 0, color: '#ef4444' }, // Placeholder
      ]);

    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast.error('Failed to load analytics data.');
      // Fallback to mock data if API fails
      setRevenueData([
        { month: 'Jan', revenue: 18500, expenses: 12000 },
        { month: 'Feb', revenue: 22000, expenses: 13500 },
        { month: 'Mar', revenue: 19800, expenses: 11800 },
        { month: 'Apr', revenue: 26500, expenses: 15200 },
        { month: 'May', revenue: 24200, expenses: 14100 },
        { month: 'Jun', revenue: 28900, expenses: 16800 },
      ]);
      setInvoiceStatusData([
        { name: 'Paid', value: 70, color: '#10b981' },
        { name: 'Pending', value: 20, color: '#f59e0b' },
        { name: 'Overdue', value: 10, color: '#ef4444' },
      ]);
      setProjectStatusData([
        { name: 'Completed', value: 45, color: '#10b981' },
        { name: 'In Progress', value: 30, color: '#3b82f6' },
        { name: 'Planning', value: 15, color: '#f59e0b' },
        { name: 'On Hold', value: 10, color: '#ef4444' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="h-96 bg-gray-300 rounded-xl"></div>
            <div className="h-96 bg-gray-300 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Detailed insights and analytics for your business.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Overview Chart */}
        <Card className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:transform hover:-translate-y-1">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue and expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="expenses" stroke="#ef4444" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Invoice Status Chart */}
        <Card className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:transform hover:-translate-y-1">
          <CardHeader>
            <CardTitle>Invoice Status Breakdown</CardTitle>
            <CardDescription>Distribution of invoices by status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={invoiceStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {invoiceStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Project Status Chart */}
        <Card className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:transform hover:-translate-y-1">
          <CardHeader>
            <CardTitle>Project Status Breakdown</CardTitle>
            <CardDescription>Distribution of projects by status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectStatusData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="value" fill="#8884d8">
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;


