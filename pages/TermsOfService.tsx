import React from 'react';
import { FileText, AlertTriangle, CheckCircle } from 'lucide-react';

const TermsOfService: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-white shadow rounded-lg border border-slate-200">
      <div className="text-center mb-12">
        <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h1 className="text-3xl font-extrabold text-slate-900">Terms of Service</h1>
        <p className="mt-4 text-slate-500">Effective Date: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="prose prose-slate max-w-none">
        <h3>1. Acceptance of Terms</h3>
        <p>
          By accessing or using <strong>Guy to Go</strong> ("the Service"), you agree to be bound by these Terms of Service. 
          If you disagree with any part of the terms, you may not access the Service.
        </p>

        <h3>2. Accounts</h3>
        <p>
          When you create an account with us, you must provide information that is accurate, complete, and current at all times. 
          Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
          You are responsible for safeguarding the password that you use to access the Service.
        </p>

        <h3>3. Educational Resources & AI Tools</h3>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
            <div className="flex">
                <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
                <p className="text-sm text-yellow-700 m-0">
                    <strong>Disclaimer:</strong> The AI Lesson Planner is a tool designed to assist educators. While we strive for compliance with the 
                    Guyana Ministry of Education (MoE) curriculum standards, <strong>teachers are responsible for reviewing and vetting all generated content</strong> 
                    before use in the classroom. Guy to Go is not liable for any inaccuracies in the AI-generated material.
                </p>
            </div>
        </div>
        <p>
            Digital products purchased (PDFs, worksheets) are for personal use by the purchasing educator. Redistribution or resale 
            of these materials without express written permission is prohibited.
        </p>

        <h3>4. Subscription & Payments</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Billing:</strong> Premium features are billed on a yearly basis via Mobile Money Guyana (MMG).</li>
          <li><strong>Verification:</strong> Access to premium features is granted only after manual verification of the MMG transaction ID.</li>
          <li><strong>Refunds:</strong> Due to the digital nature of our products and the AI service, all sales are final. Refunds are granted only in cases of proven double-billing or technical failure to deliver the service.</li>
        </ul>

        <h3>5. Intellectual Property</h3>
        <p>
          The Service and its original content (excluding AI-generated text), features, and functionality are and will remain the exclusive property of Guy to Go Systems.
        </p>

        <h3>6. Termination</h3>
        <p>
          We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, 
          including without limitation if you breach the Terms.
        </p>

        <h3>7. Governing Law</h3>
        <p>
          These Terms shall be governed and construed in accordance with the laws of <strong>Guyana</strong>, without regard to its conflict of law provisions.
        </p>

        <h3>8. Changes</h3>
        <p>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after 
          those revisions become effective, you agree to be bound by the revised terms.
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;