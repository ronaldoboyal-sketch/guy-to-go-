import React from 'react';
import { Shield, Lock, Eye } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-white shadow rounded-lg border border-slate-200">
      <div className="text-center mb-12">
        <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h1 className="text-3xl font-extrabold text-slate-900">Privacy Policy</h1>
        <p className="mt-4 text-slate-500">Last Updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="prose prose-slate max-w-none">
        <p>
          At <strong>Guy to Go</strong>, we value your privacy and are committed to protecting your personal data. 
          This Privacy Policy outlines how we collect, use, and safeguard your information when you visit our website 
          or use our educational services and AI tools.
        </p>

        <h3>1. Information We Collect</h3>
        <p>We collect information to provide better services to our users. This includes:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Personal Identification Information:</strong> Name, email address, and phone number (when provided for MMG verification).</li>
          <li><strong>Account Data:</strong> Password (encrypted), purchase history, and subscription status.</li>
          <li><strong>Usage Data:</strong> Information on how you interact with our AI Lesson Planner and digital marketplace.</li>
        </ul>

        <h3>2. How We Use Your Information</h3>
        <p>Your data is used strictly for the following purposes:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>To process transactions and verify Mobile Money Guyana (MMG) payments.</li>
          <li>To provide and manage your access to the AI Lesson Planner and digital downloads.</li>
          <li>To send important account notifications, such as payment confirmations and product updates.</li>
          <li>To improve our AI models and platform functionality tailored to the Guyanese curriculum.</li>
        </ul>

        <h3>3. Data Security</h3>
        <div className="flex items-start bg-slate-50 p-4 rounded-md my-4">
            <Lock className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-slate-700 m-0">
                We implement industry-standard security measures to protect your data. Passwords are hashed and stored securely. 
                We do not store credit card information directly; all financial transactions are verified via MMG transaction references.
            </p>
        </div>

        <h3>4. Third-Party Services</h3>
        <p>
          We may employ third-party companies and services to facilitate our Service, including:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Google Gemini AI:</strong> Used to generate lesson plan content. Prompts sent to the AI are processed securely and are not used to train public models with your personal data.</li>
          <li><strong>Mobile Money Guyana (MMG):</strong> We cross-reference transaction IDs provided by you with our merchant records.</li>
        </ul>

        <h3>5. Cookies</h3>
        <p>
          We use local storage technology to maintain your session and cart contents. By using our website, you agree to the use of these necessary storage methods.
        </p>

        <h3>6. Your Rights</h3>
        <p>
          You have the right to request access to the personal data we hold about you, request corrections, or request deletion of your account. 
          Please contact our support team to exercise these rights.
        </p>

        <h3>7. Contact Us</h3>
        <p>
          If you have any questions about this Privacy Policy, please contact us at <strong>support@guytogo.gy</strong> or visit our Contact page.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;