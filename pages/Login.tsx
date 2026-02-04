import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StorageService } from '../services/storageService';
import { EmailService } from '../services/emailService';
import { User, UserRole, SubscriptionStatus } from '../types';
import { MOCK_TEACHER_USER, ADMIN_EMAIL } from '../constants';
import { Mail, Lock, User as UserIcon, AlertCircle, ArrowRight } from 'lucide-react';

interface LoginProps {
  setUser: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ setUser }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<string | null>(null);

  // Initialize DB on load to ensure mock users exist
  useEffect(() => {
    StorageService.initUserDB();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(null);
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const users = StorageService.getAllUsers();
    
    const encryptedPassword = btoa(formData.password);

    if (activeTab === 'login') {
        // --- LOGIN FLOW ---
        // Check for user with matching email and password
        const user = users.find(u => u.email.toLowerCase() === formData.email.toLowerCase() && u.password === encryptedPassword);
        
        if (user) {
            StorageService.setUser(user);
            setUser(user);
            
            // Redirect based on role
            if (user.role === UserRole.ADMIN) {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } else {
            setError('Invalid email or password.');
        }
    } else {
        // --- SIGNUP FLOW ---
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        
        // Prevent creating an account with the Admin email via signup
        if (formData.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
            setError('This email is reserved. Please log in.');
            return;
        }

        if (users.find(u => u.email.toLowerCase() === formData.email.toLowerCase())) {
            setError('User already exists with this email.');
            return;
        }
        
        const newUser: User = {
            id: crypto.randomUUID(),
            email: formData.email,
            name: formData.name,
            role: UserRole.TEACHER,
            subscriptionStatus: SubscriptionStatus.NONE,
            password: encryptedPassword,
            joinedAt: new Date().toISOString(),
            purchasedProductIds: []
        };

        StorageService.saveUserToDB(newUser);
        StorageService.setUser(newUser);
        setUser(newUser);
        EmailService.sendWelcomeEmail(newUser);
        navigate('/');
    }
  };

  const handleGoogleLogin = () => {
      // Mock Google Login behavior
      handleMockLogin(MOCK_TEACHER_USER);
  };

  const handleMockLogin = (mockUser: User) => {
    StorageService.saveUserToDB(mockUser);
    StorageService.setUser(mockUser);
    setUser(mockUser);
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🇬🇾</span>
            </div>
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900">
            {activeTab === 'login' ? 'Sign in to your account' : 'Create an account'}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Access Ministry-compliant resources today.
          </p>
        </div>
        
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200">
          
          <div className="flex border-b border-slate-200 mb-6">
            <button
                className={`flex-1 py-2 text-center text-sm font-medium border-b-2 ${activeTab === 'login' ? 'border-green-600 text-green-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                onClick={() => setActiveTab('login')}
            >
                Log In
            </button>
            <button
                className={`flex-1 py-2 text-center text-sm font-medium border-b-2 ${activeTab === 'signup' ? 'border-green-600 text-green-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                onClick={() => setActiveTab('signup')}
            >
                Sign Up
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleAuth}>
            {activeTab === 'signup' && (
                <div>
                    <label className="block text-sm font-medium text-slate-700">Full Name</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <UserIcon className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            name="name"
                            type="text"
                            required
                            className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md py-2 border"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700">Email address</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md py-2 border"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                    name="password"
                    type="password"
                    required
                    className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md py-2 border"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    />
                </div>
            </div>

            {activeTab === 'signup' && (
                <div>
                    <label className="block text-sm font-medium text-slate-700">Confirm Password</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                        name="confirmPassword"
                        type="password"
                        required
                        className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md py-2 border"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        />
                    </div>
                </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {activeTab === 'login' ? 'Sign In' : 'Create Account'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300" />
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">
                Or continue with
                </span>
            </div>
            </div>

            <div className="mt-6">
                <button
                    onClick={handleGoogleLogin}
                    className="w-full inline-flex justify-center py-2 px-4 border border-slate-300 rounded-md shadow-sm bg-white text-sm font-medium text-slate-500 hover:bg-slate-50"
                >
                <span className="sr-only">Sign in with Google</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                </svg>
                <span className="ml-2">Sign in with Google</span>
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;