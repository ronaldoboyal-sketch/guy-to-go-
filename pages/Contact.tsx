import React from 'react';
import { Mail, MessageSquare, Phone } from 'lucide-react';
import { ADMIN_EMAIL } from '../constants';

const Contact: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-slate-900">Contact Guy to Go</h1>
        <p className="mt-4 text-xl text-slate-500">
          We're here to help Guyanese educators succeed.
        </p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-slate-200">
        <div className="px-4 py-5 sm:px-6 bg-slate-50 border-b border-slate-200">
          <h3 className="text-lg leading-6 font-medium text-slate-900">Support Channels</h3>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">Reach out regarding accounts, payments, or technical support.</p>
        </div>
        <div className="border-t border-slate-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-slate-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-slate-500 flex items-center">
                <Mail className="h-5 w-5 mr-2 text-green-600" />
                Email Support
              </dt>
              <dd className="mt-1 text-sm text-slate-900 sm:mt-0 sm:col-span-2">
                <a href={`mailto:${ADMIN_EMAIL}`} className="text-green-600 hover:underline font-medium">
                  {ADMIN_EMAIL}
                </a>
                <p className="text-slate-500 text-xs mt-1">Typical response time: 24 hours</p>
              </dd>
            </div>
            
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-slate-500 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                Technical Assistance
              </dt>
              <dd className="mt-1 text-sm text-slate-900 sm:mt-0 sm:col-span-2">
                For issues with the AI Lesson Planner or account access, please include your <strong>User Email</strong> and any error messages in your report.
              </dd>
            </div>

            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-slate-500 flex items-center">
                <Phone className="h-5 w-5 mr-2 text-slate-400" />
                MMG Payment Support
              </dt>
              <dd className="mt-1 text-sm text-slate-900 sm:mt-0 sm:col-span-2">
                Please verify your Transaction ID with MMG App before contacting us about pending approvals. Approvals are processed manually.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Contact;