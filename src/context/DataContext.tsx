import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import {
  CareerRoadmap,
  AptitudeQuizResult,
  InterviewSession,
  ResumeAnalysisResult,
  DSAUserProgress,
  DailyTask,
} from '../types';
import {
  getUserRoadmap,
  saveRoadmap,
  getDSAProgress,
  saveDSAProgress,
  getUserQuizResults,
  saveQuizResult,
  getUserInterviewSessions,
  saveInterviewSession,
  getUserResumeAnalyses,
  saveResumeAnalysis,
  getDailyTasks,
  updateDailyTask,
} from '../services/firebaseService';
import { DEMO_ROADMAP, DEMO_TASKS } from '../data/demoData';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface DataContextType {
  roadmap: CareerRoadmap | null;
  dsaProgress: Record<string, DSAUserProgress>;
  quizResults: AptitudeQuizResult[];
  interviewSessions: InterviewSession[];
  resumeAnalyses: ResumeAnalysisResult[];
  dailyTasks: DailyTask[];
  loadingData: boolean;
  toasts: Toast[];
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  setRoadmapData: (roadmap: CareerRoadmap) => Promise<void>;
  markRoadmapTaskComplete: (taskId: string, completed: boolean) => Promise<void>;
  updateDSAProblemStatus: (problemId: string, status: 'solved' | 'attempted', code?: string, lang?: 'java' | 'python' | 'cpp') => Promise<void>;
  addQuizResult: (result: AptitudeQuizResult) => Promise<void>;
  addInterviewSession: (session: InterviewSession) => Promise<void>;
  addResumeAnalysis: (analysis: ResumeAnalysisResult) => Promise<void>;
  toggleDailyTask: (taskId: string) => Promise<void>;
  getStats: () => {
    overallReadiness: number;
    dsaProgressPercent: number;
    aptitudeProgressPercent: number;
    interviewReadinessPercent: number;
    resumeScore: number;
    solvedDsaCount: number;
    totalQuizzesTaken: number;
    averageQuizScore: number;
    totalInterviewsTaken: number;
  };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userProfile, isDemoUser } = useAuth();
  const [roadmap, setRoadmap] = useState<CareerRoadmap | null>(null);
  const [dsaProgress, setDsaProgress] = useState<Record<string, DSAUserProgress>>({});
  const [quizResults, setQuizResults] = useState<AptitudeQuizResult[]>([]);
  const [interviewSessions, setInterviewSessions] = useState<InterviewSession[]>([]);
  const [resumeAnalyses, setResumeAnalyses] = useState<ResumeAnalysisResult[]>([]);
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>(DEMO_TASKS);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const userId = userProfile?.uid || (isDemoUser ? 'demo-student-001' : null);

  useEffect(() => {
    if (!userId) {
      setRoadmap(null);
      setDsaProgress({});
      setQuizResults([]);
      setInterviewSessions([]);
      setResumeAnalyses([]);
      setDailyTasks(DEMO_TASKS);
      setLoadingData(false);
      return;
    }

    const loadAll = async () => {
      setLoadingData(true);
      try {
        const [rm, dsa, quizzes, interviews, resumes, tasks] = await Promise.all([
          getUserRoadmap(userId),
          getDSAProgress(userId),
          getUserQuizResults(userId),
          getUserInterviewSessions(userId),
          getUserResumeAnalyses(userId),
          getDailyTasks(userId),
        ]);

        setRoadmap(rm || (isDemoUser ? DEMO_ROADMAP : null));
        setDsaProgress(dsa || (isDemoUser ? { 'dsa-1': { problemId: 'dsa-1', userId, status: 'solved' } } : {}));
        setQuizResults(quizzes || []);
        setInterviewSessions(interviews || []);
        setResumeAnalyses(resumes || []);
        setDailyTasks(tasks && tasks.length ? tasks : DEMO_TASKS);
      } catch (err) {
        console.error('Error loading user data:', err);
      } finally {
        setLoadingData(false);
      }
    };

    loadAll();
  }, [userId, isDemoUser]);

  const setRoadmapData = async (newRoadmap: CareerRoadmap) => {
    if (!userId) return;
    setRoadmap(newRoadmap);
    await saveRoadmap(userId, newRoadmap);
    showToast('AI Career Roadmap saved to your profile!', 'success');
  };

  const markRoadmapTaskComplete = async (taskId: string, completed: boolean) => {
    if (!roadmap || !userId) return;
    let totalTasks = 0;
    let completedTasks = 0;

    const updatedMonths = roadmap.months.map((m) => ({
      ...m,
      weeks: m.weeks.map((w) => ({
        ...w,
        tasks: w.tasks.map((t) => {
          const isTarget = t.id === taskId;
          const isDone = isTarget ? completed : t.completed;
          totalTasks++;
          if (isDone) completedTasks++;
          return isTarget ? { ...t, completed } : t;
        }),
      })),
    }));

    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const updatedRoadmap: CareerRoadmap = {
      ...roadmap,
      months: updatedMonths,
      currentProgressPercentage: progressPercentage,
    };

    setRoadmap(updatedRoadmap);
    await saveRoadmap(userId, updatedRoadmap);
    showToast(completed ? 'Task completed! Keep the momentum.' : 'Task updated.', 'info');
  };

  const updateDSAProblemStatus = async (
    problemId: string,
    status: 'solved' | 'attempted',
    code?: string,
    lang: 'java' | 'python' | 'cpp' = 'python'
  ) => {
    if (!userId) return;
    const progress: DSAUserProgress = {
      problemId,
      userId,
      status,
      lastSubmittedCode: code,
      language: lang,
      solvedAt: status === 'solved' ? new Date().toISOString() : undefined,
    };

    setDsaProgress((prev) => ({ ...prev, [problemId]: progress }));
    await saveDSAProgress(userId, progress);

    if (status === 'solved') {
      showToast('Problem Solved! 🎉 Progress saved.', 'success');
      // Update daily task if present
      const dsaTask = dailyTasks.find((t) => t.category === 'dsa');
      if (dsaTask && !dsaTask.completed) {
        toggleDailyTask(dsaTask.id);
      }
    }
  };

  const addQuizResult = async (result: AptitudeQuizResult) => {
    if (!userId) return;
    setQuizResults((prev) => [result, ...prev]);
    await saveQuizResult(userId, result);
    showToast(`Quiz completed! Score: ${result.score}/${result.totalQuestions}`, 'success');

    const aptTask = dailyTasks.find((t) => t.category === 'aptitude');
    if (aptTask && !aptTask.completed) {
      toggleDailyTask(aptTask.id);
    }
  };

  const addInterviewSession = async (session: InterviewSession) => {
    if (!userId) return;
    setInterviewSessions((prev) => {
      const idx = prev.findIndex((s) => s.id === session.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = session;
        return copy;
      }
      return [session, ...prev];
    });
    await saveInterviewSession(userId, session);
  };

  const addResumeAnalysis = async (analysis: ResumeAnalysisResult) => {
    if (!userId) return;
    setResumeAnalyses((prev) => [analysis, ...prev]);
    await saveResumeAnalysis(userId, analysis);
    showToast(`Resume Analyzed! ATS Score: ${analysis.atsCompatibilityScore}/100`, 'success');
  };

  const toggleDailyTask = async (taskId: string) => {
    if (!userId) return;
    const target = dailyTasks.find((t) => t.id === taskId);
    const newStatus = !target?.completed;
    const updated = await updateDailyTask(userId, taskId, newStatus);
    setDailyTasks(updated);
    if (newStatus) {
      showToast('Task marked as done!', 'success');
    }
  };

  const getStats = () => {
    const solvedCount = Object.values(dsaProgress).filter((p) => p.status === 'solved').length;
    const dsaProgressPercent = Math.min(100, Math.round((solvedCount / 15) * 100));

    const totalQuizzes = quizResults.length;
    const avgScore = totalQuizzes > 0
      ? Math.round(quizResults.reduce((acc, q) => acc + q.accuracy, 0) / totalQuizzes)
      : isDemoUser ? 78 : 0;
    const aptitudeProgressPercent = avgScore;

    const completedInterviews = interviewSessions.filter((s) => s.status === 'completed');
    const interviewReadinessPercent = completedInterviews.length > 0
      ? Math.round(
          completedInterviews.reduce((acc, i) => acc + (i.finalSummary?.overallScore ? i.finalSummary.overallScore * 10 : 75), 0) /
            completedInterviews.length
        )
      : isDemoUser ? 74 : 0;

    const latestResume = resumeAnalyses[0];
    const resumeScore = latestResume ? latestResume.overallScore : isDemoUser ? 82 : 0;

    const weights = { dsa: 0.35, aptitude: 0.2, interview: 0.25, resume: 0.2 };
    const overallReadiness = Math.round(
      dsaProgressPercent * weights.dsa +
      aptitudeProgressPercent * weights.aptitude +
      interviewReadinessPercent * weights.interview +
      resumeScore * weights.resume
    );

    return {
      overallReadiness: Math.max(isDemoUser ? 68 : 0, overallReadiness),
      dsaProgressPercent,
      aptitudeProgressPercent: Math.max(isDemoUser ? 75 : 0, aptitudeProgressPercent),
      interviewReadinessPercent: Math.max(isDemoUser ? 72 : 0, interviewReadinessPercent),
      resumeScore: Math.max(isDemoUser ? 82 : 0, resumeScore),
      solvedDsaCount: isDemoUser ? Math.max(4, solvedCount) : solvedCount,
      totalQuizzesTaken: isDemoUser ? Math.max(3, totalQuizzes) : totalQuizzes,
      averageQuizScore: avgScore || (isDemoUser ? 82 : 0),
      totalInterviewsTaken: isDemoUser ? Math.max(2, completedInterviews.length) : completedInterviews.length,
    };
  };

  const value = {
    roadmap,
    dsaProgress,
    quizResults,
    interviewSessions,
    resumeAnalyses,
    dailyTasks,
    loadingData,
    toasts,
    isChatOpen,
    setIsChatOpen,
    showToast,
    removeToast,
    setRoadmapData,
    markRoadmapTaskComplete,
    updateDSAProblemStatus,
    addQuizResult,
    addInterviewSession,
    addResumeAnalysis,
    toggleDailyTask,
    getStats,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
