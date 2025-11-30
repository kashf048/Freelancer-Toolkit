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

const AdminUsers = () => {
  const {
    users,
    userFilters,
    setUsers,
    setUserFilters,
    deleteUser,
    toggleUserStatus,
    updateUserRole,
  } = useAdminStore();

  const [selectedUser, setSelectedUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [userFilters]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await adminApi.getUsers(userFilters);
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to fetch users');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    setUserFilters({ search: e.target.value, page: 1 });
  };

  const handleRoleChange = (userId, newRole) => {
    updateUserRole(userId, newRole);
    toast.success('User role updated');
  };

  const handleToggleStatus = (userId) => {
    toggleUserStatus(userId);
    toast.success('User status updated');
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminApi.deleteUser(userId);
        deleteUser(userId);
        toast.success('User deleted successfully');
      } catch (error) {
        toast.error('Failed to delete user');
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Users Management</h1>
        <p className="text-gray-600 dark:text-slate-400 mt-2">
          Manage user accounts, roles, and permissions
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
                    placeholder="Search users..."
                    value={userFilters.search}
                    onChange={handleSearch}
                    className="pl-10 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  />
                </div>

                <Select value={userFilters.role} onValueChange={(value) => setUserFilters({ role: value, page: 1 })}>
                  <SelectTrigger className="w-32 dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-slate-700 dark:border-slate-600">
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={userFilters.status} onValueChange={(value) => setUserFilters({ status: value, page: 1 })}>
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
                Add User
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Users Table */}
      <motion.div variants={itemVariants}>
        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardHeader>
            <CardTitle>Users List</CardTitle>
            <CardDescription className="dark:text-slate-400">
              {users.length} users found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="dark:border-slate-700 hover:bg-transparent">
                    <TableHead className="dark:text-slate-300">Name</TableHead>
                    <TableHead className="dark:text-slate-300">Email</TableHead>
                    <TableHead className="dark:text-slate-300">Role</TableHead>
                    <TableHead className="dark:text-slate-300">Status</TableHead>
                    <TableHead className="dark:text-slate-300">Joined</TableHead>
                    <TableHead className="dark:text-slate-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan="6" className="text-center py-8 text-gray-500 dark:text-slate-400">
                        Loading users...
                      </TableCell>
                    </TableRow>
                  ) : users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan="6" className="text-center py-8 text-gray-500 dark:text-slate-400">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id} className="dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700">
                        <TableCell className="font-medium text-gray-900 dark:text-white">{user.name}</TableCell>
                        <TableCell className="text-gray-600 dark:text-slate-400">{user.email}</TableCell>
                        <TableCell>
                          <Select value={user.role} onValueChange={(value) => handleRoleChange(user.id, value)}>
                            <SelectTrigger className="w-24 h-8 text-xs dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="dark:bg-slate-700 dark:border-slate-600">
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={user.active ? 'default' : 'secondary'}
                            className={user.active ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}
                          >
                            {user.active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600 dark:text-slate-400">{user.createdAt}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog open={isDialogOpen && selectedUser?.id === user.id} onOpenChange={setIsDialogOpen}>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedUser(user)}
                                  className="dark:text-blue-400 dark:hover:bg-slate-700"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="dark:bg-slate-800 dark:border-slate-700">
                                <DialogHeader>
                                  <DialogTitle className="dark:text-white">User Details</DialogTitle>
                                  <DialogDescription className="dark:text-slate-400">
                                    Full profile information for {selectedUser?.name}
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedUser && (
                                  <div className="space-y-4">
                                    <div>
                                      <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Name</p>
                                      <p className="text-gray-900 dark:text-white">{selectedUser.name}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Email</p>
                                      <p className="text-gray-900 dark:text-white">{selectedUser.email}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Role</p>
                                      <p className="text-gray-900 dark:text-white capitalize">{selectedUser.role}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Status</p>
                                      <p className="text-gray-900 dark:text-white">{selectedUser.active ? 'Active' : 'Inactive'}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Subscription Plan</p>
                                      <p className="text-gray-900 dark:text-white">{selectedUser.subscriptionPlan}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Joined</p>
                                      <p className="text-gray-900 dark:text-white">{selectedUser.createdAt}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Last Login</p>
                                      <p className="text-gray-900 dark:text-white">{selectedUser.lastLogin}</p>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleStatus(user.id)}
                              className="dark:text-yellow-400 dark:hover:bg-slate-700"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
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

export default AdminUsers;
