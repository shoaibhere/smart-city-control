import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList, Vote, FileText, MapPin, Plus, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const CitizenDashboard = () => {
  const navigate = useNavigate();
  
  const [stats, setStats] = useState([]);
  const [myIssues, setMyIssues] = useState([]);
  const [activePolls, setActivePolls] = useState([]);
  
  useEffect(() => {
    console.log("CitizenDashboard mounted");
    axios.defaults.withCredentials = true;
    const fetchDashboardData = async () => {
  try {
    console.log("Fetching stats...");
    const statsRes = await axios.get('http://localhost:8000/api/users/stats');
    console.log("Stats:", statsRes.data);

    console.log("Fetching issues...");
    const issuesRes = await axios.get('http://localhost:8000/api/users/my-issues');
    console.log("Issues:", issuesRes.data);

    console.log("Fetching polls...");
    const pollsRes = await axios.get('http://localhost:8000/api/users/active-polls');
    console.log("Polls:", pollsRes.data);

    setStats(statsRes.data);
    setMyIssues(issuesRes.data);
    setActivePolls(pollsRes.data);
  } catch (error) {
    console.error('Failed to load dashboard data:', error);
  }
};


    fetchDashboardData();
  }, []);

  const iconMap = {
    'My Reports': ClipboardList,
    'Resolved Issues': FileText,
    'Active Polls': Vote,
    'Community Score': TrendingUp,
  };

  const colorMap = {
    'My Reports': { color: 'text-blue-600', bg: 'bg-blue-50' },
    'Resolved Issues': { color: 'text-green-600', bg: 'bg-green-50' },
    'Active Polls': { color: 'text-purple-600', bg: 'bg-purple-50' },
    'Community Score': { color: 'text-orange-600', bg: 'bg-orange-50' },
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Assigned': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Welcome Back!</h2>
        <p className="text-gray-600">Stay connected with your community and track your contributions</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat: any, index: number) => {
          const Icon = iconMap[stat.label] || ClipboardList;
          const colors = colorMap[stat.label] || { color: 'text-gray-600', bg: 'bg-gray-50' };

          return (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${colors.bg}`}>
                    <Icon className={`h-6 w-6 ${colors.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Recent Issues */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                My Recent Issues
              </div>
              <Button 
                size="sm" 
                onClick={() => navigate('/dashboard/citizen/report')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Report Issue
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myIssues.map((issue: any) => (
                <div key={issue.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{issue.title}</h4>
                      <p className="text-sm text-gray-600">{issue.location}</p>
                      <p className="text-xs text-gray-500">
                        Reported {issue.reportedAt} • {issue.department}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(issue.status)}`}>
                      {issue.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Polls */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Vote className="h-5 w-5" />
                Active Polls
              </div>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => navigate('/dashboard/citizen/polls')}
              >
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activePolls.map((poll: any) => (
                <div key={poll.id} className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">{poll.question}</h4>
                  <p className="text-sm text-gray-600 mb-3">Ends in {poll.endsIn}</p>
                  {poll.voted ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-green-600 font-medium">✓ You voted</span>
                      <Button size="sm" variant="outline">View Results</Button>
                    </div>
                  ) : (
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      Vote Now
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card 
          className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/dashboard/citizen/report')}
        >
          <CardContent className="p-6 text-center">
            <ClipboardList className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Report an Issue</h3>
            <p className="text-sm text-gray-600">Help improve your community by reporting problems</p>
          </CardContent>
        </Card>

        <Card 
          className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/dashboard/citizen/polls')}
        >
          <CardContent className="p-6 text-center">
            <Vote className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Vote in Polls</h3>
            <p className="text-sm text-gray-600">Have your say on community decisions</p>
          </CardContent>
        </Card>

        <Card 
          className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/dashboard/citizen/issues')}
        >
          <CardContent className="p-6 text-center">
            <MapPin className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Track Issues</h3>
            <p className="text-sm text-gray-600">Monitor the progress of your reports</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CitizenDashboard;