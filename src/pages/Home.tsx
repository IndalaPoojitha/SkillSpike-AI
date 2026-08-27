import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  Code2,
  BrainCircuit,
  MessageSquareCode,
  FileSearch,
  LineChart,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Flame,
  Award,
  Zap,
  Target,
  Users,
  ChevronRight,
  ShieldCheck,
  Star,
  Github,
  GraduationCap,
  Briefcase,
  Terminal,
} from 'lucide-react';

export const Home: React.FC = () => {
  const { userProfile, isDemoUser, loginDemoUser } = useAuth();
  const navigate = useNavigate();

  const handleDemoStart = () => {
    loginDemoUser();
    navigate('/dashboard');
  };

  const features = [
    {
      icon: Compass,
      title: 'AI Career Roadmap',
      badge: 'Personalized',
      description:
        'Generate month-by-month and week-by-week placement roadmaps customized to your college year, branch, target role (Amazon, Google, TCS), and daily study hours.',
      link: '/roadmap',
      color: 'from-blue-600 to-indigo-600',
    },
    {
      icon: Code2,
      title: 'DSA Practice Arena',
      badge: '30+ Top Problems',
      description:
        'Curated placement problems across Arrays, Trees, DP, and Graphs. Includes in-browser code editor for Java, Python, and C++ with instant AI code reviews.',
      link: '/dsa',
      color: 'from-indigo-600 to-violet-600',
    },
    {
      icon: BrainCircuit,
      title: 'Aptitude Practice & Quizzes',
      badge: 'Timed Simulator',
      description:
        'Master Quantitative Aptitude (Percentages, Time & Work, Speed), Logical Reasoning, and Verbal Ability with timed test simulators and step-by-step mathematical explanations.',
      link: '/aptitude',
      color: 'from-violet-600 to-purple-600',
    },
    {
      icon: MessageSquareCode,
      title: 'AI Interview Coach',
      badge: 'Voice & Text',
      description:
        'Conduct realistic HR, Technical, and Behavioral mock interviews. Gemini AI evaluates your answers on technical depth, communication, and structure out of 10.',
      link: '/interview',
      color: 'from-blue-600 to-cyan-600',
    },
    {
      icon: FileSearch,
      title: 'AI Resume Analyzer',
      badge: 'ATS Scanner',
      description:
        'Upload your PDF resume to receive an ATS compatibility score, detect missing high-yield keywords (DSA, SQL, REST APIs), and get Google XYZ-formula bullet rewrites.',
      link: '/resume-analyzer',
      color: 'from-emerald-600 to-teal-600',
    },
    {
      icon: LineChart,
      title: 'Progress Analytics',
      badge: 'Readiness Index',
      description:
        'Track your preparation streak, daily tasks, topic mastery percentages, and comprehensive readiness metrics to know exactly when you are ready for placement day.',
      link: '/dashboard',
      color: 'from-amber-600 to-orange-600',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Create Your Student Profile',
      desc: 'Tell us your college, branch, year (e.g. 2nd Year IT), and current skills.',
    },
    {
      step: '02',
      title: 'Choose Target Role & Company',
      desc: 'Set your sights on Software Developer, Data Engineer, or top product firms.',
    },
    {
      step: '03',
      title: 'Get Your Personalized AI Roadmap',
      desc: 'Receive a tailored month-by-month study blueprint built by Gemini AI.',
    },
    {
      step: '04',
      title: 'Practice DSA, Aptitude & Interviews',
      desc: 'Solve curated coding challenges and take timed quizzes with live AI feedback.',
    },
    {
      step: '05',
      title: 'Track Readiness & Ace Placements',
      desc: 'Monitor your preparation index and step into campus drives with 100% confidence.',
    },
  ];

  const testimonials = [
    {
      name: 'Aditya Sharma',
      role: 'Placed at Amazon (SDE-1)',
      college: 'IIT Kharagpur',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80',
      content:
        'The AI Interview Coach was a game-changer. The constructive feedback on my DSA explanations and the STAR method evaluation helped me crack my Amazon technical round.',
    },
    {
      name: 'Pooja Reddy',
      role: 'Placed at Microsoft',
      college: "Vignan's Institute of Information Technology",
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      content:
        'SkillSpike AI generated a 6-month roadmap specifically for my 2nd-year IT curriculum. The aptitude quizzes and daily streak tracker kept me disciplined every single day.',
    },
    {
      name: 'Rohan Deshmukh',
      role: 'Placed at TCS Digital',
      college: 'Pune Institute of Computer Technology',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      content:
        'The Resume Analyzer pointed out that my resume was missing key SQL and Git keywords. After fixing them using the AI suggestions, I got shortlisted for every interview!',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-600 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-blue-400/20 via-indigo-400/20 to-purple-400/15 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Top Pill */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold shadow-xs mb-6 animate-in fade-in slide-in-from-top-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Next-Gen Placement Suite for College Engineers</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15] mb-6">
              Crack Your Dream Placement With{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                SkillSpike AI
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed mb-9 max-w-2xl mx-auto">
              Personalized preparation, smarter practice, and AI-powered career guidance — all in one place.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-12">
              <Link
                to={userProfile || isDemoUser ? '/dashboard' : '/register'}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02]"
              >
                <span>Start Preparing Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={handleDemoStart}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm border border-slate-200 transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4 text-indigo-600" />
                <span>Instant Demo Mode</span>
              </button>

              <a
                href="#features"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-300 transition-all"
              >
                <span>Explore Features</span>
              </a>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-6 border-t border-slate-200/80">
              <div className="p-3">
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">30+</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Top Placement DSA Problems</div>
              </div>
              <div className="p-3">
                <div className="text-2xl sm:text-3xl font-extrabold text-blue-600">6 Months</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Structured AI Roadmaps</div>
              </div>
              <div className="p-3">
                <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600">4 Modes</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">AI Mock Interview Rounds</div>
              </div>
              <div className="p-3">
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">100%</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">ATS Resume Optimization</div>
              </div>
            </div>
          </div>

          {/* Placement Dashboard Interactive Preview Card */}
          <div className="mt-14 max-w-5xl mx-auto relative rounded-2xl p-2 sm:p-3 bg-gradient-to-b from-slate-200 via-slate-100 to-slate-200 shadow-2xl border border-slate-300">
            <div className="bg-slate-900 rounded-xl overflow-hidden shadow-inner text-white border border-slate-800">
              {/* Fake Mac Window Bar */}
              <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs text-slate-400 font-mono pl-2">
                    skillspike.ai/dashboard — Student Placement Control Center
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                    ACTIVE SPRINT
                  </span>
                </div>
              </div>

              {/* Preview Dashboard Content */}
              <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Left Card: Student Snapshot */}
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                      DS
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Demo Student</h4>
                      <p className="text-xs text-slate-400">2nd Year IT • Target: Amazon SDE</p>
                    </div>
                  </div>
                  <div className="space-y-2 pt-2 border-t border-slate-700/60 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>Overall Placement Readiness</span>
                      <span className="font-bold text-emerald-400">68%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full w-[68%]" />
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-amber-400 font-semibold pt-1">
                      <span className="flex items-center space-x-1">
                        <Flame className="w-3.5 h-3.5 fill-amber-400" />
                        <span>5-Day Preparation Streak</span>
                      </span>
                      <span className="text-slate-400">2 hrs/day</span>
                    </div>
                  </div>
                </div>

                {/* Middle Card: Today's Tasks */}
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 md:col-span-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Today&apos;s Placement Action Items
                      </h4>
                      <span className="text-xs text-blue-400 font-semibold">2 of 4 Completed</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-750 text-xs">
                        <div className="flex items-center space-x-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span className="text-slate-200">Solve 2 DSA problems: Arrays & Two Pointers</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-900/60 text-blue-300">DSA</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-750 text-xs">
                        <div className="flex items-center space-x-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span className="text-slate-200">Complete 15 Aptitude questions (Time & Work)</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-purple-900/60 text-purple-300">Aptitude</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-750 text-xs text-slate-400">
                    <span>AI Assistant advice: Review HashMap collision Red-Black trees.</span>
                    <button
                      onClick={handleDemoStart}
                      className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                    >
                      <span>Launch Full App</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="py-20 bg-slate-50 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
              Comprehensive Platform Capabilities
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Everything You Need to Get Hired
            </h3>
            <p className="text-slate-600 mt-3 text-base">
              Built specifically for engineering and computer science students to eliminate guesswork and guide daily placement preparation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feature.color} flex items-center justify-center text-white shadow-md`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {feature.badge}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed mb-6">
                      {feature.description}
                    </p>
                  </div>

                  <Link
                    to={feature.link}
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <span>Launch Module</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
              The 5-Step Placement Blueprint
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              How SkillSpike AI Accelerates Your Career
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between relative"
              >
                <div>
                  <span className="text-2xl font-extrabold text-blue-600 mb-3 block font-mono">
                    {step.step}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mb-2 leading-tight">
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Testimonials */}
      <section id="testimonials" className="py-20 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
              Real Student Outcomes
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              From College Campus to Top Tier Offers
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((test, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between"
              >
                <div className="mb-4">
                  <div className="flex text-amber-400 space-x-0.5 mb-3">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-700 italic leading-relaxed">
                    &ldquo;{test.content}&rdquo;
                  </p>
                </div>

                <div className="flex items-center space-x-3 pt-4 border-t border-slate-100">
                  <img
                    src={test.avatar}
                    alt={test.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <h5 className="text-sm font-bold text-slate-900">{test.name}</h5>
                    <p className="text-xs font-semibold text-blue-600">{test.role}</p>
                    <p className="text-[11px] text-slate-400">{test.college}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-extrabold text-slate-900">Frequently Asked Questions</h3>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60">
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                How does SkillSpike AI generate placement roadmaps?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                SkillSpike AI uses Gemini 2.5 on a dedicated backend server to analyze your current academic year, branch, coding proficiency, and target company to build a month-by-month, week-by-week curriculum with actionable daily checkboxes.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60">
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                Can I test all features without creating a Firebase account?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Yes! Click the &quot;Instant Demo&quot; button anywhere on the landing page to immediately explore the complete dashboard, DSA practice, aptitude quizzes, AI mock interviews, and resume analysis as a Demo Student.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60">
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                Are my uploaded resumes permanently stored?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                No. In accordance with strict privacy principles, your resume text is analyzed securely and is not stored permanently unless you explicitly choose to save your analysis report to your account.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-base font-bold text-white">SkillSpike AI</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your AI-powered placement companion. Empowering college students to crack dream campus and off-campus placements with confidence.
              </p>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
                Platform
              </h5>
              <ul className="space-y-2">
                <li><Link to="/roadmap" className="hover:text-white">AI Career Roadmap</Link></li>
                <li><Link to="/dsa" className="hover:text-white">DSA Practice Arena</Link></li>
                <li><Link to="/aptitude" className="hover:text-white">Aptitude Quizzes</Link></li>
                <li><Link to="/interview" className="hover:text-white">AI Interview Coach</Link></li>
                <li><Link to="/resume-analyzer" className="hover:text-white">Resume ATS Scanner</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
                Resources
              </h5>
              <ul className="space-y-2">
                <li><a href="#how-it-works" className="hover:text-white">How It Works</a></li>
                <li><a href="#testimonials" className="hover:text-white">Student Stories</a></li>
                <li><a href="#faq" className="hover:text-white">Placement FAQ</a></li>
                <li><Link to="/login" className="hover:text-white">Student Portal Login</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
                Legal & Security
              </h5>
              <ul className="space-y-2">
                <li><span className="hover:text-white cursor-pointer">Privacy Policy</span></li>
                <li><span className="hover:text-white cursor-pointer">Terms of Service</span></li>
                <li><span className="hover:text-white cursor-pointer">Contact Placement Support</span></li>
                <li className="flex items-center space-x-1 text-slate-300">
                  <Github className="w-3.5 h-3.5" />
                  <span>Open Source Platform</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-slate-400">
            <p>© {new Date().getFullYear()} SkillSpike AI. All rights reserved.</p>
            <p className="mt-2 sm:mt-0">Engineered with React, TypeScript, Tailwind & Gemini 2.5</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
