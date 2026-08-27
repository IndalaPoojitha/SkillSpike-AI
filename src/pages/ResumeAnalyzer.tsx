import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { analyzeResumeAI } from '../services/geminiService';
import { ResumeAnalysisResult } from '../types';
import {
  FileSearch,
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Award,
  Download,
  Loader2,
  Zap,
  Tag,
} from 'lucide-react';

const SAMPLE_RESUME = `ADITYA SHARMA
Email: aditya.sharma@vignan.ac.in | Phone: +91 9876543210
LinkedIn: linkedin.com/in/aditya-sharma | GitHub: github.com/aditya-sharma
College: Vignan's Institute of Information Technology, Visakhapatnam (B.Tech IT, 2023-2027) | CGPA: 8.9/10

TECHNICAL SKILLS:
- Languages: Java, C++, Python, SQL, JavaScript
- Core Concepts: Data Structures & Algorithms (DSA), Object-Oriented Programming (OOP), Database Management Systems (DBMS), Operating Systems, Computer Networks
- Frameworks & Tools: React.js, Node.js, Express.js, Git, GitHub, MySQL, Postman

PROJECTS:
1. Campus Placement Portal (Full Stack Web App)
   - Developed a full-stack platform for college placement drives using React and Node.js.
   - Built RESTful APIs for student registrations, job postings, and automated resume filtering.
   - Handled authentication using JWT tokens and stored student records in MySQL.

2. Algorithmic Pathfinding Visualizer (DSA / Java)
   - Implemented Dijkstra's and A* pathfinding algorithms with real-time interactive grid visualizations.
   - Optimized graph traversal time complexity to O((V + E) log V) using priority queues in Java.

EDUCATION:
- B.Tech in Information Technology, Vignan's Institute of Information Technology (2023 - Present) - CGPA: 8.9
- Intermediate (Class XII), Narayana Junior College (2023) - 96.4%

ACHIEVEMENTS:
- Solved 150+ DSA problems on LeetCode and GeeksforGeeks.
- Finalist in College Smart Hackathon 2024.`;

