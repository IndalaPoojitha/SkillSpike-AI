import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import {
  User,
  GraduationCap,
  Briefcase,
  Building2,
  Calendar,
  Flame,
  Save,
  CheckCircle2,
  Plus,
  X,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { userProfile, updateProfileData, isDemoUser } = useAuth();
  const { showToast } = useData();
  const { setMobileSidebarOpen } = useOutletContext<{ setMobileSidebarOpen: (o: boolean) => void }>();

  const [formData, setFormData] = useState({
    name: userProfile?.name || 'Demo Student',
    college: userProfile?.college || "Vignan's Institute of Information Technology",
    branch: userProfile?.branch || 'Information Technology',
    year: userProfile?.year || '2nd Year',
    targetRole: userProfile?.targetRole || 'Software Developer',
    targetCompany: userProfile?.targetCompany || 'Amazon',
    studyHoursPerDay: userProfile?.studyHoursPerDay || 2,
  });

  const [skills, setSkills] = useState<string[]>(
    userProfile?.skills || ['Java', 'C++', 'Basic DSA', 'SQL', 'Git', 'React.js']
  );
  const [newSkill, setNewSkill] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfileData({
        ...formData,
        skills,
      });
      showToast('Student profile updated successfully!', 'success');
    } catch (err) {
      showToast('Failed to update profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Header
        onMenuClick={() => setMobileSidebarOpen(true)}
        title="Student Profile & Placement Goals"
        subtitle="Manage your college academic information, target roles, and skill inventory"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Profile Card Header */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white flex items-center justify-center text-2xl font-extrabold shadow-md flex-shrink-0">
              {userProfile?.name?.charAt(0) || 'S'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-extrabold text-slate-900">{userProfile?.name}</h2>
                {isDemoUser && (
                  <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200">
                    Demo Mode
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {userProfile?.email} • {userProfile?.college}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center">
              <span className="text-[10px] font-bold text-amber-800 uppercase">Preparation Streak</span>
              <div className="text-lg font-bold text-amber-600 flex items-center justify-center space-x-1">
                <Flame className="w-4 h-4 fill-amber-500" />
                <span>{userProfile?.currentStreak || 5} Days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Academic & Placement Preferences</h3>
            <span className="text-xs text-slate-400">All fields synchronize with AI Mentor</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                College / University
              </label>
              <input
                type="text"
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Engineering Branch
              </label>
              <select
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Information Technology">Information Technology (IT)</option>
                <option value="Computer Science Engineering">Computer Science Engineering (CSE)</option>
                <option value="AI & Data Science">AI & Data Science (AI/DS)</option>
                <option value="Electronics & Communication">Electronics & Communication (ECE)</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Academic Year
              </label>
              <select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Target Placement Role
              </label>
              <input
                type="text"
                value={formData.targetRole}
                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Target Dream Company
              </label>
              <input
                type="text"
                value={formData.targetCompany}
                onChange={(e) => setFormData({ ...formData, targetCompany: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Daily Study Hours
              </label>
              <select
                value={formData.studyHoursPerDay}
                onChange={(e) => setFormData({ ...formData, studyHoursPerDay: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value={1}>1 Hour / Day</option>
                <option value={2}>2 Hours / Day</option>
                <option value={3}>3 Hours / Day</option>
                <option value={4}>4+ Hours / Day</option>
              </select>
            </div>
          </div>

          {/* Skills Inventory Manager */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Skill & Technology Inventory
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {skills.map((s, i) => (
                <span
                  key={i}
                  className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold"
                >
                  <span>{s}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(s)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center space-x-2 max-w-sm">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="Add skill (e.g. Spring Boot, Docker, Kafka)..."
                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-300"
              >
                Add
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving Profile...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
