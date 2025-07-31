import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, Menu, X, Search } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout, isAdmin } = useAuth();
  const { itemsCount } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary-600">
            E-Commerce
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </form>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-primary-600">
              Home
            </Link>
            
            {user ? (
              <>
                <Link to="/cart" className="relative text-gray-700 hover:text-primary-600">
                  <ShoppingCart className="h-6 w-6" />
                  {itemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {itemsCount}
                    </span>
                  )}
                </Link>
                
                <Link to="/orders" className="text-gray-700 hover:text-primary-600">
                  Orders
                </Link>
                
                {isAdmin && (
                  <Link to="/admin/dashboard" className="text-gray-700 hover:text-primary-600">
                    Admin
                  </Link>
                )}
                
                <div className="relative group">
                  <button className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
                    <User className="h-6 w-6" />
                    <span>{user.firstName}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-600">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </form>

            <div className="space-y-2">
              <Link
                to="/"
                className="block py-2 text-gray-700 hover:text-primary-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              
              {user ? (
                <>
                  <Link
                    to="/cart"
                    className="flex items-center py-2 text-gray-700 hover:text-primary-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Cart ({itemsCount})
                  </Link>
                  
                  <Link
                    to="/orders"
                    className="block py-2 text-gray-700 hover:text-primary-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  
                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      className="block py-2 text-gray-700 hover:text-primary-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 text-gray-700 hover:text-primary-600"
                  >
                    Logout ({user.firstName})
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block py-2 text-gray-700 hover:text-primary-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block py-2 text-primary-600 hover:text-primary-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
