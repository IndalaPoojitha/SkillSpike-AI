export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  college: string;
  branch: string;
  year: string; // e.g. '1st Year', '2nd Year', '3rd Year', '4th Year'
  targetRole: string; // e.g. 'Software Developer', 'Full Stack Developer', 'Data Engineer'
  targetCompany?: string; // e.g. 'Amazon', 'Google', 'TCS Digital', 'Microsoft'
  dsaLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  studyHoursPerDay: number;
  skills: string[];
  avatarUrl?: string;
  createdAt: string;
  currentStreak: number;
  lastActiveDate: string;
}

export interface RoadmapTask {
  id: string;
  title: string;
  description?: string;
  type: 'dsa' | 'aptitude' | 'core' | 'project' | 'interview';
  completed: boolean;
  resourceLink?: string;
}

export interface RoadmapWeek {
  weekNumber: number;
  title: string;
  topics: string[];
  skillsToAcquire: string[];
  dsaFocus: string[];
  aptitudeFocus: string[];
  projectMilestone?: string;
  interviewPrep: string[];
  tasks: RoadmapTask[];
}

export interface RoadmapMonth {
  monthNumber: number;
  monthTitle: string;
  theme: string;
  milestone: string;
  weeks: RoadmapWeek[];
}

export interface CareerRoadmap {
  id: string;
  userId: string;
  targetRole: string;
  targetCompany?: string;
  totalMonths: number;
  generatedAt: string;
  summary: string;
  months: RoadmapMonth[];
  currentProgressPercentage: number;
}

export interface DSAProblem {
  id: string;
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  companies: string[];
  acceptanceRate: string;
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  starterCode: {
    java: string;
    python: string;
    cpp: string;
  };
  testCases: {
    input: string;
    expectedOutput: string;
  }[];
  hints: string[];
  solutionExplanation: string;
}

export interface DSAUserProgress {
  problemId: string;
  userId: string;
  status: 'solved' | 'attempted' | 'unsolved';
  lastSubmittedCode?: string;
  language?: 'java' | 'python' | 'cpp';
  solvedAt?: string;
  timeSpentMinutes?: number;
}

export interface AptitudeQuestion {
  id: string;
  category: 'Quantitative' | 'Logical' | 'Verbal' | 'Data Interpretation';
  topic: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface AptitudeQuizResult {
  id: string;
  userId: string;
  category: string;
  topic?: string;
  totalQuestions: number;
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  accuracy: number;
  timeTakenSeconds: number;
  date: string;
  topicBreakdown: {
    topic: string;
    correct: number;
    total: number;
  }[];
  recommendedTopics: string[];
}

export interface InterviewMessage {
  id: string;
  role: 'interviewer' | 'candidate';
  content: string;
  timestamp: string;
  evaluation?: {
    overallScore: number; // 0 - 10
    communicationScore: number;
    technicalScore: number;
    confidenceScore: number;
    relevanceScore: number;
    structureScore: number;
    goodPoints: string[];
    improvementPoints: string[];
    betterAnswerExample: string;
  };
}

export interface InterviewSession {
  id: string;
  userId: string;
  mode: 'HR' | 'Technical' | 'Behavioral' | 'Mock';
  jobRole: string;
  experienceLevel: 'Entry-Level / Fresher' | 'Intern' | 'Junior (1-2 yrs)';
  difficulty: 'Standard' | 'Challenging' | 'FAANG Tier';
  date: string;
  status: 'in-progress' | 'completed';
  messages: InterviewMessage[];
  finalSummary?: {
    overallScore: number;
    strengths: string[];
    weaknesses: string[];
    actionableRecommendations: string[];
    verdict: 'Strong Hire' | 'Hire' | 'Needs Practice' | 'Significant Improvement Required';
  };
}

export interface ResumeSectionAnalysis {
  name: string;
  score: number; // 0-100
  status: 'Good' | 'Needs Work' | 'Critical';
  feedback: string;
  keyFindings: string[];
}

export interface ResumeAnalysisResult {
  id: string;
  userId: string;
  targetRole: string;
  overallScore: number; // 0-100
  atsCompatibilityScore: number;
  analyzedAt: string;
  fileName?: string;
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  matchedKeywords: string[];
  sectionAnalyses: ResumeSectionAnalysis[];
  formattingSuggestions: string[];
  actionableRecommendations: string[];
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  category?: 'roadmap' | 'dsa' | 'interview' | 'general' | 'aptitude';
}

export interface DailyTask {
  id: string;
  title: string;
  category: 'dsa' | 'aptitude' | 'interview' | 'core' | 'resume';
  targetCount: number;
  currentCount: number;
  completed: boolean;
  link: string;
}
