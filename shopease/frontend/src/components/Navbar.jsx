import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, 
  User as UserIcon, 
  LogOut, 
  Package, 
  LayoutDashboard, 
  Menu, 
  X, 
  ShieldCheck,
  Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully.');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left: Brand Logo + Main Navigation */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xs bg-[#0084d6] flex items-center justify-center text-white shadow-xs group-hover:bg-[#0073bb] transition-colors">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black italic tracking-tighter text-[#0084d6] group-hover:text-[#006bb0] transition-colors">
                ShopEase
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-6 text-[13px] font-semibold tracking-wider uppercase text-slate-700">
              <Link
                to="/"
                className={`transition-colors hover:text-[#0084d6] ${
                  isActive('/') ? 'text-[#0084d6] font-bold' : ''
                }`}
              >
                Everything
              </Link>
              <a
                href="#products-section"
                className="transition-colors hover:text-[#0084d6]"
              >
                Running
              </a>
              <a
                href="#products-section"
                className="transition-colors hover:text-[#0084d6]"
              >
                Sneakers
              </a>
              <a
                href="#products-section"
                className="transition-colors hover:text-[#0084d6]"
              >
                Casual
              </a>
              <a
                href="#products-section"
                className="transition-colors hover:text-[#0084d6]"
              >
                Formal
              </a>
            </nav>
          </div>

          {/* Right Links & User Controls */}
          <div className="hidden lg:flex items-center space-x-6">
            <nav className="flex items-center space-x-5 text-[13px] font-semibold tracking-wider uppercase text-slate-600">
              <a href="#featured-section" className="hover:text-[#0084d6] transition-colors">
                About
              </a>
              <a href="#footer-section" className="hover:text-[#0084d6] transition-colors">
                Contact Us
              </a>
            </nav>

            {/* Quick Orders Link for customer */}
            {isAuthenticated && !isAdmin && (
              <Link
                to="/orders"
                className="text-[13px] font-semibold tracking-wider uppercase text-slate-700 hover:text-[#0084d6] flex items-center gap-1.5 transition-colors"
              >
                <Package className="w-4 h-4 text-[#0084d6]" />
                Orders
              </Link>
            )}

            {/* Admin Console Shortcut */}
            {isAdmin && (
              <Link
                to="/admin"
                className="px-3 py-1.5 rounded-sm bg-slate-900 text-white text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5 hover:bg-[#0084d6] transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Admin
              </Link>
            )}

            {/* Cart Icon / Cart Widget */}
            <a
              href="#products-section"
              className="flex items-center gap-1.5 text-slate-800 hover:text-[#0084d6] transition-colors group"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-slate-700 group-hover:text-[#0084d6]" />
                <span className="absolute -top-1.5 -right-2 bg-[#0084d6] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  1
                </span>
              </div>
              <span className="text-xs font-bold font-mono tracking-tight text-slate-700 ml-1">
                Shop
              </span>
            </a>

            {/* Auth Dropdown / Buttons */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-full text-slate-700 hover:text-[#0084d6] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#0084d6]/10 text-[#0084d6] border border-[#0084d6]/30 flex items-center justify-center font-bold text-xs uppercase">
                    {user?.username?.[0] || 'U'}
                  </div>
                </button>

                {profileDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setProfileDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-xl border border-slate-100 py-1 z-20 animate-fade-in">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs text-slate-400">Signed in as</p>
                        <p className="text-sm font-semibold text-slate-800 truncate">{user?.username}</p>
                        <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-600">
                          {user?.role}
                        </span>
                      </div>

                      {isAdmin ? (
                        <Link
                          to="/admin"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#0084d6]"
                        >
                          <ShieldCheck className="w-4 h-4 text-[#0084d6]" />
                          Admin Console
                        </Link>
                      ) : (
                        <Link
                          to="/orders"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#0084d6]"
                        >
                          <Package className="w-4 h-4 text-[#0084d6]" />
                          My Orders
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-[#0084d6] transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-sm bg-[#0084d6] hover:bg-[#0073bb] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-3">
            <Link to="/login" className="text-xs font-bold uppercase text-slate-700">
              {isAuthenticated ? user?.username : 'Login'}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-[#0084d6]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 text-sm font-semibold uppercase tracking-wider">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#0084d6]"
          >
            Everything
          </Link>
          <a
            href="#products-section"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-700 hover:text-[#0084d6]"
          >
            Running Shoes
          </a>
          <a
            href="#products-section"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-700 hover:text-[#0084d6]"
          >
            Casual Sneakers
          </a>
          {isAuthenticated && !isAdmin && (
            <Link
              to="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 hover:text-[#0084d6]"
            >
              My Orders
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#0084d6]"
            >
              Admin Dashboard
            </Link>
          )}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="text-rose-600 text-xs font-bold uppercase"
              >
                Sign Out ({user?.username})
              </button>
            ) : (
              <div className="flex gap-4">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-bold uppercase text-slate-700"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-bold uppercase text-[#0084d6]"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
