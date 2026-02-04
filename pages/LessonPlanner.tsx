import React, { useState, useRef } from 'react';
import { User, SubscriptionStatus, LessonPlanRequest, LessonPlanHistoryItem } from '../types';
import { GeminiService } from '../services/geminiService';
import { StorageService } from '../services/storageService';
import { Link } from 'react-router-dom';
import { Lock, Loader2, BookOpen, Download, FileText, Printer, CheckCircle } from 'lucide-react';

interface LessonPlannerProps {
  user: User | null;
}

const LessonPlanner: React.FC<LessonPlannerProps> = ({ user }) => {
  const [formData, setFormData] = useState<LessonPlanRequest>({
    subject: '',
    grade: '',
    topic: '',
    duration: ''
  });
  const [loading, setLoading] = useState(false);
  const [lessonPlanHtml, setLessonPlanHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  if (!user) {
    return (
      <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-slate-200">
        <Lock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Login Required</h2>
        <p className="text-slate-500 mb-6">Please sign in to access the AI Lesson Planner.</p>
        <Link to="/login" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700">
            Sign In
        </Link>
      </div>
    );
  }

  const isSubscribed = user.subscriptionStatus === SubscriptionStatus.ACTIVE || user.role === 'ADMIN';

  if (!isSubscribed) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:px-6 lg:px-8 bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="bg-yellow-100 rounded-full p-4 w-fit mx-auto mb-6">
            <Lock className="h-10 w-10 text-yellow-600" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Premium Feature</h2>
        <p className="text-lg text-slate-600 mb-8">
          The AI Lesson Planner is available exclusively to premium subscribers. 
          Generate MoE-compliant lesson plans in seconds.
        </p>
        <Link to="/subscription" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg md:px-10 shadow-lg">
          Upgrade for GYD $12,000 / Year
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setLessonPlanHtml(null);

    try {
      const result = await GeminiService.generateLessonPlan(formData);
      setLessonPlanHtml(result);

      const historyItem: LessonPlanHistoryItem = {
          id: crypto.randomUUID(),
          userId: user.id,
          subject: formData.subject,
          grade: formData.grade,
          topic: formData.topic,
          duration: formData.duration,
          dateGenerated: new Date().toISOString(),
          content: result
      };
      StorageService.saveLessonPlan(historyItem);
    } catch (err: any) {
      setError(err.message || 'Failed to generate lesson plan.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadDocx = () => {
    if (!lessonPlanHtml) return;

    const header = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <style>
          @page { size: 11in 8.5in landscape; margin: 0.5in; }
          body { font-family: 'Times New Roman', serif; }
          table { width: 100%; border-collapse: collapse; border: 2px solid black; }
          td, th { border: 1px solid black; padding: 5px; vertical-align: top; font-size: 10pt; }
        </style>
      </head>
      <body>`;
    
    const footer = "</body></html>";
    const sourceHTML = header + lessonPlanHtml + footer;
    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = `MoE_Plan_${formData.topic.replace(/\s+/g, '_')}.doc`;
    fileDownload.click();
    document.body.removeChild(fileDownload);
  };

  return (
    <div className="max-w-full mx-auto px-4 pb-20">
        <style dangerouslySetInnerHTML={{ __html: `
            @media print {
                body * { visibility: hidden; }
                .print-area, .print-area * { visibility: visible; }
                .print-area { position: absolute; left: 0; top: 0; width: 100%; }
                @page { size: letter landscape; margin: 0.5in; }
            }
        `}} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-3 space-y-6 no-print">
          <div className="bg-white shadow sm:rounded-lg p-6 border border-slate-200 sticky top-24">
            <h3 className="text-lg leading-6 font-medium text-slate-900 flex items-center mb-4">
              <BookOpen className="h-5 w-5 mr-2 text-green-600" />
              Lesson Parameters
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                <select name="subject" required value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} className="block w-full border-slate-300 rounded-md border p-2 text-sm outline-none focus:ring-1 focus:ring-green-500">
                    <option value="">Select Subject</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="English Language">English Language</option>
                    <option value="Science">Science</option>
                    <option value="Social Studies">Social Studies</option>
                    <option value="HFLE">HFLE</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Grade Level</label>
                <select name="grade" required value={formData.grade} onChange={(e) => setFormData({...formData, grade: e.target.value})} className="block w-full border-slate-300 rounded-md border p-2 text-sm outline-none focus:ring-1 focus:ring-green-500">
                    <option value="">Select Grade</option>
                    {['1','2','3','4','5','6','7','8','9','10','11'].map(g => (
                        <option key={g} value={`Grade ${g}`}>Grade {g}</option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Topic</label>
                <input type="text" name="topic" required value={formData.topic} onChange={(e) => setFormData({...formData, topic: e.target.value})} className="block w-full border-slate-300 rounded-md border p-2 text-sm focus:ring-1 focus:ring-green-500 outline-none" placeholder="e.g. Parts of a Plant" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Duration</label>
                <input type="text" name="duration" required value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} className="block w-full border-slate-300 rounded-md border p-2 text-sm focus:ring-1 focus:ring-green-500 outline-none" placeholder="e.g. 40 Minutes" />
              </div>
              <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-slate-300 transition-colors">
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Generate Plan'}
              </button>
            </form>
            {error && <p className="mt-4 text-xs text-red-600 bg-red-50 p-2 rounded">{error}</p>}
          </div>
        </div>

        <div className="lg:col-span-9">
            <div className="bg-slate-200 p-4 md:p-8 rounded-lg min-h-[600px] flex flex-col items-center overflow-x-auto no-print">
                {lessonPlanHtml && (
                    <div className="w-full mb-4 flex justify-between items-center bg-white p-2 rounded shadow-sm max-w-[11in]">
                        <span className="text-sm text-slate-500 font-medium px-2 flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" /> MoE Compliant (Letter Landscape)
                        </span>
                        <div className="flex gap-2">
                             <button onClick={handlePrint} className="inline-flex items-center px-3 py-1.5 border border-slate-300 text-xs font-medium rounded text-slate-700 bg-white hover:bg-slate-50">
                                <Printer className="h-4 w-4 mr-1 text-slate-500" /> Print
                            </button>
                            <button onClick={handleDownloadDocx} className="inline-flex items-center px-3 py-1.5 rounded text-white bg-blue-600 hover:bg-blue-700 text-xs shadow-sm">
                                <Download className="h-4 w-4 mr-1" /> Download .doc
                            </button>
                        </div>
                    </div>
                )}

                <div className="bg-white shadow-2xl mx-auto shrink-0 print-area" style={{ width: '11in', minHeight: '8.5in', padding: '0.75in', boxSizing: 'border-box' }}>
                    {loading && (
                        <div className="flex flex-col items-center justify-center h-[400px]">
                            <Loader2 className="h-12 w-12 animate-spin text-green-600 mb-4" />
                            <p className="text-lg font-medium text-slate-600 italic">Weekly Curriculum Sync in progress...</p>
                            <p className="text-xs text-slate-400 mt-2">Fetching 2024/2025 MoE renewed standards</p>
                        </div>
                    )}
                    {lessonPlanHtml && (
                        <div 
                            ref={contentRef}
                            className="lesson-plan-output 
                                       [&_table]:border-collapse [&_table]:border-2 [&_table]:border-black [&_table]:w-full
                                       [&_td]:border [&_td]:border-black [&_td]:p-2 [&_td]:align-top [&_td]:text-[8.5pt] [&_td]:leading-tight
                                       [&_th]:border [&_th]:border-black [&_th]:p-2 [&_th]:bg-slate-100 [&_th]:text-[8.5pt] [&_th]:font-bold
                                       [&_h2]:text-center [&_h2]:font-bold [&_h2]:mb-4 [&_h2]:text-lg [&_h2]:uppercase
                                       [&_b]:text-slate-900"
                            style={{ fontFamily: '"Times New Roman", Times, serif' }}
                            dangerouslySetInnerHTML={{ __html: lessonPlanHtml }}
                        />
                    )}
                    {!loading && !lessonPlanHtml && (
                         <div className="flex flex-col items-center justify-center h-[400px] text-slate-400">
                            <FileText className="h-16 w-16 mb-4 opacity-10" />
                            <p className="font-medium">Define your lesson parameters to generate the official template.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPlanner;