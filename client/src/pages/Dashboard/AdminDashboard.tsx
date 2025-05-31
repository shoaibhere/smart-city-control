
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ClipboardList, Vote, FileText, TrendingUp, MapPin } from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    { label: 'Total Users', value: '2,847', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Issues', value: '156', icon: ClipboardList, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Active Polls', value: '12', icon: Vote, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Reports Filed', value: '89', icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const recentIssues = [
    { id: 1, title: 'Pothole on Main Street', status: 'In Progress', department: 'Roads', priority: 'High' },
    { id: 2, title: 'Broken Streetlight', status: 'Assigned', department: 'Electrical', priority: 'Medium' },
    { id: 3, title: 'Garbage Collection Delay', status: 'Pending', department: 'Sanitation', priority: 'Low' },
    { id: 4, title: 'Park Maintenance Required', status: 'Resolved', department: 'Parks', priority: 'Medium' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Assigned': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Admin Overview</h2>
        <p className="text-gray-600">Monitor and manage your smart city operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Issues */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Recent Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentIssues.map((issue) => (
                <div key={issue.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{issue.title}</h4>
                    <p className="text-sm text-gray-600">{issue.department}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(issue.priority)}`}>
                      {issue.priority}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(issue.status)}`}>
                      {issue.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-blue-50 rounded-lg text-left hover:bg-blue-100 transition-colors">
                <Users className="h-6 w-6 text-blue-600 mb-2" />
                <p className="font-medium text-gray-900">Manage Users</p>
                <p className="text-sm text-gray-600">Add or modify user roles</p>
              </button>
              <button className="p-4 bg-green-50 rounded-lg text-left hover:bg-green-100 transition-colors">
                <Vote className="h-6 w-6 text-green-600 mb-2" />
                <p className="font-medium text-gray-900">Create Poll</p>
                <p className="text-sm text-gray-600">Engage with citizens</p>
              </button>
              <button className="p-4 bg-purple-50 rounded-lg text-left hover:bg-purple-100 transition-colors">
                <FileText className="h-6 w-6 text-purple-600 mb-2" />
                <p className="font-medium text-gray-900">View Reports</p>
                <p className="text-sm text-gray-600">Department insights</p>
              </button>
              <button className="p-4 bg-orange-50 rounded-lg text-left hover:bg-orange-100 transition-colors">
                <MapPin className="h-6 w-6 text-orange-600 mb-2" />
                <p className="font-medium text-gray-900">City Map</p>
                <p className="text-sm text-gray-600">View issue locations</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
