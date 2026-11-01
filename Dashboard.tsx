import { Teacher } from '../types';
import { getClassesByTeacher, getSubjectsByTeacher, loadData } from '../store';

interface Props {
  teacher: Teacher;
  onNavigate: (page: 'dashboard' | 'classes' | 'students' | 'subjects' | 'scores' | 'reports' | 'settings') => void;
  onNavigateToScores: (subjectId: string) => void;
  onNavigateToStudents: (classId: string) => void;
}

export default function Dashboard({ teacher, onNavigate, onNavigateToScores, onNavigateToStudents }: Props) {
  const classes = getClassesByTeacher();
  const subjects = getSubjectsByTeacher();
  const data = loadData();
  const students = data.students.filter(s => classes.some(c => c.id === s.classId));
  const scores = data.scores.filter(s => subjects.some(sub => sub.id === s.subjectId));

  return (
    <div className="p-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-5 text-white mb-6 shadow-lg">
        <h1 className="text-xl font-bold">Hello, {teacher.name.split(' ')[0]} 👋</h1>
        <p className="text-blue-100 text-sm mt-1">{teacher.school}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-3xl mb-1">🏫</div>
          <div className="text-2xl font-bold text-gray-800">{classes.length}</div>
          <div className="text-sm text-gray-500">Classes</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-3xl mb-1">📚</div>
          <div className="text-2xl font-bold text-gray-800">{subjects.length}</div>
          <div className="text-sm text-gray-500">Subjects</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-3xl mb-1">👨‍🎓</div>
          <div className="text-2xl font-bold text-gray-800">{students.length}</div>
          <div className="text-sm text-gray-500">Students</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-3xl mb-1">✅</div>
          <div className="text-2xl font-bold text-gray-800">{scores.length}</div>
          <div className="text-sm text-gray-500">Scores</div>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => onNavigate('classes')}
          className="bg-white border border-gray-200 rounded-xl p-4 text-left hover:bg-gray-50 transition-colors shadow-sm"
        >
          <span className="text-2xl">➕</span>
          <p className="font-medium text-gray-800 mt-1 text-sm">Add Class</p>
        </button>
        <button
          onClick={() => onNavigate('subjects')}
          className="bg-white border border-gray-200 rounded-xl p-4 text-left hover:bg-gray-50 transition-colors shadow-sm"
        >
          <span className="text-2xl">📝</span>
          <p className="font-medium text-gray-800 mt-1 text-sm">Enter Scores</p>
        </button>
        <button
          onClick={() => onNavigate('reports')}
          className="bg-white border border-gray-200 rounded-xl p-4 text-left hover:bg-gray-50 transition-colors shadow-sm"
        >
          <span className="text-2xl">📊</span>
          <p className="font-medium text-gray-800 mt-1 text-sm">View Reports</p>
        </button>
        <button
          onClick={() => onNavigate('students')}
          className="bg-white border border-gray-200 rounded-xl p-4 text-left hover:bg-gray-50 transition-colors shadow-sm"
        >
          <span className="text-2xl">👤</span>
          <p className="font-medium text-gray-800 mt-1 text-sm">Manage Students</p>
        </button>
      </div>

      {/* Recent Classes */}
      {classes.length > 0 && (
        <>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Your Classes</h2>
          <div className="space-y-2 mb-6">
            {classes.slice(0, 3).map(cls => (
              <button
                key={cls.id}
                onClick={() => onNavigateToStudents(cls.id)}
                className="w-full bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:bg-gray-50 transition-colors shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">🏫</span>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-800">{cls.name}</p>
                    <p className="text-sm text-gray-500">{cls.level}</p>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Recent Subjects */}
      {subjects.length > 0 && (
        <>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Your Subjects</h2>
          <div className="space-y-2">
            {subjects.slice(0, 3).map(sub => (
              <button
                key={sub.id}
                onClick={() => onNavigateToScores(sub.id)}
                className="w-full bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:bg-gray-50 transition-colors shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">📚</span>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-800">{sub.name}</p>
                    <p className="text-sm text-gray-500">{sub.code} • {sub.components.length} components</p>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Empty State */}
      {classes.length === 0 && subjects.length === 0 && (
        <div className="text-center py-8">
          <div className="text-5xl mb-4">🎓</div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Welcome to SBA Report System!</h3>
          <p className="text-gray-500 text-sm mb-4">Start by adding your first class and subject</p>
          <button
            onClick={() => onNavigate('classes')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Get Started
          </button>
        </div>
      )}
    </div>
  );
}
