import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpenIcon, 
  ShoppingCartIcon, 
  ClipboardDocumentListIcon, 
  ChartBarIcon, 
  UsersIcon 
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main nav */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                <BookOpenIcon className="h-8 w-8" />
                Bookstore
              </span>
            </Link>
            
            {/* Desktop navigation */}
            <div className="hidden md:ml-8 md:flex md:space-x-8">
              <Link
                to="/"
                className={`${
                  isActive('/') 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
              >
                Catalog
              </Link>

              {isAuthenticated && (
                <>
                  <Link
                    to="/cart"
                    className={`${
                      isActive('/cart') 
                        ? 'border-blue-500 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors gap-1`}
                  >
                    <ShoppingCartIcon className="h-4 w-4" />
                    Cart
                  </Link>

                  <Link
                    to="/purchase-history"
                    className={`${
                      isActive('/purchase-history') 
                        ? 'border-blue-500 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors gap-1`}
                  >
                    <ClipboardDocumentListIcon className="h-4 w-4" />
                    Orders
                  </Link>
                </>
              )}

              {isAdmin && (
                <>
                  <Link
                    to="/dashboard"
                    className={`${
                      isActive('/dashboard') 
                        ? 'border-blue-500 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors gap-1`}
                  >
                    <ChartBarIcon className="h-4 w-4" />
                    Dashboard
                  </Link>

                  <Link
                    to="/user-management"
                    className={`${
                      isActive('/user-management') 
                        ? 'border-blue-500 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors gap-1`}
                  >
                    <UsersIcon className="h-4 w-4" />
                    Users
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* User menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className={`${
                  isActive('/') ? 'bg-blue-50 text-blue-700' : 'text-gray-600'
                } block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50 flex items-center gap-2`}
                onClick={() => setIsMenuOpen(false)}
              >
                <BookOpenIcon className="h-5 w-5" />
                Catalog
              </Link>

              {isAuthenticated && (
                <>
                  <Link
                    to="/cart"
                    className={`${
                      isActive('/cart') ? 'bg-blue-50 text-blue-700' : 'text-gray-600'
                    } block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50 flex items-center gap-2`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ShoppingCartIcon className="h-5 w-5" />
                    Cart
                  </Link>

                  <Link
                    to="/purchase-history"
                    className={`${
                      isActive('/purchase-history') ? 'bg-blue-50 text-blue-700' : 'text-gray-600'
                    } block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50 flex items-center gap-2`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ClipboardDocumentListIcon className="h-5 w-5" />
                    Purchase History
                  </Link>
                </>
              )}

              {isAdmin && (
                <>
                  <Link
                    to="/dashboard"
                    className={`${
                      isActive('/dashboard') ? 'bg-blue-50 text-blue-700' : 'text-gray-600'
                    } block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50 flex items-center gap-2`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ChartBarIcon className="h-5 w-5" />
                    Dashboard
                  </Link>

                  <Link
                    to="/user-management"
                    className={`${
                      isActive('/user-management') ? 'bg-blue-50 text-blue-700' : 'text-gray-600'
                    } block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50 flex items-center gap-2`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UsersIcon className="h-5 w-5" />
                    User Management
                  </Link>
                </>
              )}

              {/* Mobile Authentication */}
              <div className="border-t border-gray-200 pt-2 mt-2">
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className={`${
                        isActive('/login') ? 'bg-blue-50 text-blue-700' : 'text-gray-600'
                      } block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/register"
                      className={`${
                        isActive('/register') ? 'bg-blue-50 text-blue-700' : 'text-blue-600'
                      } block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-50`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 