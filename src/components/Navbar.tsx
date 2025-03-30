
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Scissors, Calendar, LogIn, LogOut, User, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useWindowSize } from '@/hooks/use-mobile';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isMobile } = useWindowSize();
  const { user, profile, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  console.log("Navbar - User:", user?.id);
  console.log("Navbar - Profile:", profile);
  console.log("Navbar - Is Admin:", isAdmin);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    toggleMenu();
  };

  const handleLoginClick = () => {
    navigate('/login');
    toggleMenu();
  };

  const handleAdminClick = () => {
    navigate('/admin');
    toggleMenu();
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="p-2 bg-barber-primary rounded-full mr-2">
                <Scissors className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-serif font-bold">Barber Shop Pro</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="flex items-center space-x-4">
              <Link to="/" className="px-3 py-2 text-gray-700 hover:text-barber-secondary">
                Início
              </Link>
              <Link to="/agendar" className="px-3 py-2 text-gray-700 hover:text-barber-secondary flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Agendar
              </Link>
              
              {user ? (
                <>
                  {isAdmin && (
                    <Button 
                      variant="ghost" 
                      className="flex items-center text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                      onClick={handleAdminClick}
                    >
                      <ShieldCheck className="h-4 w-4 mr-1" />
                      Admin
                    </Button>
                  )}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">
                      {profile?.name || user.email}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-700 hover:text-barber-secondary"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-4 w-4 mr-1" />
                      Sair
                    </Button>
                  </div>
                </>
              ) : (
                <Button 
                  variant="ghost" 
                  className="text-gray-700 hover:text-barber-secondary"
                  onClick={handleLoginClick}
                >
                  <LogIn className="h-4 w-4 mr-1" />
                  Login
                </Button>
              )}
            </div>
          )}

          {/* Mobile menu button */}
          {isMobile && (
            <div className="flex items-center">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-barber-secondary focus:outline-none"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobile && isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute w-full z-50">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-barber-secondary"
              onClick={toggleMenu}
            >
              Início
            </Link>
            <Link
              to="/agendar"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-barber-secondary flex items-center"
              onClick={toggleMenu}
            >
              <Calendar className="h-5 w-5 mr-2" />
              Agendar
            </Link>
            
            {user ? (
              <>
                {isAdmin && (
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-md text-base font-medium"
                    onClick={handleAdminClick}
                  >
                    <ShieldCheck className="h-5 w-5 mr-2" />
                    Admin
                  </Button>
                )}
                <div className="px-3 py-2 border-t border-gray-200 mt-2">
                  <div className="flex items-center mb-2">
                    <User className="h-5 w-5 mr-2 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      {profile?.name || user.email}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start mt-1"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Sair
                  </Button>
                </div>
              </>
            ) : (
              <Button
                variant="outline"
                className="w-full justify-start mt-2"
                onClick={handleLoginClick}
              >
                <LogIn className="h-5 w-5 mr-2" />
                Login
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
