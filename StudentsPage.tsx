import { useState } from 'react';
import { addStudent, deleteStudent, updateStudent, getStudentsByClass, getClassById } from '../store';
import { Student } from '../types';

interface Props {
  classId: string | null;
  onBack: () => void;
}

export default function StudentsPage({ classId, onBack }: Props) {
  const [students, setStudents] = useState<Student[]>(classId ? getStudentsByClass(classId) : []);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [studentIdNum, setStudentIdNum] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const currentClass = classId ? getClassById(classId) : null;

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setStudentIdNum('');
    setGender('Male');
    setEditingStudent(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !classId) return;

    if (editingStudent) {
      updateStudent(editingStudent.id, { firstName: firstName.trim(), lastName: lastName.trim(), studentId: studentIdNum, gender });
    } else {
      addStudent(firstName.trim(), lastName.trim(), studentIdNum, classId, gender);
    }
    setStudents(getStudentsByClass(classId));
    resetForm();
  };

  const handleDelete = (studentId: string) => {
    if (!classId) return;
    deleteStudent(studentId);
    setStudents(getStudentsByClass(classId));
    setDeleteConfirm(null);
  };

  const startEdit = (student: Student) => {
    setEditingStudent(student);
    setFirstName(student.firstName);
    setLastName(student.lastName);
    setStudentIdNum(student.studentId);
    setGender(student.gender);
    setShowForm(true);
  };

  const filteredStudents = students.filter(s =>
    `${s.firstName} ${s.lastName} ${s.studentId}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // If no class selected, show all classes picker
  if (!classId) {
    return (
      <div className="p-4">
        <button onClick={onBack} className="text-blue-600 font-medium mb-4 flex items-center gap-1">
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Select a Class</h1>
        <p className="text-gray-500">Please select a class from the Classes page first.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="text-blue-600 p-2 -ml-2">
          ←
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-800">{currentClass?.name || 'Students'}</h1>
          <p className="text-sm text-gray-500">{students.length} student{students.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm text-sm"
        >
          {showForm ? '✕' : '+ Add'}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-4">
          <h3 className="font-medium text-gray-800 mb-3">
            {editingStudent ? 'Edit Student' : 'Add New Student'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                  placeholder="Smith"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Student ID #</label>
              <input
                type="text"
                value={studentIdNum}
                onChange={(e) => setStudentIdNum(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                placeholder="e.g., STU001"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Gender</label>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={gender === 'Male'}
                    onChange={() => setGender('Male')}
                    className="text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Male</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={gender === 'Female'}
                    onChange={() => setGender('Female')}
                    className="text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Female</span>
                </label>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
            >
              {editingStudent ? 'Update Student' : 'Add Student'}
            </button>
          </form>
        </div>
      )}

      {/* Search */}
      {students.length > 0 && (
        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            placeholder="🔍 Search students..."
          />
        </div>
      )}

      {/* Students List */}
      {filteredStudents.length === 0 && students.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">👨‍🎓</div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No Students Yet</h3>
          <p className="text-gray-500 text-sm">Add students to this class</p>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No students match your search</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredStudents.map((student, index) => (
            <div key={student.id} className="bg-white rounded-xl p-3 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm ${
                    student.gender === 'Male' ? 'bg-blue-500' : 'bg-pink-500'
                  }`}>
                    {student.firstName[0]}{student.lastName[0]}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{student.firstName} {student.lastName}</p>
                    <p className="text-xs text-gray-500">{student.studentId || `#${index + 1}`} • {student.gender}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => startEdit(student)}
                    className="text-blue-500 hover:text-blue-700 p-2 text-sm"
                  >
                    ✏️
                  </button>
                  {deleteConfirm === student.id ? (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(student.id)}
                      className="text-red-400 hover:text-red-600 p-2 text-sm"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
