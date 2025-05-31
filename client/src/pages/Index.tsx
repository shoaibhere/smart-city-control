
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Building, 
  MapPin, 
  Users, 
  ClipboardList, 
  Vote, 
  BarChart3,
  ArrowRight,
  CheckCircle,
  Shield,
  Zap
} from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: ClipboardList,
      title: 'Report Issues',
      description: 'Citizens can easily report community problems with photos and location details'
    },
    {
      icon: Vote,
      title: 'Community Polls',
      description: 'Participate in democratic decision-making through interactive polls'
    },
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Track progress and view detailed insights on community improvements'
    },
    {
      icon: Users,
      title: 'Role-based Access',
      description: 'Customized dashboards for Citizens, Department Officials, and Administrators'
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'JWT-based authentication ensures secure access to all features'
    },
    {
      icon: Zap,
      title: 'Instant Updates',
      description: 'Real-time notifications and status updates keep everyone informed'
    }
  ];

  const stats = [
    { label: 'Active Citizens', value: '2,847' },
    { label: 'Issues Resolved', value: '1,456' },
    { label: 'Departments Connected', value: '12' },
    { label: 'Community Score', value: '94%' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Building className="h-8 w-8 text-blue-600" />
              <MapPin className="h-8 w-8 text-green-600" />
              <span className="text-xl font-bold text-gray-900">Smart City Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Building
            <span className="text-blue-600"> Smarter </span>
            Communities
            <span className="text-green-600"> Together</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect citizens, government departments, and administrators in one collaborative platform. 
            Report issues, participate in polls, track progress, and build a better community.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                Join as Citizen
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-gray-300 px-8 py-4 text-lg">
                Department Login
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Smart City Management
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools for citizens, department officials, and administrators
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Role-based Dashboards Preview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tailored Experiences for Every Role
            </h2>
            <p className="text-xl text-gray-600">
              Each user type gets a customized dashboard with relevant tools and information
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Citizen Dashboard Preview */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="p-8">
                <Users className="h-12 w-12 mb-6 opacity-90" />
                <h3 className="text-2xl font-bold mb-4">Citizens</h3>
                <ul className="space-y-3 text-blue-100">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Report community issues
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Track issue progress
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Vote in community polls
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    View community statistics
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Department Dashboard Preview */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardContent className="p-8">
                <Building className="h-12 w-12 mb-6 opacity-90" />
                <h3 className="text-2xl font-bold mb-4">Department Officials</h3>
                <ul className="space-y-3 text-green-100">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Manage assigned issues
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Update issue status
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Upload progress reports
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Communicate with admin
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Admin Dashboard Preview */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="p-8">
                <Shield className="h-12 w-12 mb-6 opacity-90" />
                <h3 className="text-2xl font-bold mb-4">Administrators</h3>
                <ul className="space-y-3 text-purple-100">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Manage users and roles
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Create community polls
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    View analytics dashboard
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Oversee all operations
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Community?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of citizens already making a difference in their communities
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                Start Contributing Today
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg">
                Access Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Building className="h-8 w-8 text-blue-400" />
            <MapPin className="h-8 w-8 text-green-400" />
            <span className="text-xl font-bold">Smart City Dashboard</span>
          </div>
          <p className="text-gray-400 mb-6">
            Building stronger communities through technology and collaboration
          </p>
          <div className="text-sm text-gray-500">
            © 2024 Smart City Dashboard. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
