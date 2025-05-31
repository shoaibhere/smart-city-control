'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from '@/components/ui/select';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState({});
  const [departmentList, setDepartmentList] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get('http://localhost:8000/api/users');
    setUsers(res.data);
  };

  const fetchDepartments = async () => {
    const res = await axios.get('http://localhost:8000/api/departments'); // Ensure this exists
    setDepartmentList(res.data);

    // Create a lookup table by department ID
    const map = {};
    res.data.forEach((dept) => {
      map[dept._id] = dept.name;
    });
    setDepartments(map);
  };

  const handleRoleChange = async (id, newRole) => {
    let department = null;

    if (newRole === 'department') {
      department = prompt('Enter Department ID (or implement a better UI)');
      if (!department) return alert('Department ID required for department role');
    }

    await axios.put(`http://localhost:8000/api/users/${id}/role`, {
      role: newRole,
      ...(department && { department })
    });

    fetchUsers();
  };

  const handleDeactivate = async (id) => {
    await axios.put(`http://localhost:8000/api/users/${id}/deactivate`);
    fetchUsers();
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this user?')) {
      await axios.delete(`http://localhost:8000/api/users/${id}`);
      fetchUsers();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Manage Users</h1>
      <div className="overflow-x-auto rounded-lg shadow border">
        <table className="min-w-full bg-white divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="p-3 text-left text-sm font-medium text-gray-500">Name</th>
              <th className="p-3 text-left text-sm font-medium text-gray-500">Email</th>
              <th className="p-3 text-left text-sm font-medium text-gray-500">Role</th>
              <th className="p-3 text-left text-sm font-medium text-gray-500">Department</th>
              <th className="p-3 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="p-3 text-left text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="p-3">{user.username}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">
                  <Select
                    defaultValue={user.role}
                    onValueChange={(val) => {
                      if (val !== user.role) handleRoleChange(user._id, val);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="citizen">Citizen</SelectItem>
                      <SelectItem value="department">Department</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-3">
                  {user.department ? (
                    departments[user.department] || 'Unknown'
                  ) : (
                    '-'
                  )}
                </td>
                <td className="p-3">
                  {user.isActive ? (
                    <span className="text-green-600 font-semibold">Active</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Inactive</span>
                  )}
                </td>
                <td className="p-3 space-x-2">
                  {user.isActive && (
                    <Button variant="outline" onClick={() => handleDeactivate(user._id)}>
                      Deactivate
                    </Button>
                  )}
                  <Button variant="destructive" onClick={() => handleDelete(user._id)}>
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
