import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit2, Eye, Plus, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { useAdminStore } from '../../stores/adminStore';
import { adminApi } from '../../services/adminApi';
import toast from 'react-hot-toast';

const AdminTools = () => {
  const {
    tools,
    categories,
    toolFilters,
    setTools,
    setCategories,
    setToolFilters,
    deleteTool,
    toggleToolStatus,
  } = useAdminStore();

  const [selectedTool, setSelectedTool] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTools();
    fetchCategories();
  }, [toolFilters]);

  const fetchTools = async () => {
    try {
      setIsLoading(true);
      const response = await adminApi.getTools(toolFilters);
      setTools(response.data);
    } catch (error) {
      toast.error('Failed to fetch tools');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await adminApi.getCategories();
      setCategories(response);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleSearch = (e) => {
    setToolFilters({ search: e.target.value, page: 1 });
  };

  const handleToggleStatus = (toolId) => {
    toggleToolStatus(toolId);
    toast.success('Tool status updated');
  };

  const handleDeleteTool = async (toolId) => {
    if (window.confirm('Are you sure you want to delete this tool?')) {
      try {
        await adminApi.deleteTool(toolId);
        deleteTool(toolId);
        toast.success('Tool deleted successfully');
      } catch (error) {
        toast.error('Failed to delete tool');
      }
    }
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tools Management</h1>
        <p className="text-gray-600 dark:text-slate-400 mt-2">
          Manage available tools, categories, and access control
        </p>
      </motion.div>

      {/* Filters and Actions */}
      <motion.div variants={itemVariants}>
        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="flex-1 flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search tools..."
                    value={toolFilters.search}
                    onChange={handleSearch}
                    className="pl-10 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  />
                </div>

                <Select value={toolFilters.category} onValueChange={(value) => setToolFilters({ category: value, page: 1 })}>
                  <SelectTrigger className="w-40 dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-slate-700 dark:border-slate-600">
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={toolFilters.status} onValueChange={(value) => setToolFilters({ status: value, page: 1 })}>
                  <SelectTrigger className="w-32 dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-slate-700 dark:border-slate-600">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600">
                <Plus className="h-4 w-4 mr-2" />
                Add Tool
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tools Table */}
      <motion.div variants={itemVariants}>
        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardHeader>
            <CardTitle>Tools List</CardTitle>
            <CardDescription className="dark:text-slate-400">
              {tools.length} tools available
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="dark:border-slate-700 hover:bg-transparent">
                    <TableHead className="dark:text-slate-300">Name</TableHead>
                    <TableHead className="dark:text-slate-300">Category</TableHead>
                    <TableHead className="dark:text-slate-300">Status</TableHead>
                    <TableHead className="dark:text-slate-300">Usage</TableHead>
                    <TableHead className="dark:text-slate-300">Created</TableHead>
                    <TableHead className="dark:text-slate-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan="6" className="text-center py-8 text-gray-500 dark:text-slate-400">
                        Loading tools...
                      </TableCell>
                    </TableRow>
                  ) : tools.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan="6" className="text-center py-8 text-gray-500 dark:text-slate-400">
                        No tools found
                      </TableCell>
                    </TableRow>
                  ) : (
                    tools.map((tool) => (
                      <TableRow key={tool.id} className="dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700">
                        <TableCell className="font-medium text-gray-900 dark:text-white">{tool.name}</TableCell>
                        <TableCell className="text-gray-600 dark:text-slate-400">{tool.category}</TableCell>
                        <TableCell>
                          <Badge
                            variant={tool.active ? 'default' : 'secondary'}
                            className={tool.active ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}
                          >
                            {tool.active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-slate-400">{tool.usageCount}</TableCell>
                        <TableCell className="text-sm text-gray-600 dark:text-slate-400">{tool.createdAt}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog open={isDialogOpen && selectedTool?.id === tool.id} onOpenChange={setIsDialogOpen}>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedTool(tool)}
                                  className="dark:text-blue-400 dark:hover:bg-slate-700"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="dark:bg-slate-800 dark:border-slate-700">
                                <DialogHeader>
                                  <DialogTitle className="dark:text-white">Tool Details</DialogTitle>
                                  <DialogDescription className="dark:text-slate-400">
                                    Full information for {selectedTool?.name}
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedTool && (
                                  <div className="space-y-4">
                                    <div>
                                      <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Name</p>
                                      <p className="text-gray-900 dark:text-white">{selectedTool.name}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Description</p>
                                      <p className="text-gray-900 dark:text-white">{selectedTool.description}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Category</p>
                                      <p className="text-gray-900 dark:text-white">{selectedTool.category}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Status</p>
                                      <p className="text-gray-900 dark:text-white">{selectedTool.active ? 'Active' : 'Inactive'}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Usage Count</p>
                                      <p className="text-gray-900 dark:text-white">{selectedTool.usageCount}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Created</p>
                                      <p className="text-gray-900 dark:text-white">{selectedTool.createdAt}</p>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleStatus(tool.id)}
                              className="dark:text-yellow-400 dark:hover:bg-slate-700"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTool(tool.id)}
                              className="dark:text-red-400 dark:hover:bg-slate-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AdminTools;
