import React, { useState, useEffect } from 'react';
import { Product, User, UserRole, LessonPlanHistoryItem, SubscriptionStatus } from '../types';
import { StorageService } from '../services/storageService';
import { User as UserIcon, Mail, Lock, Shield, Download, FileText, Trash2, Clock, ShoppingCart, Star, Sparkles, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProfileProps {
  user: User;
  setUser: (user: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, setUser }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [lessonHistory, setLessonHistory] = useState<LessonPlanHistoryItem[]>([]);

  useEffect(() => {
    const allUsers = StorageService.getAllUsers();
    const freshUser = allUsers.find(u => u.id === user.id);
    if (freshUser) {
        setUser(freshUser);
        StorageService.setUser(freshUser);
    }
  }, []);

  useEffect(() => {
    // Only show products the user has actually purchased
    if (user.purchasedProductIds && user.purchasedProductIds.length > 0) {
        const allProducts = StorageService.getProducts();
        const owned = allProducts.filter(p => user.purchasedProductIds.includes(p.id));
        setMyProducts(owned);
    } else {
        setMyProducts([]);
    }
    setLessonHistory(StorageService.getUserLessonPlans(user.id));
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    const updatedUser: User = {
      ...user,
      name: formData.name,
      email: formData.email,
    };
    if (formData.newPassword) {
        updatedUser.password = btoa(formData.newPassword);
    }

    try {
      StorageService.saveUserToDB(updatedUser);
      setUser(updatedUser);
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
      setFormData(prev => ({ ...prev, newPassword: '', confirmPassword: '' }));
    } catch (e) {
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    }
  };

  const handleDownloadPlan = (plan: LessonPlanHistoryItem) => {
    const header = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <style>
          @page { size: 11in 8.5in landscape; margin: 0.5in; }
          body { font-family: 'Times New Roman', serif; }
          table { width: 100%; border-collapse: collapse; border: 2px solid black; }
          td, th { border: 1px solid black; padding: 5px; vertical-align: top; }
        </style>
      </head>
      <body>`;
    const footer = "</body></html>";
    const sourceHTML = header + plan.content + footer;
    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = `Lesson_Plan_${plan.subject}_${new Date().getTime()}.doc`;
    fileDownload.click();
    document.body.removeChild(fileDownload);
  };

  const isPremium = user.subscriptionStatus === SubscriptionStatus.ACTIVE || user.role === UserRole.ADMIN;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Educator Dashboard</h1>
        <p className="text-slate-500">Manage your Guyanese teaching resources and history.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
            <div className="bg-white shadow rounded-lg border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center">
                        <UserIcon className="h-5 w-5 mr-2 text-green-600" /> Account Details
                    </h2>
                    {isPremium && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                            <Shield className="h-3 w-3 mr-1" /> Premium Verified
                        </span>
                    )}
                </div>
                <div className="p-6">
                    {message && (
                        <div className={`mb-6 p-3 rounded-md text-sm flex items-center ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                            <AlertCircle className="h-4 w-4 mr-2" />
                            {message.text}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase">Full Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full sm:text-sm border-slate-300 rounded-md p-2 border focus:ring-green-500 focus:border-green-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase">Email Address</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full sm:text-sm border-slate-300 rounded-md p-2 border focus:ring-green-500 focus:border-green-500 outline-none" />
                            </div>
                        </div>
                        <div className="pt-4 border-t border-slate-100 flex justify-end">
                            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-md text-sm font-bold hover:bg-green-700 transition-colors shadow-sm">
                                Update Profile
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-blue-600" /> Planner History
                    </h2>
                </div>
                <div className="divide-y divide-slate-100">
                    {lessonHistory.length === 0 ? (
                        <div className="p-12 text-center text-slate-400">
                            <FileText className="h-10 w-10 mx-auto mb-2 opacity-20" />
                            <p className="text-sm">No history yet. Start planning using the AI tool.</p>
                            {isPremium && <Link to="/lesson-planner" className="text-green-600 font-bold text-sm mt-2 inline-block underline">Launch Planner</Link>}
                        </div>
                    ) : (
                        lessonHistory.map(plan => (
                            <div key={plan.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900">{plan.subject} - {plan.topic}</h4>
                                    <p className="text-xs text-slate-500">{plan.grade} • Generated on {new Date(plan.dateGenerated).toLocaleDateString()}</p>
                                </div>
                                <button onClick={() => handleDownloadPlan(plan)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors" title="Download for MS Word">
                                    <Download className="h-5 w-5" />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
            <div className={`rounded-xl p-6 border shadow-sm ${isPremium ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center gap-3 mb-4">
                    <Sparkles className={`h-6 w-6 ${isPremium ? 'text-green-600' : 'text-slate-400'}`} />
                    <h3 className="font-bold text-slate-900">AI Planner Access</h3>
                </div>
                {isPremium ? (
                    <div className="space-y-3">
                        <p className="text-sm text-green-700">Your premium subscription is active. You have unlimited access to the MoE-compliant lesson generator.</p>
                        <Link to="/lesson-planner" className="block w-full text-center py-2 bg-green-600 text-white rounded font-bold text-sm hover:bg-green-700 transition-colors">
                            Create New Lesson
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <p className="text-sm text-slate-600">The AI Lesson Planner is a premium feature. Upgrade to sync with the latest Guyanese curriculum.</p>
                        <Link to="/subscription" className="block w-full text-center py-2 bg-slate-900 text-white rounded font-bold text-sm hover:bg-slate-800 transition-colors">
                            Unlock AI Planner
                        </Link>
                    </div>
                )}
            </div>

            <div className="bg-white shadow rounded-lg border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center">
                        <Star className="h-4 w-4 mr-2 text-yellow-500" /> My Digital Library
                    </h3>
                </div>
                <div className="p-4">
                    {myProducts.length === 0 ? (
                        <div className="text-center py-8">
                            <ShoppingCart className="h-8 w-8 mx-auto text-slate-200 mb-2" />
                            <p className="text-xs font-bold text-slate-900 mb-1">No products owned yet.</p>
                            <p className="text-[10px] text-slate-400 mb-4 leading-relaxed">
                                You haven't purchased any individual resources. Visit the store to find official MoE guides.
                            </p>
                            <Link to="/" className="inline-flex items-center justify-center w-full py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded hover:bg-slate-200 transition-colors">
                                Browse Store
                            </Link>
                        </div>
                    ) : (
                        <ul className="space-y-3">
                            {myProducts.map(p => (
                                <li key={p.id} className="border border-slate-100 rounded-lg p-3 hover:bg-slate-50 transition-colors group">
                                    <p className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-green-600">{p.title}</p>
                                    <p className="text-[10px] text-slate-500 mb-2">{p.category}</p>
                                    <a href={p.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full py-1.5 bg-blue-50 text-blue-700 rounded text-xs font-bold hover:bg-blue-100 transition-colors">
                                        <Download className="h-3 w-3 mr-1" /> Access File
                                    </a>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;