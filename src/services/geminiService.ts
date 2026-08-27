import { CareerRoadmap, InterviewMessage, ResumeAnalysisResult } from '../types';

export async function generateRoadmapAI(params: {
  year: string;
  branch: string;
  skills: string;
  targetRole: string;
  targetCompany: string;
  dsaLevel: string;
  studyHoursPerDay: number;
  targetPlacementDate: string;
}): Promise<CareerRoadmap> {
  const response = await fetch('/api/gemini/roadmap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error('Failed to generate roadmap from AI service.');
  }

  const result = await response.json();
  const data = result.data;

  return {
    id: `roadmap-${Date.now()}`,
    userId: 'current-user',
    targetRole: params.targetRole,
    targetCompany: params.targetCompany,
    totalMonths: data.totalMonths || 6,
    generatedAt: new Date().toISOString(),
    summary: data.summary || `Placement preparation roadmap for ${params.targetRole}`,
    currentProgressPercentage: 0,
    months: data.months || [],
  };
}

export async function getNextInterviewQuestionAI(params: {
  mode: string;
  jobRole: string;
  experienceLevel: string;
  difficulty: string;
  questionIndex: number;
  conversationHistory: InterviewMessage[];
}): Promise<string> {
  const response = await fetch('/api/gemini/interview/question', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error('Failed to get next interview question.');
  }

  const result = await response.json();
  return result.question;
}

export async function evaluateInterviewAnswerAI(params: {
  question: string;
  answer: string;
  mode: string;
  jobRole: string;
  experienceLevel: string;
  difficulty: string;
}) {
  const response = await fetch('/api/gemini/interview/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error('Failed to evaluate interview answer.');
  }

  const result = await response.json();
  return result.evaluation;
}

export async function getInterviewSummaryAI(params: {
  mode: string;
  jobRole: string;
  experienceLevel: string;
  messages: InterviewMessage[];
}) {
  const response = await fetch('/api/gemini/interview/summary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error('Failed to generate interview summary.');
  }

  const result = await response.json();
  return result.summary;
}

export async function analyzeResumeAI(params: {
  resumeText: string;
  targetRole: string;
  fileName?: string;
}): Promise<ResumeAnalysisResult> {
  const response = await fetch('/api/gemini/resume-analyzer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error('Failed to analyze resume with AI.');
  }

  const result = await response.json();
  return {
    id: `resume-${Date.now()}`,
    userId: 'current-user',
    ...result.data,
  };
}

export async function sendAIChatMessage(params: {
  message: string;
  userProfile: any;
  conversationHistory: any[];
}): Promise<string> {
  const response = await fetch('/api/gemini/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error('Failed to communicate with AI Assistant.');
  }

  const result = await response.json();
  return result.reply;
}

export async function reviewDSACodeAI(params: {
  problemTitle: string;
  problemDescription: string;
  userCode: string;
  language: string;
}) {
  const response = await fetch('/api/gemini/dsa-review', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error('Failed to review DSA code.');
  }

  const result = await response.json();
  return result.review;
}
