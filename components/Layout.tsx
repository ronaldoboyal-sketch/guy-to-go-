
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  setUser: (user: User | null) => void;
  cartCount: number;
}

const Layout: React.FC<LayoutProps> = ({ children, user, setUser, cartCount }) => {
  const handleLogout = () => {
    localStorage.removeItem('guytogo_user');
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar user={user} onLogout={handleLogout} cartCount={cartCount} />
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div>
                    <p className="text-slate-900 font-bold text-lg mb-1">Guy to Go Systems</p>
                    <p className="text-slate-500 text-sm">© {new Date().getFullYear()} Empowering Guyanese Educators.</p>
                </div>
                <div className="flex flex-wrap justify-center gap-6 text-slate-400 text-sm">
                    <Link to="/training-manual" className="text-green-600 font-semibold hover:text-green-700 transition-colors">AI Training Manual</Link>
                    <Link to="/privacy" className="hover:text-slate-600 transition-colors">Privacy Policy</Link>
                    <Link to="/terms" className="hover:text-slate-600 transition-colors">Terms of Service</Link>
                    <Link to="/contact" className="hover:text-slate-600 transition-colors">Contact GtoG</Link>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
