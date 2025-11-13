import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, Users, UserCircle, Building2, Plus, FileText, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  const renderDashboardByType = () => {
    switch (user?.user_type) {
      case 'jobseeker':
        return <JobSeekerDashboard user={user} />;
      case 'employer':
        return <EmployerDashboard user={user} />;
      case 'freelancer':
        return <FreelancerDashboard user={user} />;
      case 'client':
        return <ClientDashboard user={user} />;
      default:
        return <DashboardSelector />;
    }
  };

  return renderDashboardByType();
};

const DashboardSelector = () => {
  const dashboards = [
    {
      title: 'Job Seeker',
      description: 'Find jobs, track applications, and grow your career',
      icon: UserCircle,
      color: 'bg-blue-500',
    },
    {
      title: 'Employer',
      description: 'Post jobs, manage applications, and hire talent',
      icon: Building2,
      color: 'bg-green-500',
    },
    {
      title: 'Freelancer',
      description: 'Find projects, submit proposals, and earn money',
      icon: Briefcase,
      color: 'bg-purple-500',
    },
    {
      title: 'Client',
      description: 'Post projects, hire freelancers, and manage work',
      icon: Users,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#222831] mb-4">
            Welcome to Your Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Access your personalized workspace
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {dashboards.map((dashboard) => (
            <Card key={dashboard.title} className="border-2 hover:border-[#00ADB5] transition-all hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 ${dashboard.color} rounded-2xl flex items-center justify-center`}>
                    <dashboard.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-[#222831]">{dashboard.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  {dashboard.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

const JobSeekerDashboard = ({ user }) => (
  <div className="min-h-screen bg-gray-50 py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#222831] mb-2">Job Seeker Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.full_name}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Applications</p>
                <p className="text-3xl font-bold text-[#00ADB5]">0</p>
              </div>
              <FileText className="w-12 h-12 text-[#00ADB5]/20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Saved Jobs</p>
                <p className="text-3xl font-bold text-[#00ADB5]">0</p>
              </div>
              <Briefcase className="w-12 h-12 text-[#00ADB5]/20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Profile Views</p>
                <p className="text-3xl font-bold text-[#00ADB5]">0</p>
              </div>
              <Users className="w-12 h-12 text-[#00ADB5]/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/jobs">
              <Button className="w-full bg-[#00ADB5] hover:bg-[#00ADB5]/90">
                <Search className="w-4 h-4 mr-2" />
                Browse Jobs
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-center py-4">No applications yet</p>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

const EmployerDashboard = ({ user }) => (
  <div className="min-h-screen bg-gray-50 py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#222831] mb-2">Employer Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.full_name}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Jobs</p>
                <p className="text-3xl font-bold text-[#00ADB5]">0</p>
              </div>
              <Briefcase className="w-12 h-12 text-[#00ADB5]/20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Applications</p>
                <p className="text-3xl font-bold text-[#00ADB5]">0</p>
              </div>
              <FileText className="w-12 h-12 text-[#00ADB5]/20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-3xl font-bold text-[#00ADB5]">0</p>
              </div>
              <Users className="w-12 h-12 text-[#00ADB5]/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">Post your first job to get started!</p>
        </CardContent>
      </Card>
    </div>
  </div>
);

const FreelancerDashboard = ({ user }) => (
  <div className="min-h-screen bg-gray-50 py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#222831] mb-2">Freelancer Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.full_name}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Proposals</p>
                <p className="text-3xl font-bold text-[#00ADB5]">0</p>
              </div>
              <FileText className="w-12 h-12 text-[#00ADB5]/20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed Projects</p>
                <p className="text-3xl font-bold text-[#00ADB5]">0</p>
              </div>
              <CheckCircle className="w-12 h-12 text-[#00ADB5]/20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Earnings</p>
                <p className="text-3xl font-bold text-[#00ADB5]">₹0</p>
              </div>
              <Users className="w-12 h-12 text-[#00ADB5]/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link to="/freelancers">
            <Button className="w-full bg-[#00ADB5] hover:bg-[#00ADB5]/90">
              <Search className="w-4 h-4 mr-2" />
              Browse Projects
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  </div>
);

const ClientDashboard = ({ user }) => (
  <div className="min-h-screen bg-gray-50 py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#222831] mb-2">Client Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.full_name}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Projects</p>
                <p className="text-3xl font-bold text-[#00ADB5]">0</p>
              </div>
              <Briefcase className="w-12 h-12 text-[#00ADB5]/20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Proposals Received</p>
                <p className="text-3xl font-bold text-[#00ADB5]">0</p>
              </div>
              <FileText className="w-12 h-12 text-[#00ADB5]/20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-3xl font-bold text-[#00ADB5]">₹0</p>
              </div>
              <Users className="w-12 h-12 text-[#00ADB5]/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">Post your first project to get started!</p>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default Dashboard;