export const ResumeAnalyzer: React.FC = () => {
  const { userProfile } = useAuth();
  const { addResumeAnalysis, resumeAnalyses, showToast } = useData();
  const { setMobileSidebarOpen } = useOutletContext<{ setMobileSidebarOpen: (o: boolean) => void }>();

  const [resumeText, setResumeText] = useState(SAMPLE_RESUME);
  const [targetRole, setTargetRole] = useState(userProfile?.targetRole || 'Software Developer');
  const [fileName, setFileName] = useState<string>('Sample_Placement_Resume.txt');
  const [loading, setLoading] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<ResumeAnalysisResult | null>(
    resumeAnalyses[0] || null
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setResumeText(text || SAMPLE_RESUME);
      showToast('Resume file loaded! Click "Analyze Resume with AI".', 'success');
    };
    reader.readAsText(file);
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      showToast('Please upload or paste your resume content.', 'error');
      return;
    }

    setLoading(true);
    try {
      const result = await analyzeResumeAI({
        resumeText,
        targetRole,
        fileName,
      });

      setCurrentAnalysis(result);
      await addResumeAnalysis(result);
    } catch (err) {
      console.error(err);
      showToast('Error analyzing resume with AI. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = () => {
    if (!currentAnalysis) return;
    const content = `SKILLSPOKE AI — RESUME ATS AUDIT REPORT
File: ${currentAnalysis.fileName || 'Resume'}
Target Role: ${currentAnalysis.targetRole}
Analyzed: ${new Date(currentAnalysis.analyzedAt).toLocaleDateString()}

OVERALL ATS SCORE: ${currentAnalysis.overallScore} / 100
ATS Compatibility: ${currentAnalysis.atsCompatibilityScore}%

MATCHED KEYWORDS:
${currentAnalysis.matchedKeywords.join(', ')}

MISSING HIGH-YIELD KEYWORDS:
${currentAnalysis.missingKeywords.join(', ')}

STRENGTHS:
${currentAnalysis.strengths.map((s, i) => `${i + 1}. ${s}`).join('\n')}

AREAS TO IMPROVE:
${currentAnalysis.weaknesses.map((w, i) => `${i + 1}. ${w}`).join('\n')}

ACTIONABLE RECOMMENDATIONS:
${currentAnalysis.actionableRecommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SkillSpike_ATS_Report_${targetRole.replace(/\s+/g, '_')}.txt`;
    link.click();
    showToast('ATS Report downloaded!', 'success');
  };

  return (
    <div>
      <Header
        onMenuClick={() => setMobileSidebarOpen(true)}
        title="AI Resume Analyzer & ATS Scanner"
        subtitle="Check ATS score, detect missing placement keywords, and get section-by-section audit"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Upload & Setup Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (5/12): Resume Input & Target Role */}
          <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <FileSearch className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Upload or Paste Resume</h3>
              </div>
              <button
                onClick={() => {
                  setResumeText(SAMPLE_RESUME);
                  setFileName('Sample_Placement_Resume.txt');
                  showToast('Sample student resume loaded!', 'info');
                }}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Load Sample</span>
              </button>
            </div>

            {/* Target Role Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Target Placement Role
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Software Developer, Data Engineer"
              />
            </div>

            {/* File Upload Box */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Attach Resume File (.txt, .pdf, .docx)
              </label>
              <label className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50/60 hover:bg-blue-50/30 transition-colors cursor-pointer text-center">
                <UploadCloud className="w-6 h-6 text-blue-600 mb-1" />
                <span className="text-xs font-semibold text-slate-700">
                  {fileName ? fileName : 'Choose file or drag here'}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">TXT, PDF, DOCX supported</span>
                <input
                  type="file"
                  accept=".txt,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Resume Textarea */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Resume Content Preview
              </label>
              <textarea
                rows={9}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste plain text resume content here..."
                className="w-full p-3 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading || !resumeText.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Gemini AI is analyzing ATS compatibility...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Resume with AI</span>
                </>
              )}
            </button>
          </div>

          {/* Right Column (7/12): ATS Analysis Results */}
          <div className="lg:col-span-7 space-y-4">
            {currentAnalysis ? (
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6 animate-in fade-in">
                {/* Header with Score */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                      ATS Compliance Audit
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">
                      {currentAnalysis.targetRole} Analysis Report
                    </h3>
                    <p className="text-xs text-slate-500">{currentAnalysis.fileName || 'Resume'}</p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleExportReport}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export Report</span>
                    </button>

                    <div className="p-3 rounded-xl bg-gradient-to-tr from-emerald-50 to-teal-50 border border-emerald-200 text-center">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase">
                        ATS Score
                      </span>
                      <div className="text-2xl font-extrabold text-emerald-700">
                        {currentAnalysis.overallScore} / 100
                      </div>
                    </div>
                  </div>
                </div>

                {/* Keywords Analysis: Matched vs Missing */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                    <div className="flex items-center space-x-1.5 text-emerald-800 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Matched Keywords ({currentAnalysis.matchedKeywords.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {currentAnalysis.matchedKeywords.map((kw, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-white border border-emerald-200 text-emerald-800 text-[11px] font-semibold"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-red-50/70 border border-red-200 space-y-2">
                    <div className="flex items-center space-x-1.5 text-red-800 font-bold">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span>Missing High-Yield Keywords ({currentAnalysis.missingKeywords.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {currentAnalysis.missingKeywords.map((kw, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-white border border-red-200 text-red-800 text-[11px] font-semibold"
                        >
                          + {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Section Analyses Grid */}
                {currentAnalysis.sectionAnalyses && currentAnalysis.sectionAnalyses.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                      Section-by-Section ATS Breakdown
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {currentAnalysis.sectionAnalyses.map((sec, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900">{sec.name}</span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                sec.score >= 80
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : sec.score >= 60
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {sec.score}/100 • {sec.status}
                            </span>
                          </div>
                          <p className="text-slate-600 text-[11px] leading-relaxed">{sec.feedback}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <h5 className="font-bold text-slate-900">Key Resume Strengths</h5>
                    <ul className="list-disc list-inside text-slate-700 space-y-1">
                      {currentAnalysis.strengths.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <h5 className="font-bold text-slate-900">Areas for Improvement</h5>
                    <ul className="list-disc list-inside text-slate-700 space-y-1">
                      {currentAnalysis.weaknesses.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Actionable Recommendations */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Actionable Next Steps for Placement Shortlisting
                  </h4>
                  <div className="space-y-1.5">
                    {currentAnalysis.actionableRecommendations.map((rec, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-blue-900 flex items-start space-x-2"
                      >
                        <span className="font-bold text-blue-700 flex-shrink-0">{i + 1}.</span>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 space-y-3">
                <FileSearch className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">No Resume Analyzed Yet</h3>
                <p className="text-xs max-w-sm mx-auto">
                  Upload your resume on the left or click &quot;Load Sample&quot; to receive instant ATS scores, keyword matching, and AI bullet optimization.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
