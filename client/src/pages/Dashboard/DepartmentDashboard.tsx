
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList, FileText, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DepartmentDashboard = () => {
  const stats = [
    { label: 'Assigned to Me', value: '23', icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'In Progress', value: '8', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Completed Today', value: '5', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Urgent Issues', value: '3', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  const assignedIssues = [
    { 
      id: 1, 
      title: 'Pothole Repair on Oak Avenue', 
      location: '123 Oak Ave', 
      priority: 'High', 
      status: 'Assigned',
      reportedAt: '2 hours ago'
    },
    { 
      id: 2, 
      title: 'Broken Traffic Signal', 
      location: 'Main St & 5th Ave', 
      priority: 'High', 
      status: 'In Progress',
      reportedAt: '4 hours ago'
    },
    { 
      id: 3, 
      title: 'Park Bench Repair', 
      location: 'Central Park', 
      priority: 'Medium', 
      status: 'Assigned',
      reportedAt: '1 day ago'
    },
    { 
      id: 4, 
      title: 'Streetlight Maintenance', 
      location: 'Elm Street', 
      priority: 'Low', 
      status: 'Assigned',
      reportedAt: '2 days ago'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
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

  const handleStatusUpdate = (issueId: number, newStatus: string) => {
    console.log(`Updating issue ${issueId} to ${newStatus}`);
    // API call would go here
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Department Overview</h2>
        <p className="text-gray-600">Manage your assigned issues and reports</p>
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

      {/* Assigned Issues */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Your Assigned Issues
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assignedIssues.map((issue) => (
              <div key={issue.id} className="p-6 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{issue.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{issue.location}</p>
                    <p className="text-xs text-gray-500">Reported {issue.reportedAt}</p>
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
                
                <div className="flex items-center gap-2">
                  {issue.status === 'Assigned' && (
                    <Button 
                      size="sm" 
                      onClick={() => handleStatusUpdate(issue.id, 'In Progress')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Start Work
                    </Button>
                  )}
                  {issue.status === 'In Progress' && (
                    <Button 
                      size="sm" 
                      onClick={() => handleStatusUpdate(issue.id, 'Resolved')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Mark Resolved
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                  <Button size="sm" variant="outline">
                    Upload Report
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 text-center">
            <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Upload Report</h3>
            <p className="text-sm text-gray-600 mb-4">Submit progress reports and documentation</p>
            <Button className="w-full">Upload Report</Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 text-center">
            <ClipboardList className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">View All Issues</h3>
            <p className="text-sm text-gray-600 mb-4">Browse all assigned and available issues</p>
            <Button variant="outline" className="w-full">View Issues</Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Performance</h3>
            <p className="text-sm text-gray-600 mb-4">View your completion statistics</p>
            <Button variant="outline" className="w-full">View Stats</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DepartmentDashboard;
