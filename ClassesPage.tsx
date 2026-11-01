import { useState } from 'react';
import { addClass, deleteClass, getClassesByTeacher, getStudentsByClass } from '../store';
import { ClassRoom } from '../types';

interface Props {
  onNavigate: (page: 'dashboard' | 'classes' | 'students' | 'subjects' | 'scores' | 'reports' | 'settings') => void;
  onNavigateToStudents: (classId: string) => void;
}

export default function ClassesPage({ onNavigate: _onNavigate, onNavigateToStudents }: Props) {
  const [classes, setClasses] = useState<ClassRoom[]>(getClassesByTeacher());
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [level, setLevel] = useState('Form 4');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addClass(name.trim(), level);
    setClasses(getClassesByTeacher());
    setName('');
    setShowForm(false);
  };

  const handleDelete = (classId: string) => {
    deleteClass(classId);
    setClasses(getClassesByTeacher());
    setDeleteConfirm(null);
  };

  const levels = ['Form 1', 'Form 2', 'Form 3', 'Form 4', 'Form 5', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Classes</h1>
          <p className="text-sm text-gray-500">{classes.length} class{classes.length !== 1 ? 'es' : ''}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          {showForm ? '✕ Cancel' : '+ Add'}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-4">
          <form onSubmit={handleAdd} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="e.g., 4A, 5 Science"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                {levels.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Add Class
            </button>
          </form>
        </div>
      )}

      {/* Classes List */}
      {classes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">🏫</div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No Classes Yet</h3>
          <p className="text-gray-500 text-sm">Add your first class to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {classes.map(cls => {
            const studentCount = getStudentsByClass(cls.id).length;
            return (
              <div key={cls.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => onNavigateToStudents(cls.id)}
                    className="flex items-center gap-3 flex-1 text-left"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <span className="text-xl">🏫</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{cls.name}</p>
                      <p className="text-sm text-gray-500">{cls.level} • {studentCount} students</p>
                    </div>
                  </button>
                  <div className="flex items-center gap-2">
                    {deleteConfirm === cls.id ? (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleDelete(cls.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-xs font-medium"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-xs font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(cls.id)}
                        className="text-red-400 hover:text-red-600 p-2"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

