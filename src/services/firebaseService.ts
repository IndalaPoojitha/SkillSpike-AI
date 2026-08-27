import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  UserProfile,
  CareerRoadmap,
  AptitudeQuizResult,
  InterviewSession,
  ResumeAnalysisResult,
  DSAUserProgress,
  DailyTask,
} from '../types';
import { DEMO_ROADMAP, DEMO_TASKS, DEMO_USER } from '../data/demoData';

// Storage keys for local backup
const STORAGE_PREFIX = 'skillspike_ai_';

function getLocal<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, data: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch {
    // ignore
  }
}

// 1. USER PROFILE
export async function saveUserProfile(profile: UserProfile): Promise<void> {
  setLocal(`profile_${profile.uid}`, profile);
  try {
    const userRef = doc(db, 'users', profile.uid);
    await setDoc(userRef, profile, { merge: true });
  } catch (err) {
    console.warn('Firestore saveUserProfile fallback to local:', err);
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const local = getLocal<UserProfile | null>(`profile_${uid}`, null);
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data() as UserProfile;
      setLocal(`profile_${uid}`, data);
      return data;
    }
  } catch (err) {
    console.warn('Firestore getUserProfile fallback to local:', err);
  }
  return local || (uid === DEMO_USER.uid ? DEMO_USER : null);
}

// 2. ROADMAPS
export async function saveRoadmap(userId: string, roadmap: CareerRoadmap): Promise<void> {
  setLocal(`roadmap_${userId}`, roadmap);
  try {
    const roadmapRef = doc(db, 'roadmaps', roadmap.id);
    await setDoc(roadmapRef, { ...roadmap, userId }, { merge: true });
  } catch (err) {
    console.warn('Firestore saveRoadmap fallback:', err);
  }
}

