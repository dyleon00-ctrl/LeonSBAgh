import { useState } from 'react';
import { getCurrentTeacher, logoutTeacher, loadData, saveData } from '../store';

interface Props {
  onLogout: () => void;
  onBack: () => void;
}

export default function SettingsPage({ onLogout, onBack: _onBack }: Props) {
  const teacher = getCurrentTeacher();
  const [showExport, setShowExport] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const data = loadData();
  const stats = {
    classes: data.classes.filter(c => c.teacherId === data.currentTeacherId).length,
    subjects: data.subjects.filter(s => s.teacherId === data.currentTeacherId).length,
    students: data.students.filter(s => {
      const teacherClasses = data.classes.filter(c => c.teacherId === data.currentTeacherId);
      return teacherClasses.some(c => c.id === s.classId);
    }).length,
    scores: data.scores.filter(s => {
      const teacherSubjects = data.subjects.filter(sub => sub.teacherId === data.currentTeacherId);
      return teacherSubjects.some(sub => sub.id === s.subjectId);
    }).length,
  };

  const handleExport = () => {
    const exportData = {
      teacher: teacher,
      classes: data.classes.filter(c => c.teacherId === data.currentTeacherId),
      subjects: data.subjects.filter(s => s.teacherId === data.currentTeacherId),
      students: data.students,
      scores: data.scores,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sba_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    const newData = { ...data };
    newData.classes = newData.classes.filter(c => c.teacherId !== data.currentTeacherId);
    newData.subjects = newData.subjects.filter(s => s.teacherId !== data.currentTeacherId);
    // Remove students from teacher's classes
    const teacherClassIds = data.classes.filter(c => c.teacherId === data.currentTeacherId).map(c => c.id);
    newData.students = newData.students.filter(s => !teacherClassIds.includes(s.classId));
    // Remove scores from teacher's subjects
    const teacherSubjectIds = data.subjects.filter(s => s.teacherId === data.currentTeacherId).map(s => s.id);
    newData.scores = newData.scores.filter(s => !teacherSubjectIds.includes(s.subjectId));
    saveData(newData);
    setShowClearConfirm(false);
    alert('All your data has been cleared.');
  };

  const handleLogoutConfirm = () => {
    logoutTeacher();
    onLogout();
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-sm text-gray-500">Manage your account and data</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">👤</span>
          </div>
          <div>
            <p className="font-bold text-gray-800">{teacher?.name}</p>
            <p className="text-sm text-gray-500">{teacher?.email}</p>
            <p className="text-sm text-gray-500">{teacher?.school}</p>
          </div>
        </div>
      </div>

      {/* Data Stats */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-4">
        <h3 className="font-semibold text-gray-800 mb-3">📊 Your Data</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <p className="text-xl font-bold text-blue-600">{stats.classes}</p>
            <p className="text-xs text-gray-600">Classes</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <p className="text-xl font-bold text-green-600">{stats.subjects}</p>
            <p className="text-xs text-gray-600">Subjects</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <p className="text-xl font-bold text-purple-600">{stats.students}</p>
            <p className="text-xs text-gray-600">Students</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-3 text-center">
            <p className="text-xl font-bold text-orange-600">{stats.scores}</p>
            <p className="text-xs text-gray-600">Scores</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={() => setShowExport(!showExport)}
          className="w-full bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:bg-gray-50 transition-colors shadow-sm"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">📥</span>
            <div className="text-left">
              <p className="font-medium text-gray-800">Export Data</p>
              <p className="text-xs text-gray-500">Download as JSON file</p>
            </div>
          </div>
          <span className="text-gray-400">→</span>
        </button>

        {showExport && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800 mb-3">
              Export all your data including classes, subjects, students, and scores.
            </p>
            <button
              onClick={handleExport}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
            >
              📥 Download Export File
            </button>
          </div>
        )}

        <button
          onClick={() => setShowClearConfirm(!showClearConfirm)}
          className="w-full bg-white border border-red-200 rounded-xl p-4 flex items-center justify-between hover:bg-red-50 transition-colors shadow-sm"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">🗑️</span>
            <div className="text-left">
              <p className="font-medium text-red-700">Clear All Data</p>
              <p className="text-xs text-red-500">Remove all your classes, subjects, and scores</p>
            </div>
          </div>
          <span className="text-red-400">→</span>
        </button>

        {showClearConfirm && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-800 mb-3">
              ⚠️ This will permanently delete all your data. This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleClearData}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-lg font-medium hover:bg-red-700 transition-colors text-sm"
              >
                Yes, Clear Everything
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-300 transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <button
          onClick={handleLogoutConfirm}
          className="w-full bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:bg-gray-50 transition-colors shadow-sm"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">🚪</span>
            <div className="text-left">
              <p className="font-medium text-gray-800">Sign Out</p>
              <p className="text-xs text-gray-500">Log out of your account</p>
            </div>
          </div>
          <span className="text-gray-400">→</span>
        </button>
      </div>

      {/* About */}
      <div className="mt-8 text-center">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-lg font-bold text-gray-800">SBA Report System</p>
          <p className="text-sm text-gray-500 mt-1">Version 1.0.0</p>
          <p className="text-xs text-gray-400 mt-2">
            A free, mobile-friendly School-Based Assessment system
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Built for teachers, by teachers 🎓
          </p>
        </div>
      </div>
    </div>
  );
}
