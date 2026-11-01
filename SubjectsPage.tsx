import { useState } from 'react';
import { addSubject, deleteSubject, getSubjectsByTeacher, getClassesByTeacher } from '../store';
import { Subject, SBAComponent, ClassRoom } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  onNavigate: (page: 'dashboard' | 'classes' | 'students' | 'subjects' | 'scores' | 'reports' | 'settings') => void;
  onNavigateToScores: (subjectId: string) => void;
}

export default function SubjectsPage({ onNavigate: _onNavigate, onNavigateToScores }: Props) {
  const [subjects, setSubjects] = useState<Subject[]>(getSubjectsByTeacher());
  const [classes] = useState<ClassRoom[]>(getClassesByTeacher());
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [classId, setClassId] = useState('');
  const [components, setComponents] = useState<SBAComponent[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Component form
  const [compName, setCompName] = useState('');
  const [compMaxMarks, setCompMaxMarks] = useState('');
  const [compWeight, setCompWeight] = useState('');

  const addComponent = () => {
    if (!compName.trim() || !compMaxMarks || !compWeight) return;
    const newComp: SBAComponent = {
      id: uuidv4(),
      name: compName.trim(),
      maxMarks: Number(compMaxMarks),
      weight: Number(compWeight),
    };
    setComponents([...components, newComp]);
    setCompName('');
    setCompMaxMarks('');
    setCompWeight('');
  };

  const removeComponent = (id: string) => {
    setComponents(components.filter(c => c.id !== id));
  };

  const totalWeight = components.reduce((sum, c) => sum + c.weight, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim() || !classId || components.length === 0) return;
    addSubject(name.trim(), code.trim(), classId, components);
    setSubjects(getSubjectsByTeacher());
    setName('');
    setCode('');
    setClassId('');
    setComponents([]);
    setShowForm(false);
  };

  const handleDelete = (subjectId: string) => {
    deleteSubject(subjectId);
    setSubjects(getSubjectsByTeacher());
    setDeleteConfirm(null);
  };

  const getClassName = (cId: string) => {
    const cls = classes.find(c => c.id === cId);
    return cls ? cls.name : 'Unknown';
  };

  // Preset templates
  const presetTemplates = [
    {
      name: 'CSEC Mathematics',
      code: 'MAT',
      components: [
        { name: 'Paper 1 (Objectives)', maxMarks: 60, weight: 30 },
        { name: 'Paper 2 (Structured)', maxMarks: 100, weight: 50 },
        { name: 'School-Based Assessment', maxMarks: 20, weight: 20 },
      ]
    },
    {
      name: 'CSEC English A',
      code: 'ENG',
      components: [
        { name: 'Paper 1', maxMarks: 50, weight: 30 },
        { name: 'Paper 2', maxMarks: 50, weight: 30 },
        { name: 'Oral Presentation', maxMarks: 30, weight: 20 },
        { name: 'School-Based Assessment', maxMarks: 20, weight: 20 },
      ]
    },
    {
      name: 'CSEC Physics',
      code: 'PHY',
      components: [
        { name: 'Paper 1 (Objectives)', maxMarks: 60, weight: 30 },
        { name: 'Paper 2 (Structured/Essay)', maxMarks: 100, weight: 50 },
        { name: 'Practical Assessment (SBA)', maxMarks: 20, weight: 20 },
      ]
    },
    {
      name: 'CSEC Chemistry',
      code: 'CHE',
      components: [
        { name: 'Paper 1 (Objectives)', maxMarks: 60, weight: 30 },
        { name: 'Paper 2 (Structured/Essay)', maxMarks: 100, weight: 50 },
        { name: 'Practical Assessment (SBA)', maxMarks: 20, weight: 20 },
      ]
    },
    {
      name: 'CSEC Biology',
      code: 'BIO',
      components: [
        { name: 'Paper 1 (Objectives)', maxMarks: 60, weight: 30 },
        { name: 'Paper 2 (Structured/Essay)', maxMarks: 100, weight: 50 },
        { name: 'Practical Assessment (SBA)', maxMarks: 20, weight: 20 },
      ]
    },
  ];

  const applyTemplate = (template: typeof presetTemplates[0]) => {
    setName(template.name);
    setCode(template.code);
    setComponents(template.components.map(c => ({ ...c, id: uuidv4() })));
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Subjects</h1>
          <p className="text-sm text-gray-500">{subjects.length} subject{subjects.length !== 1 ? 's' : ''}</p>
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
          <h3 className="font-semibold text-gray-800 mb-3">Add Subject</h3>

          {/* Templates */}
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-600 mb-2">Quick Templates:</p>
            <div className="flex flex-wrap gap-2">
              {presetTemplates.map((t, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => applyTemplate(t)}
                  className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors"
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Subject Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                  placeholder="Mathematics"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Subject Code</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                  placeholder="MAT"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Class</label>
              <select
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
              >
                <option value="">Select a class</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.level})</option>
                ))}
              </select>
            </div>

            {/* Components */}
            <div className="border-t pt-3">
              <p className="text-sm font-medium text-gray-700 mb-2">
                SBA Components ({components.length})
                {totalWeight > 0 && (
                  <span className={`ml-2 text-xs ${totalWeight === 100 ? 'text-green-600' : 'text-red-500'}`}>
                    Total: {totalWeight}%
                  </span>
                )}
              </p>

              {components.map(comp => (
                <div key={comp.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-2 mb-2">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{comp.name}</p>
                    <p className="text-xs text-gray-500">Max: {comp.maxMarks} marks • Weight: {comp.weight}%</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeComponent(comp.id)}
                    className="text-red-400 hover:text-red-600 text-sm"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <div className="grid grid-cols-3 gap-2 mt-2">
                <input
                  type="text"
                  value={compName}
                  onChange={(e) => setCompName(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Component"
                />
                <input
                  type="number"
                  value={compMaxMarks}
                  onChange={(e) => setCompMaxMarks(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Max marks"
                />
                <div className="flex gap-1">
                  <input
                    type="number"
                    value={compWeight}
                    onChange={(e) => setCompWeight(e.target.value)}
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="%"
                  />
                  <button
                    type="button"
                    onClick={addComponent}
                    className="bg-green-500 text-white px-3 rounded-lg text-sm font-medium"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Add Subject
            </button>
          </form>
        </div>
      )}

      {/* Subjects List */}
      {subjects.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">📚</div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No Subjects Yet</h3>
          <p className="text-gray-500 text-sm">Add your first subject with SBA components</p>
        </div>
      ) : (
        <div className="space-y-3">
          {subjects.map(sub => (
            <div key={sub.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <span className="text-xl">📚</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{sub.name}</p>
                    <p className="text-sm text-gray-500">{sub.code} • {getClassName(sub.classId)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {deleteConfirm === sub.id ? (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleDelete(sub.id)}
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
                    <>
                      <button
                        onClick={() => onNavigateToScores(sub.id)}
                        className="bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
                      >
                        Enter Scores
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(sub.id)}
                        className="text-red-400 hover:text-red-600 p-2 text-sm"
                      >
                        🗑️
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {sub.components.map(comp => (
                  <span key={comp.id} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {comp.name} ({comp.maxMarks}m / {comp.weight}%)
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