export async function getUserRoadmap(userId: string): Promise<CareerRoadmap | null> {
  const local = getLocal<CareerRoadmap | null>(`roadmap_${userId}`, null);
  if (local) return local;

  try {
    const q = query(collection(db, 'roadmaps'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docData = querySnapshot.docs[0].data() as CareerRoadmap;
      setLocal(`roadmap_${userId}`, docData);
      return docData;
    }
  } catch (err) {
    console.warn('Firestore getUserRoadmap fallback:', err);
  }

  return userId === DEMO_USER.uid ? DEMO_ROADMAP : null;
}

// 3. DSA PROGRESS
export async function saveDSAProgress(userId: string, progress: DSAUserProgress): Promise<void> {
  const allProgress = getLocal<Record<string, DSAUserProgress>>(`dsa_${userId}`, {});
  allProgress[progress.problemId] = progress;
  setLocal(`dsa_${userId}`, allProgress);

  try {
    const docId = `${userId}_${progress.problemId}`;
    const docRef = doc(db, 'dsaProgress', docId);
    await setDoc(docRef, { ...progress, userId }, { merge: true });
  } catch (err) {
    console.warn('Firestore saveDSAProgress fallback:', err);
  }
}

export async function getDSAProgress(userId: string): Promise<Record<string, DSAUserProgress>> {
  const local = getLocal<Record<string, DSAUserProgress>>(`dsa_${userId}`, {});
  try {
    const q = query(collection(db, 'dsaProgress'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const result: Record<string, DSAUserProgress> = { ...local };
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data() as DSAUserProgress;
      result[data.problemId] = data;
    });
    setLocal(`dsa_${userId}`, result);
    return result;
  } catch (err) {
    console.warn('Firestore getDSAProgress fallback:', err);
    return local;
  }
}

// 4. QUIZ RESULTS
export async function saveQuizResult(userId: string, result: AptitudeQuizResult): Promise<void> {
  const allResults = getLocal<AptitudeQuizResult[]>(`quizzes_${userId}`, []);
  allResults.unshift(result);
  setLocal(`quizzes_${userId}`, allResults);

  try {
    const docRef = doc(db, 'quizResults', result.id);
    await setDoc(docRef, { ...result, userId });
  } catch (err) {
    console.warn('Firestore saveQuizResult fallback:', err);
  }
}

export async function getUserQuizResults(userId: string): Promise<AptitudeQuizResult[]> {
  const local = getLocal<AptitudeQuizResult[]>(`quizzes_${userId}`, []);
  try {
    const q = query(collection(db, 'quizResults'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const results: AptitudeQuizResult[] = [];
    querySnapshot.forEach((docSnap) => {
      results.push(docSnap.data() as AptitudeQuizResult);
    });
    if (results.length > 0) {
      results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setLocal(`quizzes_${userId}`, results);
      return results;
    }
  } catch (err) {
    console.warn('Firestore getUserQuizResults fallback:', err);
  }
  return local;
}

// 5. INTERVIEW SESSIONS
export async function saveInterviewSession(userId: string, session: InterviewSession): Promise<void> {
  const sessions = getLocal<InterviewSession[]>(`interviews_${userId}`, []);
  const idx = sessions.findIndex((s) => s.id === session.id);
  if (idx >= 0) {
    sessions[idx] = session;
  } else {
    sessions.unshift(session);
  }
  setLocal(`interviews_${userId}`, sessions);

  try {
    const docRef = doc(db, 'interviewSessions', session.id);
    await setDoc(docRef, { ...session, userId }, { merge: true });
  } catch (err) {
    console.warn('Firestore saveInterviewSession fallback:', err);
  }
}

export async function getUserInterviewSessions(userId: string): Promise<InterviewSession[]> {
  const local = getLocal<InterviewSession[]>(`interviews_${userId}`, []);
  try {
    const q = query(collection(db, 'interviewSessions'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const sessions: InterviewSession[] = [];
    querySnapshot.forEach((docSnap) => {
      sessions.push(docSnap.data() as InterviewSession);
    });
    if (sessions.length > 0) {
      sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setLocal(`interviews_${userId}`, sessions);
      return sessions;
    }
  } catch (err) {
    console.warn('Firestore getUserInterviewSessions fallback:', err);
  }
  return local;
}

// 6. RESUME ANALYSES
export async function saveResumeAnalysis(userId: string, analysis: ResumeAnalysisResult): Promise<void> {
  const list = getLocal<ResumeAnalysisResult[]>(`resumes_${userId}`, []);
  list.unshift(analysis);
  setLocal(`resumes_${userId}`, list);

  try {
    const docRef = doc(db, 'resumeAnalyses', analysis.id);
    await setDoc(docRef, { ...analysis, userId });
  } catch (err) {
    console.warn('Firestore saveResumeAnalysis fallback:', err);
  }
}

export async function getUserResumeAnalyses(userId: string): Promise<ResumeAnalysisResult[]> {
  const local = getLocal<ResumeAnalysisResult[]>(`resumes_${userId}`, []);
  try {
    const q = query(collection(db, 'resumeAnalyses'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const results: ResumeAnalysisResult[] = [];
    querySnapshot.forEach((docSnap) => {
      results.push(docSnap.data() as ResumeAnalysisResult);
    });
    if (results.length > 0) {
      results.sort((a, b) => new Date(b.analyzedAt).getTime() - new Date(a.analyzedAt).getTime());
      setLocal(`resumes_${userId}`, results);
      return results;
    }
  } catch (err) {
    console.warn('Firestore getUserResumeAnalyses fallback:', err);
  }
  return local;
}

// 7. DAILY TASKS
export async function getDailyTasks(userId: string): Promise<DailyTask[]> {
  const local = getLocal<DailyTask[]>(`tasks_${userId}`, DEMO_TASKS);
  return local;
}

export async function updateDailyTask(userId: string, taskId: string, completed: boolean): Promise<DailyTask[]> {
  const tasks = getLocal<DailyTask[]>(`tasks_${userId}`, DEMO_TASKS);
  const updated = tasks.map((t) => (t.id === taskId ? { ...t, completed } : t));
  setLocal(`tasks_${userId}`, updated);
  return updated;
}
