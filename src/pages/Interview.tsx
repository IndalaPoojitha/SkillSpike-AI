import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import {
  getNextInterviewQuestionAI,
  evaluateInterviewAnswerAI,
  getInterviewSummaryAI,
} from '../services/geminiService';
import { InterviewMessage, InterviewSession } from '../types';
import {
  MessageSquareCode,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
  Award,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Loader2,
  Bot,
  User,
} from 'lucide-react';

export const Interview: React.FC = () => {
  const { userProfile } = useAuth();
  const { addInterviewSession, showToast } = useData();
  const { setMobileSidebarOpen } = useOutletContext<{ setMobileSidebarOpen: (o: boolean) => void }>();

  const [sessionActive, setSessionActive] = useState(false);
  const [sessionFinished, setSessionFinished] = useState(false);
  const [currentSession, setCurrentSession] = useState<InterviewSession | null>(null);

  // Setup form
  const [config, setConfig] = useState({
    mode: 'Technical' as 'HR' | 'Technical' | 'Behavioral' | 'Mock',
    jobRole: userProfile?.targetRole || 'Software Developer',
    experienceLevel: 'Entry-Level / Fresher' as 'Entry-Level / Fresher' | 'Intern' | 'Junior (1-2 yrs)',
    difficulty: 'Standard' as 'Standard' | 'Challenging' | 'FAANG Tier',
    totalQuestions: 5,
  });

  // Active session states
  const [messages, setMessages] = useState<InterviewMessage[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [answerInput, setAnswerInput] = useState<string>('');
  const [evaluating, setEvaluating] = useState<boolean>(false);
  const [questionLoading, setQuestionLoading] = useState<boolean>(false);
  const [summaryLoading, setSummaryLoading] = useState<boolean>(false);

  // Audio / Speech flags
  const [isListening, setIsListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Web Speech API speech recognition if available
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = true;
      recog.interimResults = true;
      recog.lang = 'en-US';

      recog.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setAnswerInput((prev) => (prev ? prev + ' ' + transcript : transcript));
      };

      recog.onerror = (e: any) => {
        console.warn('Speech recognition error:', e);
        setIsListening(false);
      };

      recog.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recog;
    }
  }, []);

  const speakText = (text: string) => {
    if (!ttsEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleStartSession = async () => {
    setQuestionLoading(true);
    setSessionActive(true);
    setSessionFinished(false);
    setMessages([]);
    setQuestionIndex(0);

    try {
      const firstQ = await getNextInterviewQuestionAI({
        mode: config.mode,
        jobRole: config.jobRole,
        experienceLevel: config.experienceLevel,
        difficulty: config.difficulty,
        questionIndex: 0,
        conversationHistory: [],
      });

      setCurrentQuestion(firstQ);
      speakText(firstQ);

      const firstMsg: InterviewMessage = {
        id: `q-0`,
        role: 'interviewer',
        content: firstQ,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const newSession: InterviewSession = {
        id: `interview-${Date.now()}`,
        userId: 'current-user',
        date: new Date().toISOString(),
        mode: config.mode,
        jobRole: config.jobRole,
        experienceLevel: config.experienceLevel,
        difficulty: config.difficulty,
        messages: [firstMsg],
        status: 'in-progress',
      };

      setCurrentSession(newSession);
      setMessages([firstMsg]);
    } catch (err) {
      showToast('Could not initialize interview session. Please retry.', 'error');
      setSessionActive(false);
    } finally {
      setQuestionLoading(false);
    }
  };

  const toggleMic = () => {
    if (!recognitionRef.current) {
      showToast('Speech recognition not supported in this browser. Please type your answer.', 'info');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        showToast('Listening... Speak clearly into your microphone.', 'info');
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answerInput.trim() || evaluating) return;
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const currentQText = currentQuestion;
    const currentAnsText = answerInput.trim();
    setAnswerInput('');
    setEvaluating(true);

    try {
      // 1. Evaluate with Gemini AI
      const evaluation = await evaluateInterviewAnswerAI({
        question: currentQText,
        answer: currentAnsText,
        mode: config.mode,
        jobRole: config.jobRole,
        experienceLevel: config.experienceLevel,
        difficulty: config.difficulty,
      });

      const updatedMessages: InterviewMessage[] = [
        ...messages,
        {
          id: `ans-${questionIndex}`,
          role: 'candidate',
          content: currentAnsText,
          evaluation,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ];

      setMessages(updatedMessages);

      const nextIndex = questionIndex + 1;
      setQuestionIndex(nextIndex);

      if (nextIndex >= config.totalQuestions) {
        // Wrap up interview and generate final summary
        await handleFinishInterview(updatedMessages);
      } else {
        // Fetch next question
        setQuestionLoading(true);
        const nextQ = await getNextInterviewQuestionAI({
          mode: config.mode,
          jobRole: config.jobRole,
          experienceLevel: config.experienceLevel,
          difficulty: config.difficulty,
          questionIndex: nextIndex,
          conversationHistory: updatedMessages,
        });

        setCurrentQuestion(nextQ);
        speakText(nextQ);

        const withNextQ: InterviewMessage[] = [
          ...updatedMessages,
          {
            id: `q-${nextIndex}`,
            role: 'interviewer',
            content: nextQ,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ];

        setMessages(withNextQ);
      }
    } catch (err) {
      showToast('Error analyzing answer with AI. Please try again.', 'error');
    } finally {
      setEvaluating(false);
      setQuestionLoading(false);
    }
  };

  const handleFinishInterview = async (finalMessages: InterviewMessage[]) => {
    setSummaryLoading(true);
    try {
      const summary = await getInterviewSummaryAI({
        mode: config.mode,
        jobRole: config.jobRole,
        experienceLevel: config.experienceLevel,
        messages: finalMessages,
      });

      const finishedSession: InterviewSession = {
        id: currentSession?.id || `interview-${Date.now()}`,
        userId: 'current-user',
        date: new Date().toISOString(),
        mode: config.mode,
        jobRole: config.jobRole,
        experienceLevel: config.experienceLevel,
        difficulty: config.difficulty,
        messages: finalMessages,
        finalSummary: summary,
        status: 'completed',
      };

      setCurrentSession(finishedSession);
      setSessionFinished(true);
      setSessionActive(false);
      await addInterviewSession(finishedSession);
      showToast('Interview completed! Performance report ready.', 'success');
    } catch (err) {
      showToast('Error generating final interview report.', 'error');
    } finally {
      setSummaryLoading(false);
    }
  };

  return (
    <div>
      <Header
        onMenuClick={() => setMobileSidebarOpen(true)}
        title="AI Interview Coach"
        subtitle="Practice HR, Technical, and Behavioral mock interviews with adaptive AI voice and scoring"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* INTERVIEW SETUP FORM (When not active) */}
        {!sessionActive && !sessionFinished && (
          <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-md space-y-6">
            <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <MessageSquareCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Configure Your Mock Interview Round
                </h3>
                <p className="text-xs text-slate-500">
                  Gemini AI will act as your placement hiring manager and evaluate every response.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Interview Round / Mode
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Technical', 'HR', 'Behavioral', 'Mock'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setConfig({ ...config, mode: m })}
                      className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                        config.mode === m
                          ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold shadow-xs'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      {m} Round
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Target Job Role
                  </label>
                  <input
                    type="text"
                    value={config.jobRole}
                    onChange={(e) => setConfig({ ...config, jobRole: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Software Developer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={config.difficulty}
                    onChange={(e) => setConfig({ ...config, difficulty: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Standard">Standard Campus Drive (Standard)</option>
                    <option value="Challenging">Top Product Company (Challenging)</option>
                    <option value="FAANG Tier">Tier-1 FAANG / Unicorn (FAANG Tier)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Number of Questions
                </label>
                <div className="flex space-x-3">
                  {[3, 5, 8].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setConfig({ ...config, totalQuestions: n })}
                      className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        config.totalQuestions === n
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {n} Questions
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={handleStartSession}
                  disabled={questionLoading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {questionLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Preparing Interview Room...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>Start Live AI Mock Interview</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ACTIVE INTERVIEW SESSION */}
        {sessionActive && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 8/12: Interview Chat Stream */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-md flex flex-col h-[650px] overflow-hidden">
              {/* Header */}
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">
                      {config.mode} Round • Question {questionIndex + 1} of {config.totalQuestions}
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      Target Role: {config.jobRole} ({config.difficulty})
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setTtsEnabled(!ttsEnabled)}
                    title={ttsEnabled ? 'AI Voice Enabled' : 'AI Voice Muted'}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    {ttsEnabled ? <Volume2 className="w-4 h-4 text-blue-400" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleFinishInterview(messages)}
                    className="px-3 py-1 rounded-lg bg-red-900/60 hover:bg-red-900 text-red-200 text-xs font-semibold"
                  >
                    End Round
                  </button>
                </div>
              </div>

              {/* Messages Scroll Area */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-slate-50/70 text-xs">
                {messages.map((msg, i) => (
                  <div key={msg.id || i} className="space-y-3">
                    {msg.role === 'interviewer' && (
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div className="flex-1 bg-white p-4 rounded-2xl rounded-tl-xs border border-slate-200 shadow-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-slate-900">AI Placement Interviewer</span>
                            <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                          </div>
                          <p className="text-slate-800 leading-relaxed font-medium">
                            {msg.content}
                          </p>
                        </div>
                      </div>
                    )}

                    {msg.role === 'candidate' && (
                      <div className="flex items-start justify-end space-x-3">
                        <div className="max-w-[85%] bg-blue-600 text-white p-4 rounded-2xl rounded-tr-xs shadow-xs font-medium">
                          <div className="flex items-center justify-between mb-1 opacity-80 text-[10px]">
                            <span>Your Response</span>
                            <span>{msg.timestamp}</span>
                          </div>
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        </div>
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                          {userProfile?.name?.charAt(0) || 'S'}
                        </div>
                      </div>
                    )}

                    {/* Instant Evaluation Card for this message */}
                    {msg.evaluation && (
                      <div className="p-4 rounded-xl bg-white border border-indigo-200/80 shadow-xs space-y-3 ml-11">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                          <div className="flex items-center space-x-1.5 text-indigo-700 font-bold">
                            <Sparkles className="w-4 h-4" />
                            <span>AI Performance Feedback</span>
                          </div>
                          <span className="text-xs font-extrabold text-blue-600">
                            Overall Score: {msg.evaluation.overallScore} / 10
                          </span>
                        </div>

                        {/* Scores Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                          <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-center">
                            <span className="text-slate-500 font-medium">Communication</span>
                            <div className="font-bold text-slate-900 mt-0.5">
                              {msg.evaluation.communicationScore}/10
                            </div>
                          </div>
                          <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-center">
                            <span className="text-slate-500 font-medium">Technical Depth</span>
                            <div className="font-bold text-slate-900 mt-0.5">
                              {msg.evaluation.technicalScore}/10
                            </div>
                          </div>
                          <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-center">
                            <span className="text-slate-500 font-medium">Confidence</span>
                            <div className="font-bold text-slate-900 mt-0.5">
                              {msg.evaluation.confidenceScore}/10
                            </div>
                          </div>
                          <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-center">
                            <span className="text-slate-500 font-medium">Structure</span>
                            <div className="font-bold text-slate-900 mt-0.5">
                              {msg.evaluation.structureScore}/10
                            </div>
                          </div>
                        </div>

                        {/* Feedback bullets */}
                        <div className="space-y-1 text-slate-700">
                          {msg.evaluation.goodPoints && msg.evaluation.goodPoints.length > 0 && (
                            <div className="text-emerald-700 font-semibold">
                              ✓ Good: {msg.evaluation.goodPoints[0]}
                            </div>
                          )}
                          {msg.evaluation.improvementPoints && msg.evaluation.improvementPoints.length > 0 && (
                            <div className="text-amber-700 font-semibold">
                              ⚠️ Improve: {msg.evaluation.improvementPoints[0]}
                            </div>
                          )}
                        </div>

                        {/* Model answer snippet */}
                        {msg.evaluation.betterAnswerExample && (
                          <div className="p-2.5 rounded-lg bg-indigo-50/60 border border-indigo-100 text-[11px] text-indigo-900">
                            <span className="font-bold">Model Answer Excerpt: </span>
                            {msg.evaluation.betterAnswerExample}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {evaluating && (
                  <div className="flex items-center space-x-2 p-3 bg-white border border-slate-200 rounded-xl w-fit shadow-xs ml-11">
                    <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                    <span className="text-slate-600 font-medium">
                      Gemini AI is analyzing your response on communication & technical depth...
                    </span>
                  </div>
                )}

                {questionLoading && (
                  <div className="flex items-center space-x-2 p-3 bg-white border border-slate-200 rounded-xl w-fit shadow-xs ml-11">
                    <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                    <span className="text-slate-600 font-medium">
                      Interviewer is formulating the next question...
                    </span>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-3 bg-white border-t border-slate-200 space-y-2">
                <div className="flex items-center space-x-2">
                  <textarea
                    rows={2}
                    value={answerInput}
                    onChange={(e) => setAnswerInput(e.target.value)}
                    placeholder="Speak into your microphone or type your response here..."
                    disabled={evaluating || questionLoading}
                    className="flex-1 p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                  />
                  <button
                    type="button"
                    onClick={toggleMic}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isListening
                        ? 'bg-red-500 text-white border-red-600 animate-pulse'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                    }`}
                    title={isListening ? 'Stop Listening' : 'Click to Speak'}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={handleSubmitAnswer}
                    disabled={!answerInput.trim() || evaluating || questionLoading}
                    className="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1.5 shadow-sm shadow-blue-500/20 cursor-pointer"
                  >
                    <span>Submit</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right 4/12: Interview Tips & Progress */}
            <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Interview Best Practices
              </h4>
              <div className="space-y-3 text-xs text-slate-600">
                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200">
                  <span className="font-bold text-blue-900 block mb-1">Use the STAR Method:</span>
                  <p className="text-[11px] text-blue-800 leading-relaxed">
                    <strong>S</strong>ituation • <strong>T</strong>ask • <strong>A</strong>ction • <strong>R</strong>esult. Keep answers structured and quantifiable.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-800 block mb-1">Clarify Requirements:</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    In technical rounds, state your time and space complexity before writing or explaining code.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-800 block mb-1">Voice & Tone:</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Speak steadily with confidence. AI evaluates vocabulary, filler words, and professional clarity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FINAL INTERVIEW REPORT (When finished) */}
        {sessionFinished && currentSession?.finalSummary && (
          <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-lg space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-md">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">
                Interview Performance Report
              </h3>
              <p className="text-xs text-slate-500">
                Role: {config.jobRole} • Round: {config.mode}
              </p>
            </div>

            {/* Verdict Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">
                  Placement Readiness Verdict
                </span>
                <div className="text-lg font-extrabold text-white mt-0.5">
                  {currentSession.finalSummary.verdict}
                </div>
                <p className="text-xs text-slate-300 mt-1 max-w-md">
                  Evaluation based on {currentSession.messages.length} interview exchanges.
                </p>
              </div>

              <div className="text-center sm:text-right p-3 rounded-xl bg-slate-800 border border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Overall Rating</span>
                <div className="text-3xl font-extrabold text-emerald-400">
                  {currentSession.finalSummary.overallScore} / 10
                </div>
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <div className="flex items-center space-x-1.5 text-emerald-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Key Strengths Observed</span>
                </div>
                <ul className="list-disc list-inside text-emerald-900 space-y-1 leading-relaxed">
                  {currentSession.finalSummary.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
                <div className="flex items-center space-x-1.5 text-amber-800 font-bold">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Areas to Refine</span>
                </div>
                <ul className="list-disc list-inside text-amber-900 space-y-1 leading-relaxed">
                  {currentSession.finalSummary.weaknesses.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actionable Next Steps */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Actionable Preparation Recommendations
              </h4>
              <div className="space-y-2">
                {currentSession.finalSummary.actionableRecommendations.map((step, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start space-x-2.5"
                  >
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center space-x-3 pt-3">
              <button
                onClick={() => {
                  setSessionFinished(false);
                  setSessionActive(false);
                }}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Practice Another Round
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
