import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { APTITUDE_QUESTIONS } from '../data/aptitudeQuestions';
import { AptitudeQuestion, AptitudeQuizResult } from '../types';
import { useData } from '../context/DataContext';
import {
  BrainCircuit,
  Timer,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Award,
  Flag,
  BookOpen,
} from 'lucide-react';

export const Aptitude: React.FC = () => {
  const { addQuizResult, quizResults } = useData();
  const { setMobileSidebarOpen } = useOutletContext<{ setMobileSidebarOpen: (o: boolean) => void }>();

  const [mode, setMode] = useState<'practice' | 'quiz'>('practice');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');

  // Practice mode state
  const [currentPracticeIndex, setCurrentPracticeIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Quiz mode state
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<AptitudeQuestion[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes (600s)
  const [quizFinished, setQuizFinished] = useState(false);
  const [lastResult, setLastResult] = useState<AptitudeQuizResult | null>(null);

  const categories = ['All', 'Quantitative', 'Logical', 'Verbal', 'Data Interpretation'];

  const filteredPracticeQuestions = APTITUDE_QUESTIONS.filter((q) => {
    const matchCat = selectedCategory === 'All' || q.category === selectedCategory;
    const matchTopic = selectedTopic === 'All' || q.topic === selectedTopic;
    return matchCat && matchTopic;
  });

  const currentQ = filteredPracticeQuestions[currentPracticeIndex] || APTITUDE_QUESTIONS[0];

  // Timer effect for quiz
  useEffect(() => {
    let interval: any = null;
    if (quizStarted && !quizFinished && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleFinishQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [quizStarted, quizFinished, timeLeft]);

  const handleStartQuiz = () => {
    // Select 10 random questions from diverse topics
    const shuffled = [...APTITUDE_QUESTIONS].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 10);
    setQuizQuestions(selected);
    setCurrentQuizIndex(0);
    setUserAnswers({});
    setFlagged({});
    setTimeLeft(600);
    setQuizFinished(false);
    setQuizStarted(true);
  };

  const handleSelectQuizAnswer = (optionIdx: number) => {
    const qId = quizQuestions[currentQuizIndex].id;
    setUserAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const toggleFlag = () => {
    const qId = quizQuestions[currentQuizIndex].id;
    setFlagged((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleFinishQuiz = async () => {
    let score = 0;
    const topicMap: Record<string, { correct: number; total: number }> = {};

    quizQuestions.forEach((q) => {
      if (!topicMap[q.topic]) {
        topicMap[q.topic] = { correct: 0, total: 0 };
      }
      topicMap[q.topic].total++;

      if (userAnswers[q.id] === q.correctAnswerIndex) {
        score++;
        topicMap[q.topic].correct++;
      }
    });

    const total = quizQuestions.length;
    const accuracy = Math.round((score / total) * 100);
    const timeTakenSeconds = 600 - timeLeft;

    const topicBreakdown = Object.entries(topicMap).map(([topic, val]) => ({
      topic,
      correct: val.correct,
      total: val.total,
    }));

    const weakTopics = topicBreakdown
      .filter((t) => t.correct / t.total < 0.6)
      .map((t) => t.topic);

    const result: AptitudeQuizResult = {
      id: `quiz-${Date.now()}`,
      userId: 'current-user',
      category: 'Mock Test',
      date: new Date().toISOString(),
      score,
      totalQuestions: total,
      correctAnswers: score,
      wrongAnswers: total - score,
      accuracy,
      timeTakenSeconds,
      topicBreakdown,
      recommendedTopics: weakTopics.length > 0 ? weakTopics : ['Keep practicing consistently!'],
    };

    setLastResult(result);
    setQuizFinished(true);
    await addQuizResult(result);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <Header
        onMenuClick={() => setMobileSidebarOpen(true)}
        title="Aptitude Practice & Quiz Arena"
        subtitle="Quantitative, Logical Reasoning, and Verbal Ability practice with timed mock tests"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Mode Switcher Banner */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Aptitude Placement Preparation
              </h2>
              <p className="text-xs text-slate-500">
                {quizResults.length} Quizzes Completed • Average Accuracy:{' '}
                <span className="font-bold text-violet-600">
                  {quizResults.length > 0
                    ? Math.round(
                        quizResults.reduce((acc, q) => acc + q.accuracy, 0) / quizResults.length
                      )
                    : 78}
                  %
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => {
                setMode('practice');
                setQuizStarted(false);
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === 'practice'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Practice Topic-Wise
            </button>
            <button
              onClick={() => {
                setMode('quiz');
                if (!quizStarted && !quizFinished) handleStartQuiz();
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === 'quiz'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Timed Mock Simulator (10 Qs)
            </button>
          </div>
        </div>

        {/* MODE 1: PRACTICE MODE */}
        {mode === 'practice' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Filter (4/12) */}
            <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Category Filter
                </label>
                <div className="space-y-1">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setSelectedCategory(c);
                        setCurrentPracticeIndex(0);
                        setSelectedAnswer(null);
                        setShowExplanation(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                        selectedCategory === c
                          ? 'bg-violet-50 text-violet-700 border border-violet-200'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Questions in Category ({filteredPracticeQuestions.length})
                </div>
                <div className="grid grid-cols-5 gap-1.5 max-h-48 overflow-y-auto p-1">
                  {filteredPracticeQuestions.map((q, i) => (
                    <button
                      key={q.id}
                      onClick={() => {
                        setCurrentPracticeIndex(i);
                        setSelectedAnswer(null);
                        setShowExplanation(false);
                      }}
                      className={`py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        currentPracticeIndex === i
                          ? 'bg-violet-600 text-white border-violet-600 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Question Card (8/12) */}
            <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 text-[10px] font-bold border border-violet-200 uppercase">
                    {currentQ.topic}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      currentQ.difficulty === 'Easy'
                        ? 'bg-emerald-50 text-emerald-700'
                        : currentQ.difficulty === 'Medium'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {currentQ.difficulty}
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-400">
                  Question {currentPracticeIndex + 1} of {filteredPracticeQuestions.length}
                </span>
              </div>

              {/* Question Text */}
              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
                {currentQ.question}
              </h3>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((option, idx) => {
                  const isChosen = selectedAnswer === idx;
                  const isCorrect = currentQ.correctAnswerIndex === idx;
                  const showResultState = selectedAnswer !== null;

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedAnswer(idx);
                        setShowExplanation(true);
                      }}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                        showResultState
                          ? isCorrect
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                            : isChosen
                            ? 'bg-red-50 border-red-300 text-red-900'
                            : 'bg-white border-slate-200 text-slate-400 opacity-60'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{option}</span>
                      </div>
                      {showResultState && (
                        <div>
                          {isCorrect ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          ) : isChosen ? (
                            <XCircle className="w-5 h-5 text-red-600" />
                          ) : null}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Step-by-Step Mathematical Explanation */}
              {showExplanation && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2 animate-in fade-in">
                  <div className="flex items-center space-x-1.5 text-blue-700 font-bold">
                    <BookOpen className="w-4 h-4" />
                    <span>Step-by-Step Mathematical Solution:</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed font-sans">
                    {currentQ.explanation}
                  </p>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  disabled={currentPracticeIndex === 0}
                  onClick={() => {
                    setCurrentPracticeIndex((prev) => prev - 1);
                    setSelectedAnswer(null);
                    setShowExplanation(false);
                  }}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <button
                  disabled={currentPracticeIndex === filteredPracticeQuestions.length - 1}
                  onClick={() => {
                    setCurrentPracticeIndex((prev) => prev + 1);
                    setSelectedAnswer(null);
                    setShowExplanation(false);
                  }}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs cursor-pointer"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: TIMED QUIZ SIMULATOR */}
        {mode === 'quiz' && (
          <div>
            {!quizStarted && !quizFinished && (
              <div className="max-w-xl mx-auto p-8 rounded-2xl bg-white border border-slate-200/80 shadow-md text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                  <Timer className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Campus Placement Aptitude Mock Test
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
                  Test yourself under campus drive conditions: 10 questions across Quantitative, Logical, and Verbal topics within a 10-minute timer.
                </p>
                <button
                  onClick={handleStartQuiz}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  Start 10-Minute Mock Test
                </button>
              </div>
            )}

            {quizStarted && !quizFinished && quizQuestions.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left (8/12): Current Quiz Question */}
                <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                        {quizQuestions[currentQuizIndex].topic}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={toggleFlag}
                        className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold border cursor-pointer ${
                          flagged[quizQuestions[currentQuizIndex].id]
                            ? 'bg-amber-50 border-amber-300 text-amber-700'
                            : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        <Flag className="w-3.5 h-3.5" />
                        <span>{flagged[quizQuestions[currentQuizIndex].id] ? 'Flagged' : 'Flag'}</span>
                      </button>

                      <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-slate-900 text-white font-mono text-xs font-bold">
                        <Timer className="w-3.5 h-3.5 text-amber-400" />
                        <span>{formatTime(timeLeft)}</span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
                    Q{currentQuizIndex + 1}. {quizQuestions[currentQuizIndex].question}
                  </h3>

                  {/* Options */}
                  <div className="space-y-2.5">
                    {quizQuestions[currentQuizIndex].options.map((opt, idx) => {
                      const isSelected = userAnswers[quizQuestions[currentQuizIndex].id] === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectQuizAnswer(idx)}
                          className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition-all flex items-center space-x-3 cursor-pointer ${
                            isSelected
                              ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold shadow-xs'
                              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                          }`}
                        >
                          <span
                            className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                              isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Bottom Navigation */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <button
                      disabled={currentQuizIndex === 0}
                      onClick={() => setCurrentQuizIndex((p) => p - 1)}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold disabled:opacity-40 cursor-pointer"
                    >
                      Previous
                    </button>

                    {currentQuizIndex < quizQuestions.length - 1 ? (
                      <button
                        onClick={() => setCurrentQuizIndex((p) => p + 1)}
                        className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-xs cursor-pointer"
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        onClick={handleFinishQuiz}
                        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                      >
                        Submit Test
                      </button>
                    )}
                  </div>
                </div>

                {/* Right (4/12): Question Palette */}
                <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Question Palette
                  </h4>
                  <div className="grid grid-cols-5 gap-2">
                    {quizQuestions.map((q, i) => {
                      const isAnswered = userAnswers[q.id] !== undefined;
                      const isFlagged = flagged[q.id];
                      const isCurrent = currentQuizIndex === i;

                      return (
                        <button
                          key={q.id}
                          onClick={() => setCurrentQuizIndex(i)}
                          className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            isCurrent
                              ? 'ring-2 ring-blue-500 bg-blue-600 text-white'
                              : isFlagged
                              ? 'bg-amber-100 border-amber-300 text-amber-800'
                              : isAnswered
                              ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                              : 'bg-slate-50 border-slate-200 text-slate-600'
                          }`}
                        >
                          {i + 1}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-600">
                    <div className="flex items-center space-x-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span>Answered ({Object.keys(userAnswers).length})</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-3 h-3 rounded-full bg-amber-400" />
                      <span>Flagged for Review</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-3 h-3 rounded-full bg-slate-300" />
                      <span>Not Visited / Unanswered</span>
                    </div>
                  </div>

                  <button
                    onClick={handleFinishQuiz}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Submit Test Now
                  </button>
                </div>
              </div>
            )}

            {/* Quiz Finished Results Card */}
            {quizFinished && lastResult && (
              <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-lg space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center mx-auto shadow-md">
                    <Award className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    Aptitude Test Completed!
                  </h3>
                  <p className="text-xs text-slate-500">
                    Your results have been saved to your placement readiness profile.
                  </p>
                </div>

                {/* Score Big Display */}
                <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Score
                    </span>
                    <div className="text-2xl font-extrabold text-blue-600 mt-0.5">
                      {lastResult.score} / {lastResult.totalQuestions}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Accuracy
                    </span>
                    <div className="text-2xl font-extrabold text-emerald-600 mt-0.5">
                      {lastResult.accuracy}%
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Time Taken
                    </span>
                    <div className="text-2xl font-extrabold text-slate-800 mt-0.5">
                      {formatTime(lastResult.timeTakenSeconds)}
                    </div>
                  </div>
                </div>

                {/* Recommended Focus Areas */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Recommended Revision Focus
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {lastResult.recommendedTopics.map((topic, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center space-x-3 pt-2">
                  <button
                    onClick={handleStartQuiz}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Take Another Mock Test
                  </button>
                  <button
                    onClick={() => setMode('practice')}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                  >
                    Review Questions
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
