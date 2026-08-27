import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { generateRoadmapAI } from '../services/geminiService';
import { CareerRoadmap, RoadmapMonth, RoadmapWeek } from '../types';
import {
  Compass,
  Sparkles,
  Calendar,
  Clock,
  Target,
  CheckCircle2,
  Circle,
  BookOpen,
  Code2,
  BrainCircuit,
  Award,
  Layers,
  RefreshCw,
  Download,
  Loader2,
  ChevronDown,
  ChevronUp,
  FileText,
} from 'lucide-react';

export const Roadmap: React.FC = () => {
  const { userProfile } = useAuth();
  const { roadmap, setRoadmapData, markRoadmapTaskComplete, showToast } = useData();
  const { setMobileSidebarOpen } = useOutletContext<{ setMobileSidebarOpen: (o: boolean) => void }>();

  const [showGenerator, setShowGenerator] = useState(!roadmap);
  const [loading, setLoading] = useState(false);
  const [expandedMonths, setExpandedMonths] = useState<Record<number, boolean>>({ 1: true });

  const [formData, setFormData] = useState({
    year: userProfile?.year || '2nd Year',
    branch: userProfile?.branch || 'Information Technology',
    skills: userProfile?.skills?.join(', ') || 'Java, C++, Basic DSA, SQL, Git',
    targetRole: userProfile?.targetRole || 'Software Developer',
    targetCompany: userProfile?.targetCompany || 'Amazon',
    dsaLevel: userProfile?.dsaLevel || 'Beginner',
    studyHoursPerDay: userProfile?.studyHoursPerDay || 2,
    targetPlacementDate: '2027-06-30',
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const generated = await generateRoadmapAI(formData);
      await setRoadmapData(generated);
      setShowGenerator(false);
      setExpandedMonths({ 1: true, 2: true });
    } catch (err: any) {
      console.error(err);
      showToast('Error generating AI roadmap. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleMonth = (monthNum: number) => {
    setExpandedMonths((prev) => ({
      ...prev,
      [monthNum]: !prev[monthNum],
    }));
  };

  const handleExportRoadmap = () => {
    if (!roadmap) return;
    const content = `SKILLSPOKE AI — PLACEMENT PREPARATION ROADMAP
Target Role: ${roadmap.targetRole}
Target Company: ${roadmap.targetCompany}
Generated: ${new Date(roadmap.generatedAt).toLocaleDateString()}
Current Completion: ${roadmap.currentProgressPercentage}%

SUMMARY:
${roadmap.summary}

==================================================
` + roadmap.months.map((m) => `
MONTH ${m.monthNumber}: ${m.monthTitle.toUpperCase()}
Theme: ${m.theme}
Milestone: ${m.milestone}

${m.weeks.map((w) => `
  Week ${w.weekNumber}: ${w.title}
  Topics: ${w.topics?.join(', ') || ''}
  Tasks:
  ${w.tasks.map((t) => `    [${t.completed ? 'X' : ' '}] ${t.title} (${t.type})`).join('\n')}
`).join('')}
`).join('\n==================================================\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SkillSpike_Roadmap_${roadmap.targetRole.replace(/\s+/g, '_')}.txt`;
    link.click();
    showToast('Roadmap exported successfully!', 'success');
  };

  return (
    <div>
      <Header
        onMenuClick={() => setMobileSidebarOpen(true)}
        title="AI Career Roadmap"
        subtitle="Custom month-by-month and week-by-week placement study blueprint"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Compass className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">
                {roadmap
                  ? `Active Preparation Blueprint: ${roadmap.targetRole} (${roadmap.targetCompany || 'Top Tech'})`
                  : 'AI Roadmap Generator'}
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              {roadmap
                ? `${roadmap.totalMonths || 6} Months Curriculum • ${roadmap.currentProgressPercentage}% Completed`
                : 'Configure your college year, branch, and target placement goals'}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {roadmap && (
              <button
                onClick={handleExportRoadmap}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export Plan</span>
              </button>
            )}

            <button
              onClick={() => setShowGenerator(!showGenerator)}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{showGenerator ? 'Close Form' : roadmap ? 'Regenerate Roadmap' : 'Create Roadmap'}</span>
            </button>
          </div>
        </div>

        {/* Generator Form Modal / Panel */}
        {showGenerator && (
          <div className="p-6 rounded-2xl bg-white border border-blue-200/80 shadow-md animate-in fade-in slide-in-from-top-3">
            <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-slate-100">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Configure Your AI Roadmap Parameters
              </h3>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Academic Year
                  </label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Branch
                  </label>
                  <input
                    type="text"
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    placeholder="e.g. Information Technology"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Target Role
                  </label>
                  <input
                    type="text"
                    value={formData.targetRole}
                    onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                    placeholder="e.g. Software Developer"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Target Company
                  </label>
                  <input
                    type="text"
                    value={formData.targetCompany}
                    onChange={(e) => setFormData({ ...formData, targetCompany: e.target.value })}
                    placeholder="e.g. Amazon, Google, TCS"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Current Skills
                  </label>
                  <input
                    type="text"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    placeholder="Java, C++, SQL, Git"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    DSA Proficiency
                  </label>
                  <select
                    value={formData.dsaLevel}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dsaLevel: e.target.value as 'Beginner' | 'Intermediate' | 'Advanced',
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Beginner">Beginner (Loops, Arrays)</option>
                    <option value="Intermediate">Intermediate (Trees, Graphs)</option>
                    <option value="Advanced">Advanced (DP, Greedy, System Design)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Daily Study Commitment
                  </label>
                  <select
                    value={formData.studyHoursPerDay}
                    onChange={(e) =>
                      setFormData({ ...formData, studyHoursPerDay: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value={1}>1 Hour / Day</option>
                    <option value={2}>2 Hours / Day (Recommended)</option>
                    <option value={3}>3 Hours / Day</option>
                    <option value={4}>4+ Hours / Day (Intensive)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all disabled:opacity-50 flex items-center space-x-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Gemini AI is crafting your roadmap...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Personalized AI Roadmap</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Roadmap Content */}
        {roadmap ? (
          <div className="space-y-6">
            {/* Overview Card */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                    Executive Preparation Strategy
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                    {roadmap.targetRole} Roadmap for {roadmap.targetCompany || 'Top Tech Companies'}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
                    {roadmap.summary}
                  </p>
                </div>

                {/* Progress Bar & Ring */}
                <div className="flex items-center space-x-4 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-right">
                    <div className="text-xs text-slate-500 font-medium">Roadmap Progress</div>
                    <div className="text-xl font-extrabold text-blue-600">
                      {roadmap.currentProgressPercentage}%
                    </div>
                  </div>
                  <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${roadmap.currentProgressPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Months Timeline */}
            <div className="space-y-4">
              {roadmap.months.map((month) => {
                const isExpanded = !!expandedMonths[month.monthNumber];
                const totalMonthTasks = month.weeks.reduce((acc, w) => acc + w.tasks.length, 0);
                const completedMonthTasks = month.weeks.reduce(
                  (acc, w) => acc + w.tasks.filter((t) => t.completed).length,
                  0
                );
                const monthPercent =
                  totalMonthTasks > 0 ? Math.round((completedMonthTasks / totalMonthTasks) * 100) : 0;

                return (
                  <div
                    key={month.monthNumber}
                    className="rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden"
                  >
                    {/* Month Header Banner */}
                    <div
                      onClick={() => toggleMonth(month.monthNumber)}
                      className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition-colors select-none"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex flex-col items-center justify-center text-blue-700 flex-shrink-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider">Month</span>
                          <span className="text-lg font-extrabold leading-none">{month.monthNumber}</span>
                        </div>
                        <div>
                          <h4 className="text-sm sm:text-base font-bold text-slate-900">
                            {month.monthTitle}
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5 max-w-xl line-clamp-1">
                            Theme: {month.theme}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="hidden sm:flex flex-col items-end">
                          <span className="text-xs font-bold text-slate-700">
                            {completedMonthTasks} / {totalMonthTasks} Tasks
                          </span>
                          <span className="text-[11px] text-slate-400">{monthPercent}% Done</span>
                        </div>
                        <div className="p-2 text-slate-400">
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </div>
                    </div>

                    {/* Month Expanded Content */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-2 border-t border-slate-100 space-y-4">
                        {/* Skills & Milestone Badge */}
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                          <div className="flex items-center space-x-1.5 text-blue-700 font-semibold">
                            <Award className="w-4 h-4" />
                            <span>Milestone: {month.milestone}</span>
                          </div>
                        </div>

                        {/* Weeks Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {month.weeks.map((week) => (
                            <div
                              key={week.weekNumber}
                              className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                                  Week {week.weekNumber}
                                </span>
                                <span className="text-[11px] text-slate-400 font-medium">
                                  {week.topics?.join(', ')}
                                </span>
                              </div>
                              <h5 className="text-xs font-bold text-slate-900 mb-3">{week.title}</h5>

                              {/* Task Checkboxes */}
                              <div className="space-y-2">
                                {week.tasks.map((task) => (
                                  <div
                                    key={task.id}
                                    onClick={() => markRoadmapTaskComplete(task.id, !task.completed)}
                                    className={`flex items-start space-x-2.5 p-2 rounded-lg border text-xs transition-all cursor-pointer ${
                                      task.completed
                                        ? 'bg-slate-50 border-slate-200 text-slate-400'
                                        : 'bg-white hover:bg-blue-50/40 border-slate-200 text-slate-800'
                                    }`}
                                  >
                                    {task.completed ? (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                    ) : (
                                      <Circle className="w-4 h-4 text-slate-300 mt-0.5 flex-shrink-0" />
                                    )}
                                    <div className="flex-1">
                                      <p
                                        className={`font-medium ${
                                          task.completed ? 'line-through text-slate-400' : 'text-slate-800'
                                        }`}
                                      >
                                        {task.title}
                                      </p>
                                      {task.type && (
                                        <span className="text-[10px] text-slate-400 uppercase font-semibold">
                                          {task.type}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No Active Roadmap Found</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Click &quot;Create Roadmap&quot; above to have Gemini AI generate your custom 6-month placement roadmap.
            </p>
            <button
              onClick={() => setShowGenerator(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm cursor-pointer"
            >
              Generate AI Roadmap
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
