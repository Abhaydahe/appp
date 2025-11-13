import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Briefcase, User, LogOut, Menu, X } from 'lucide-react';
import AuthModal from './AuthModal';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Briefcase className="w-8 h-8 text-[#00ADB5]" />
              <span className="text-2xl font-bold text-[#222831]">Wallxy</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/jobs" className="text-gray-700 hover:text-[#00ADB5] font-medium">
                Jobs
              </Link>
              <Link to="/freelancers" className="text-gray-700 hover:text-[#00ADB5] font-medium">
                Freelancers
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="text-gray-700 hover:text-[#00ADB5] font-medium">
                    Dashboard
                  </Link>
                  <div className="flex items-center space-x-3">
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">{user?.full_name}</p>
                      <p className="text-gray-500 text-xs capitalize">{user?.user_type}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleLogout}
                      className="flex items-center space-x-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </Button>
                  </div>
                </>
              ) : (
                <Button 
                  onClick={() => setShowAuthModal(true)}
                  className="bg-[#00ADB5] hover:bg-[#00ADB5]/90"
                >
                  Sign In
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-3">
              <Link 
                to="/jobs" 
                className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Jobs
              </Link>
              <Link 
                to="/freelancers" 
                className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Freelancers
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <div className="px-3 py-2">
                    <p className="font-medium text-gray-900">{user?.full_name}</p>
                    <p className="text-gray-500 text-sm capitalize">{user?.user_type}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={() => {
                    setShowAuthModal(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-[#00ADB5] hover:bg-[#00ADB5]/90"
                >
                  Sign In
                </Button>
              )}
            </div>
          )}
        </div>
      </nav>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
};

export default Navbar;
