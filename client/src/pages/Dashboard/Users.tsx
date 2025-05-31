'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState({});
  const [departmentList, setDepartmentList] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await Promise.all([fetchUsers(), fetchDepartments()]);
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/users', {
        withCredentials: true,
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const handleToggle = async (id) => {
    try {
      await axios.put(`http://localhost:8000/api/users/${id}/toggle`, {}, {
        withCredentials: true,
      });
      fetchUsers();
    } catch (err) {
      console.error('Toggle failed:', err.response?.data || err.message);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/departments', {
        withCredentials: true,
      });
      setDepartmentList(res.data);
      const map = {};
      res.data.forEach((dept) => {
        map[dept._id] = dept.name;
      });
      setDepartments(map);
    } catch (err) {
      console.error('Failed to fetch departments:', err);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    let department = null;
    if (newRole === 'department') {
      department = prompt('Enter Department ID (or implement a better UI)');
      if (!department) return alert('Department ID is required');
    }

    try {
      await axios.put(
        `http://localhost:8000/api/users/${id}/role`,
        { role: newRole, ...(department && { department }) },
        { withCredentials: true }
      );
      setUsers((prev) =>
        prev.map((user) =>
          user._id === id
            ? { ...user, role: newRole, department: department || null }
            : user
        )
      );
    } catch (err) {
      console.error('Failed to update role:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`http://localhost:8000/api/users/${id}`, {
        withCredentials: true,
      });
      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      <div className="overflow-x-auto rounded-lg shadow border bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Name</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Email</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Role</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Department</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50 transition">
                <td className="p-4">{user.username || 'N/A'}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">
                  <Select
                    defaultValue={user.role}
                    onValueChange={(val) => {
                      if (val !== user.role) handleRoleChange(user._id, val);
                    }}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="citizen">Citizen</SelectItem>
                      <SelectItem value="department">Department</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-4">
                  {user.department ? departments[user.department] || 'Unknown' : '—'}
                </td>
                <td className="p-4">
                  <Badge variant={user.isActive ? 'default' : 'secondary'}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </td>
                <td className="p-4 space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggle(user._id)}
                  >
                    {user.isActive ? 'Deactivate' : 'Reactivate'}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersPage;
