
import React from 'react';
import { Book, Target, Compass, Layers, Flag, ShieldCheck, Search } from 'lucide-react';

const TrainingManual: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="text-center mb-16">
        <div className="bg-green-100 rounded-full p-4 w-fit mx-auto mb-6">
          <Book className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">AI Lesson Planner Training Manual</h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Technical specifications and pedagogical standards for the GuyToGo AI Curriculum Assistant.
        </p>
      </div>

      <div className="space-y-16">
        {/* Section 1: Overview */}
        <section>
          <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-2">
            <Target className="h-6 w-6 text-green-600" />
            <h2 className="text-2xl font-bold text-slate-900">1. Scope & Educational Levels</h2>
          </div>
          <p className="text-slate-600 mb-6">
            The AI is trained to support the full spectrum of the Guyanese education system, ensuring appropriate tone and complexity for each tier.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-2">Early Childhood (Nursery)</h3>
              <p className="text-sm text-slate-500">Focus: Thematic, play-based learning. Integration of the 6 developmental areas (Physical, Cognitive, Social/Emotional, etc.).</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-2">Primary (Grades 1-6)</h3>
              <p className="text-sm text-slate-500">Focus: Literacy and Numeracy foundations. National Grade Six Assessment (NGSA) preparation logic for Grade 6.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-2">Lower Secondary (Forms 1-3)</h3>
              <p className="text-sm text-slate-500">Focus: Subject-specific depth using the Consolidated Curriculum frameworks (Grades 7-9).</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-2">Upper Secondary (Forms 4-5)</h3>
              <p className="text-sm text-slate-500">Focus: CXC/CSEC Syllabus alignment. Integration of School-Based Assessment (SBA) components.</p>
            </div>
          </div>
        </section>

        {/* Section 2: Curriculum Sourcing */}
        <section>
          <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-2">
            <Search className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-slate-900">2. Official Curriculum Sourcing</h2>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
            <p className="text-blue-900 font-medium mb-4 italic">
              "The AI must cross-reference all outputs against the following official Ministry of Education (MoE) resources:"
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="h-2 w-2 bg-blue-400 rounded-full mt-2 shrink-0"></div>
                <div>
                  <span className="font-bold">Consolidated Curriculum (Primary/Lower Sec):</span>
                  <p className="text-sm text-blue-800">Use search terms: "MoE Guyana Consolidated Curriculum Grade [X] [Subject]"</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-2 w-2 bg-blue-400 rounded-full mt-2 shrink-0"></div>
                <div>
                  <span className="font-bold">CXC/CSEC Syllabi:</span>
                  <p className="text-sm text-blue-800">Reference official syllabi from <a href="https://www.cxc.org" className="underline">cxc.org</a> for Grades 10-11.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-2 w-2 bg-blue-400 rounded-full mt-2 shrink-0"></div>
                <div>
                  <span className="font-bold">Renewed Curriculum Framework 2021:</span>
                  <p className="text-sm text-blue-800">The foundational document for 21st-century competency-based learning in Guyana.</p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* Section 3: The Guyana Filter */}
        <section className="bg-slate-900 text-white p-10 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-700 pb-4">
            <Flag className="h-8 w-8 text-yellow-400" />
            <h2 className="text-3xl font-bold">The 'Guyana Filter' System</h2>
          </div>
          <p className="text-slate-300 mb-8 text-lg">
            This core instruction set ensures the AI never feels generic or foreign. It forces the model to use local nuances.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h4 className="text-yellow-400 font-bold mb-3 uppercase tracking-wider text-sm">Contextual Entities</h4>
              <ul className="space-y-3 text-slate-300">
                <li className="flex gap-2"><span>•</span> <span><b>Currency:</b> Use GYD / $ exclusively.</span></li>
                <li className="flex gap-2"><span>•</span> <span><b>Geography:</b> Mention specific villages (e.g., Buxton, Anna Regina, Lethem).</span></li>
                <li className="flex gap-2"><span>•</span> <span><b>Climate:</b> Use "Rainy Season" and "Dry Season" instead of 4 seasons.</span></li>
              </ul>
            </div>
            <div>
              <h4 className="text-yellow-400 font-bold mb-3 uppercase tracking-wider text-sm">Cultural Accuracy</h4>
              <ul className="space-y-3 text-slate-300">
                <li className="flex gap-2"><span>•</span> <span><b>Food:</b> Use Pepperpot, Cook-up rice, Roti and Curry in word problems.</span></li>
                <li className="flex gap-2"><span>•</span> <span><b>Festivals:</b> Mashramani as the national Republic celebration.</span></li>
                <li className="flex gap-2"><span>•</span> <span><b>Flora:</b> Reference the Greenheart tree or Rice cultivation.</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 4: Subject Mapping */}
        <section>
          <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-2">
            <Layers className="h-6 w-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-slate-900">4. Subject Mapping</h2>
          </div>
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Level</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Core Subjects</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Enrichment</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200 text-sm">
                <tr>
                  <td className="px-6 py-4 font-bold">Nursery</td>
                  <td className="px-6 py-4">Language, Numeracy, Health</td>
                  <td className="px-6 py-4">Art, Music, Drama</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-bold">Primary</td>
                  <td className="px-6 py-4">Math, English, Science, Social Studies</td>
                  <td className="px-6 py-4">HFLE, HF, PE</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-bold">Lower Sec</td>
                  <td className="px-6 py-4">Consolidated Core + IT</td>
                  <td className="px-6 py-4">Home Econ, Industrial Arts</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-bold">Upper Sec</td>
                  <td className="px-6 py-4">CSEC Math, English A, HSB</td>
                  <td className="px-6 py-4">CSEC Electives (EDPM, POA, etc.)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 5: Verification Checklist */}
        <section className="bg-green-50 p-8 rounded-xl border border-green-100">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-bold text-slate-900">Final Verification Checklist</h2>
          </div>
          <ul className="space-y-3">
            <li className="flex items-center gap-2 text-green-800">
              <div className="h-1.5 w-1.5 bg-green-500 rounded-full"></div>
              Does the lesson include "Knowledge, Skills, and Values"?
            </li>
            <li className="flex items-center gap-2 text-green-800">
              <div className="h-1.5 w-1.5 bg-green-500 rounded-full"></div>
              Are Teacher/Student activities clearly differentiated?
            </li>
            <li className="flex items-center gap-2 text-green-800">
              <div className="h-1.5 w-1.5 bg-green-500 rounded-full"></div>
              Is the formatting compatible with standard Guyanese MoE table logs?
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default TrainingManual;
