import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, Users, Star, TrendingUp, ArrowRight, Search, Sparkles } from 'lucide-react';
import AuthModal from '@/components/AuthModal';
import { useAuth } from '@/context/AuthContext';

const features = [
  {
    icon: Search,
    title: 'Smart Job Matching',
    description: 'AI-powered job recommendations tailored to your skills and experience',
  },
  {
    icon: Users,
    title: 'Top Talent Pool',
    description: 'Connect with verified professionals in architecture, engineering, and construction',
  },
  {
    icon: Sparkles,
    title: 'AI Tools',
    description: 'Automated proposal generation, resume improvement, and contract drafting',
  },
  {
    icon: TrendingUp,
    title: 'Career Growth',
    description: 'Track your progress and discover opportunities for professional advancement',
  },
];

const stats = [
  { value: '10,000+', label: 'Active Jobs' },
  { value: '50,000+', label: 'Professionals' },
  { value: '5,000+', label: 'Companies' },
  { value: '₹500Cr+', label: 'Projects Value' },
];

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <section className="relative bg-gradient-to-r from-[#00ADB5] to-[#00ADB5]/80 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Your Gateway to AEC Excellence
              </h1>
              <p className="text-xl mb-8 text-white/90">
                Connect with opportunities in Architecture, Engineering & Construction.
                Find jobs, hire talent, and grow your career with AI-powered matching.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/jobs">
                  <Button size="lg" className="bg-white text-[#00ADB5] hover:bg-white/90 h-14 px-8">
                    <Briefcase className="w-5 h-5 mr-2" />
                    Find Jobs
                  </Button>
                </Link>
                <Link to="/freelancers">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 h-14 px-8">
                    <Users className="w-5 h-5 mr-2" />
                    Hire Talent
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 rounded-3xl transform rotate-3"></div>
                <div className="relative bg-white/20 backdrop-blur-lg rounded-3xl p-8 border border-white/30">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-white">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <Briefcase className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-semibold">Senior Architect</p>
                        <p className="text-sm text-white/80">Mumbai • ₹12L-18L</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-white">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-semibold">3D Visualization</p>
                        <p className="text-sm text-white/80">Project • ₹50k-80k</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl font-bold text-[#00ADB5] mb-2">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#222831] mb-4">
              Why Choose Wallxy?
            </h2>
            <p className="text-xl text-gray-600">
              The most advanced platform for AEC professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-[#00ADB5] transition-colors">
                <CardContent className="pt-6">
                  <div className="w-14 h-14 bg-[#00ADB5]/10 rounded-2xl flex items-center justify-center mb-4">
                    <feature.icon className="w-7 h-7 text-[#00ADB5]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#222831] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="border-2">
              <CardContent className="p-8">
                <Briefcase className="w-12 h-12 text-[#00ADB5] mb-4" />
                <h3 className="text-2xl font-bold text-[#222831] mb-3">
                  For Job Seekers
                </h3>
                <p className="text-gray-600 mb-6">
                  Discover opportunities from top AEC companies. Get AI-powered job recommendations,
                  track applications, and grow your career with personalized insights.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-[#00ADB5]" />
                    <span>AI Resume Improvement</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-[#00ADB5]" />
                    <span>Smart Job Matching</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-[#00ADB5]" />
                    <span>Application Tracking</span>
                  </li>
                </ul>
                <Link to="/jobs">
                  <Button className="w-full bg-[#00ADB5] hover:bg-[#00ADB5]/90">
                    Browse Jobs
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-8">
                <Users className="w-12 h-12 text-[#00ADB5] mb-4" />
                <h3 className="text-2xl font-bold text-[#222831] mb-3">
                  For Employers & Clients
                </h3>
                <p className="text-gray-600 mb-6">
                  Post jobs or projects and connect with verified AEC professionals.
                  Streamline hiring with AI-assisted candidate screening and project management tools.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-[#00ADB5]" />
                    <span>Verified Professionals</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-[#00ADB5]" />
                    <span>Project Management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-[#00ADB5]" />
                    <span>Secure Payments</span>
                  </li>
                </ul>
                <Link to="/freelancers">
                  <Button className="w-full bg-[#00ADB5] hover:bg-[#00ADB5]/90">
                    Hire Talent
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-[#00ADB5] to-[#00ADB5]/80 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join thousands of professionals and companies transforming the AEC industry
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="lg" className="bg-white text-[#00ADB5] hover:bg-white/90 h-14 px-8">
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            ) : (
              <Button 
                size="lg" 
                onClick={() => setShowAuthModal(true)}
                className="bg-white text-[#00ADB5] hover:bg-white/90 h-14 px-8"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </section>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default Home;
