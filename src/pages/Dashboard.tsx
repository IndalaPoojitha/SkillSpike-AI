import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Header } from '../components/common/Header';
import {
  Compass,
  Code2,
  BrainCircuit,
  MessageSquareCode,
  FileSearch,
  CheckCircle2,
  Circle,
  Flame,
  Clock,
  Target,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  Bot,
  Calendar,
  Zap,
  ChevronRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

export const Dashboard: React.FC = () => {
  const { userProfile, isDemoUser } = useAuth();
  const {
    dailyTasks,
    toggleDailyTask,
    getStats,
    roadmap,
    setIsChatOpen,
  } = useData();
  const { setMobileSidebarOpen } = useOutletContext<{ setMobileSidebarOpen: (o: boolean) => void }>();

  const stats = getStats();

  const radarData = [
    { subject: 'DSA', value: Math.max(30, stats.dsaProgressPercent), fullMark: 100 },
    { subject: 'Aptitude', value: Math.max(40, stats.aptitudeProgressPercent), fullMark: 100 },
    { subject: 'Interview', value: Math.max(35, stats.interviewReadinessPercent), fullMark: 100 },
    { subject: 'Resume ATS', value: Math.max(50, stats.resumeScore), fullMark: 100 },
    { subject: 'Core CS / SQL', value: 65, fullMark: 100 },
  ];

  const weeklyActivity = [
    { day: 'Mon', hours: 2.5, questions: 6 },
    { day: 'Tue', hours: 3.0, questions: 8 },
    { day: 'Wed', hours: 1.5, questions: 4 },
    { day: 'Thu', hours: 2.0, questions: 5 },
    { day: 'Fri', hours: 3.5, questions: 9 },
    { day: 'Sat', hours: 4.0, questions: 12 },
    { day: 'Sun', hours: 2.0, questions: 5 },
  ];

  const completedTaskCount = dailyTasks.filter((t) => t.completed).length;

  return (
    <div>
      <Header
        onMenuClick={() => setMobileSidebarOpen(true)}
        title="Student Placement Dashboard"
        subtitle="Track your daily progress, roadmaps, DSA challenges, and AI interview readiness"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Welcome & Target Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-blue-500/10 via-indigo-500/10 to-transparent pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-400/20 uppercase tracking-wider">
                  Target: {userProfile?.targetRole || 'Software Developer'} @ {userProfile?.targetCompany || 'Amazon'}
                </span>
                {isDemoUser && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-400/20">
                    Demo Mode Active
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Welcome back, {userProfile?.name || 'Student'}! 👋
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                {userProfile?.college} • {userProfile?.branch} ({userProfile?.year})
              </p>
            </div>

            {/* Quick Metrics Badge */}
            <div className="flex items-center gap-3">
              <div className="px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-center">
                <div className="text-xs text-slate-400 font-medium">Daily Streak</div>
                <div className="text-lg font-bold text-amber-400 flex items-center justify-center space-x-1">
                  <Flame className="w-4 h-4 fill-amber-400" />
                  <span>{userProfile?.currentStreak || 5} Days</span>
                </div>
              </div>

              <div className="px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-center">
                <div className="text-xs text-slate-400 font-medium">Placement Index</div>
                <div className="text-lg font-bold text-emerald-400">
                  {stats.overallReadiness}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Core Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: DSA Practice */}
          <Link
            to="/dsa"
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-300 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Code2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-blue-600 flex items-center space-x-1">
                <span>Solve</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mb-0.5">
              {stats.solvedDsaCount} / 30
            </div>
            <div className="text-xs font-bold text-slate-700">DSA Problems Solved</div>
            <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${stats.dsaProgressPercent}%` }}
              />
            </div>
          </Link>

          {/* Card 2: Aptitude */}
          <Link
            to="/aptitude"
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-violet-300 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-violet-600 flex items-center space-x-1">
                <span>Quiz</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mb-0.5">
              {stats.averageQuizScore}%
            </div>
            <div className="text-xs font-bold text-slate-700">Aptitude Avg Accuracy</div>
            <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-violet-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${stats.aptitudeProgressPercent}%` }}
              />
            </div>
          </Link>

          {/* Card 3: Interview Coach */}
          <Link
            to="/interview"
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <MessageSquareCode className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-indigo-600 flex items-center space-x-1">
                <span>Mock</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mb-0.5">
              {stats.interviewReadinessPercent}%
            </div>
            <div className="text-xs font-bold text-slate-700">AI Mock Readiness</div>
            <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${stats.interviewReadinessPercent}%` }}
              />
            </div>
          </Link>

          {/* Card 4: Resume Analyzer */}
          <Link
            to="/resume-analyzer"
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileSearch className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-emerald-600 flex items-center space-x-1">
                <span>Scan</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mb-0.5">
              {stats.resumeScore} / 100
            </div>
            <div className="text-xs font-bold text-slate-700">ATS Resume Score</div>
            <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${stats.resumeScore}%` }}
              />
            </div>
          </Link>
        </div>

        {/* Action Center Grid: Tasks + AI Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Today's Action Checklist */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Today&apos;s Placement Action Items
                  </h3>
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  {completedTaskCount} of {dailyTasks.length} Completed
                </span>
              </div>

              <div className="space-y-2.5">
                {dailyTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleDailyTask(task.id)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                      task.completed
                        ? 'bg-slate-50 border-slate-200 text-slate-400'
                        : 'bg-white hover:bg-blue-50/50 border-slate-200 text-slate-800 hover:border-blue-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 flex-shrink-0" />
                      )}
                      <span
                        className={`text-xs font-semibold truncate ${
                          task.completed ? 'line-through text-slate-400' : 'text-slate-800'
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0 ml-3">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase ${
                          task.category === 'dsa'
                            ? 'bg-blue-100 text-blue-700'
                            : task.category === 'aptitude'
                            ? 'bg-purple-100 text-purple-700'
                            : task.category === 'interview'
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {task.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom active roadmap link */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Current sprint: {roadmap ? `Month 1 — ${roadmap.months[0]?.monthTitle}` : 'Placement Fundamentals'}
              </span>
              <Link
                to="/roadmap"
                className="font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
              >
                <span>View Full Roadmap</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Col: AI Placement Assistant & Skill Matrix */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Readiness Competency Radar
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">
                  Live Matrix
                </span>
              </div>

              <div className="h-44 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                    <Radar
                      name="Readiness"
                      dataKey="value"
                      stroke="#2563eb"
                      fill="#3b82f6"
                      fillOpacity={0.4}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Fast Trigger */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100">
              <div className="flex items-center space-x-2 mb-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-indigo-950">
                  Ask SkillSpike Mentor
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mb-3">
                Need guidance on DSA trees, resume pointers, or company rounds?
              </p>
              <button
                onClick={() => setIsChatOpen(true)}
                className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Launch AI Assistant</span>
              </button>
            </div>
          </div>
        </div>

        {/* Weekly Activity & Study Analytics */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Weekly Preparation Intensity</h3>
              <p className="text-xs text-slate-500">Practice hours and questions solved over the last 7 days</p>
            </div>
            <div className="flex items-center space-x-4 text-xs font-medium">
              <span className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-sm bg-blue-600" />
                <span className="text-slate-600">Hours Practiced</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-sm bg-indigo-400" />
                <span className="text-slate-600">Problems Solved</span>
              </span>
            </div>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px',
                    border: 'none',
                  }}
                />
                <Bar dataKey="hours" name="Hours Practiced" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="questions" name="Questions Solved" fill="#818cf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
