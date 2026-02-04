import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, UserRole, SubscriptionStatus } from '../types';
import { ShoppingCart, LogOut, Menu, X, User as UserIcon, Settings, ChevronDown } from 'lucide-react';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  cartCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, cartCount }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsProfileOpen(false);
    onLogout();
    navigate('/');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileRef]);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-red-600 font-bold border-2 border-green-600">
                G
              </div>
              <span className="font-bold text-xl text-slate-800 tracking-tight">Guy to Go</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/" className="border-transparent text-slate-500 hover:border-green-500 hover:text-green-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Store
              </Link>
              <Link to="/lesson-planner" className="border-transparent text-slate-500 hover:border-green-500 hover:text-green-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                AI Planner
              </Link>
              {user?.role === UserRole.ADMIN && (
                <Link to="/admin" className="border-transparent text-slate-500 hover:border-red-500 hover:text-red-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <Link to="/cart" className="relative p-2 text-slate-400 hover:text-slate-500">
              <span className="sr-only">View notifications</span>
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative" ref={profileRef}>
                 <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 focus:outline-none"
                 >
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-medium text-slate-700">{user.name}</span>
                        <span className="text-xs text-slate-500">
                            {user.role === UserRole.ADMIN ? 'Administrator' : user.subscriptionStatus === SubscriptionStatus.ACTIVE ? 'Premium Member' : 'Free Account'}
                        </span>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                        {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
                        ) : (
                            <UserIcon className="h-5 w-5 text-slate-500" />
                        )}
                    </div>
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                 </button>

                 {/* Dropdown Menu */}
                 {isProfileOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Link 
                            to="/profile" 
                            className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                            onClick={() => setIsProfileOpen(false)}
                        >
                            <Settings className="h-4 w-4" /> Account Settings
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                            <LogOut className="h-4 w-4" /> Sign Out
                        </button>
                    </div>
                 )}
              </div>
            ) : (
              <Link to="/login" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                Sign In
              </Link>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link to="/" className="bg-green-50 border-green-500 text-green-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
              Store
            </Link>
            <Link to="/lesson-planner" className="border-transparent text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
              AI Planner
            </Link>
            <Link to="/cart" className="border-transparent text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
              Cart ({cartCount})
            </Link>
            {!user && (
                <Link to="/login" className="border-transparent text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                Sign In
              </Link>
            )}
             {user?.role === UserRole.ADMIN && (
                <Link to="/admin" className="border-transparent text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                  Admin
                </Link>
              )}
             {user && (
                <>
                    <Link to="/profile" className="border-transparent text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                        Profile
                    </Link>
                    <button onClick={handleLogout} className="w-full text-left border-transparent text-red-500 hover:bg-red-50 hover:border-red-300 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                        Sign Out
                    </button>
                </>
             )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;