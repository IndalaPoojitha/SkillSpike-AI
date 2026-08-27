import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import {
  LineChart as LineChartIcon,
  TrendingUp,
  Award,
  Flame,
  CheckCircle2,
  Code2,
  BrainCircuit,
  MessageSquareCode,
  FileSearch,
  Target,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';

export const Progress: React.FC = () => {
  const { userProfile } = useAuth();
  const { getStats, quizResults, interviewSessions, dsaProgress } = useData();
  const { setMobileSidebarOpen } = useOutletContext<{ setMobileSidebarOpen: (o: boolean) => void }>();

  const stats = getStats();

  const quizTrendData = quizResults.length > 0
    ? [...quizResults].reverse().map((q, i) => ({
        name: `Test ${i + 1}`,
        accuracy: q.accuracy,
        score: q.score,
      }))
    : [
        { name: 'Mock 1', accuracy: 65, score: 6 },
        { name: 'Mock 2', accuracy: 75, score: 7 },
        { name: 'Mock 3', accuracy: 80, score: 8 },
        { name: 'Mock 4', accuracy: 85, score: 9 },
        { name: 'Mock 5', accuracy: 90, score: 9 },
      ];

  const pillarData = [
    { pillar: 'DSA Mastery', score: stats.dsaProgressPercent, target: 85 },
    { pillar: 'Aptitude Accuracy', score: stats.aptitudeProgressPercent, target: 80 },
    { pillar: 'Interview Readiness', score: stats.interviewReadinessPercent, target: 75 },
    { pillar: 'Resume ATS Score', score: stats.resumeScore, target: 85 },
  ];

  return (
    <div>
      <Header
        onMenuClick={() => setMobileSidebarOpen(true)}
        title="Placement Progress & Readiness Analytics"
        subtitle="Track your overall hiring readiness, quiz score trends, and topic mastery"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Readiness Hero Overview */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-400/20 uppercase tracking-wider">
              Hiring Probability Model
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold mt-1.5">
              Placement Readiness Index: {stats.overallReadiness}%
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Targeting {userProfile?.targetRole || 'Software Developer'} at {userProfile?.targetCompany || 'Amazon'}. You are currently on track for upcoming campus hiring cycles!
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
              <span className="text-xs text-slate-400 font-medium">Daily Streak</span>
              <div className="text-2xl font-extrabold text-amber-400 flex items-center justify-center space-x-1 mt-0.5">
                <Flame className="w-5 h-5 fill-amber-400" />
                <span>{userProfile?.currentStreak || 5} Days</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
              <span className="text-xs text-slate-400 font-medium">Target Company</span>
              <div className="text-lg font-bold text-white mt-1">
                {userProfile?.targetCompany || 'Amazon'}
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars Progress */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-600">DSA Challenge Pool</span>
              <Code2 className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mb-2">
              {stats.solvedDsaCount} / 30 Solved
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full"
                style={{ width: `${stats.dsaProgressPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-2">Target: 25+ solved before interviews</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-600">Aptitude Accuracy</span>
              <BrainCircuit className="w-4 h-4 text-violet-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mb-2">
              {stats.averageQuizScore}% Avg
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-violet-600 h-full rounded-full"
                style={{ width: `${stats.aptitudeProgressPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-2">{stats.totalQuizzesTaken} Mock Quizzes Completed</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-600">AI Mock Interviews</span>
              <MessageSquareCode className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mb-2">
              {stats.interviewReadinessPercent}% Score
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full"
                style={{ width: `${stats.interviewReadinessPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-2">{stats.totalInterviewsTaken} Rounds Practiced</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-600">Resume ATS Score</span>
              <FileSearch className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mb-2">
              {stats.resumeScore} / 100
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full"
                style={{ width: `${stats.resumeScore}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-2">ATS Shortlist Target: &gt;80</p>
          </div>
        </div>

        {/* Charts: Preparation Trends & Pillar Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Aptitude Accuracy Trend */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Aptitude Quiz Score Progression</h3>
              <p className="text-xs text-slate-500">Historical performance across mock tests</p>
            </div>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={quizTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '11px',
                      border: 'none',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="accuracy"
                    name="Accuracy %"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ fill: '#2563eb', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Pillar Competency Breakdown */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Current Score vs Hiring Target</h3>
              <p className="text-xs text-slate-500">Comparison against top product company benchmarks</p>
            </div>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pillarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="pillar" tick={{ fill: '#64748b', fontSize: 10 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '11px',
                      border: 'none',
                    }}
                  />
                  <Bar dataKey="score" name="Your Score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="target" name="Benchmark Target" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
