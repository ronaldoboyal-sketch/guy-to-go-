import React, { useState } from 'react';
import { User, SubscriptionStatus } from '../types';
import { MMG_INSTRUCTIONS } from '../constants';
import { StorageService } from '../services/storageService';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertTriangle, CreditCard, DollarSign } from 'lucide-react';

interface SubscriptionProps {
  user: User;
  setUser: (user: User) => void;
}

const Subscription: React.FC<SubscriptionProps> = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    transactionId: '',
    senderName: '',
    senderPhone: ''
  });

  // If already pending
  if (user.subscriptionStatus === SubscriptionStatus.PENDING) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100">
          <AlertTriangle className="h-8 w-8 text-yellow-600" />
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-slate-900">Verification Pending</h2>
        <p className="mt-4 text-lg text-slate-500">
          We have received your payment details and are verifying with MMG. <br/>
          This typically takes 24-48 hours.
        </p>
      </div>
    );
  }

  // If already active
  if (user.subscriptionStatus === SubscriptionStatus.ACTIVE) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
         <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-slate-900">You are Subscribed!</h2>
        <p className="mt-4 text-lg text-slate-500">
          You have full access to the AI Lesson Planner.
        </p>
        <button
            onClick={() => navigate('/lesson-planner')}
            className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
        >
            Go to Planner
        </button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create payment request for subscription
    const request = {
        id: crypto.randomUUID(),
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        type: 'SUBSCRIPTION' as const,
        amount: 12000,
        transactionId: formData.transactionId,
        mmgSenderName: formData.senderName,
        mmgSenderPhone: formData.senderPhone,
        dateSubmitted: new Date().toISOString(),
        status: SubscriptionStatus.PENDING
    };

    StorageService.addPaymentRequest(request);
    
    // Update local user state
    const updatedUser = { ...user, subscriptionStatus: SubscriptionStatus.PENDING };
    StorageService.setUser(updatedUser);
    setUser(updatedUser);
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-slate-900 mb-8 text-center">Premium Subscription Activation</h1>
      
      <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
        {/* Instructions Section */}
        <div className="p-6 bg-slate-50 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <span className="bg-red-600 text-white rounded px-2 py-0.5 text-sm mr-2 font-bold">MMG</span>
                Payment Required
            </h2>
            
            <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm mb-4">
                <p className="text-slate-800 font-medium whitespace-pre-line text-lg text-center">
                    {MMG_INSTRUCTIONS}
                </p>
            </div>

            <div className="flex items-center justify-center text-green-600 font-bold text-xl">
                <DollarSign className="h-6 w-6 mr-1" />
                <span>GYD $12,000 / Year</span>
            </div>
        </div>

        {/* Form Section */}
        <div className="p-6">
            <div className="flex items-center mb-6">
                <CreditCard className="h-5 w-5 text-slate-500 mr-2" />
                <h3 className="text-lg font-medium text-slate-900">Enter Payment Details</h3>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-slate-700">MMG Transaction ID</label>
                    <input
                        type="text"
                        required
                        value={formData.transactionId}
                        onChange={(e) => setFormData({...formData, transactionId: e.target.value})}
                        placeholder="e.g. 123456789"
                        className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                    />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700">Sender Name</label>
                    <input
                        type="text"
                        required
                        value={formData.senderName}
                        onChange={(e) => setFormData({...formData, senderName: e.target.value})}
                        className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                    />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700">Sender Phone</label>
                    <input
                        type="tel"
                        required
                        value={formData.senderPhone}
                        onChange={(e) => setFormData({...formData, senderPhone: e.target.value})}
                        className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                    />
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                    >
                        Submit Verification
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default Subscription;