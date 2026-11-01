import { useState, useEffect } from 'react';
import { getSubjectById, getStudentsBySubject, getScoresBySubject, bulkAddScores, getClassById } from '../store';
import { Subject, Student, SBAScore } from '../types';

interface Props {
  subjectId: string | null;
  onBack: () => void;
}

export default function ScoreEntryPage({ subjectId, onBack }: Props) {
  const [subject, setSubject] = useState<Subject | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [scores, setScores] = useState<SBAScore[]>([]);
  const [selectedComponent, setSelectedComponent] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('Term 1');
  const [academicYear, setAcademicYear] = useState(new Date().getFullYear().toString());
  const [studentScores, setStudentScores] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (subjectId) {
      const sub = getSubjectById(subjectId);
      setSubject(sub);
      if (sub) {
        setStudents(getStudentsBySubject(subjectId));
        setScores(getScoresBySubject(subjectId));
        if (sub.components.length > 0) {
          setSelectedComponent(sub.components[0].id);
        }
      }
    }
  }, [subjectId]);

  // Load existing scores when component/term changes
  useEffect(() => {
    if (subjectId && selectedComponent && selectedTerm) {
      const existingScores = scores.filter(
        s => s.componentId === selectedComponent && s.term === selectedTerm && s.academicYear === academicYear
      );
      const scoreMap: Record<string, string> = {};
      existingScores.forEach(s => {
        scoreMap[s.studentId] = s.score.toString();
      });
      setStudentScores(scoreMap);
    }
  }, [selectedComponent, selectedTerm, academicYear, subjectId]);

  const handleScoreChange = (studentId: string, value: string) => {
    setStudentScores({ ...studentScores, [studentId]: value });
    setSaved(false);
  };

  const handleSaveAll = () => {
    if (!subjectId || !selectedComponent) return;

    const scoresToSave = Object.entries(studentScores)
      .filter(([_, score]) => score !== '' && !isNaN(Number(score)))
      .map(([studentId, score]) => ({
        studentId,
        score: Number(score),
      }));

    if (scoresToSave.length > 0) {
      bulkAddScores(scoresToSave, subjectId, selectedComponent, selectedTerm, academicYear);
      setScores(getScoresBySubject(subjectId));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const getStudentScore = (studentId: string) => {
    return scores.filter(s => s.studentId === studentId);
  };

  const getComponentTotal = (studentId: string) => {
    const studentScoresList = getStudentScore(studentId);
    if (!subject) return 0;
    let total = 0;
    let totalWeight = 0;
    studentScoresList.forEach(s => {
      const comp = subject.components.find(c => c.id === s.componentId);
      if (comp) {
        const percentage = (s.score / comp.maxMarks) * 100;
        total += percentage * (comp.weight / 100);
        totalWeight += comp.weight;
      }
    });
    return totalWeight > 0 ? total : 0;
  };

  const getGrade = (percentage: number): string => {
    if (percentage >= 80) return '1';
    if (percentage >= 70) return '2';
    if (percentage >= 60) return '3';
    if (percentage >= 50) return '4';
    if (percentage >= 40) return '5';
    if (percentage >= 30) return '6';
    return '7';
  };

  if (!subjectId || !subject) {
    return (
      <div className="p-4">
        <button onClick={onBack} className="text-blue-600 font-medium mb-4">← Back</button>
        <p className="text-gray-500">No subject selected</p>
      </div>
    );
  }

  const currentComponent = subject.components.find(c => c.id === selectedComponent);
  const classInfo = getClassById(subject.classId);

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="text-blue-600 p-2 -ml-2">←</button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-800">{subject.name}</h1>
          <p className="text-sm text-gray-500">{subject.code} • {classInfo?.name}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-4">
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Component</label>
            <select
              value={selectedComponent}
              onChange={(e) => setSelectedComponent(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            >
              {subject.components.map(comp => (
                <option key={comp.id} value={comp.id}>
                  {comp.name} (Max: {comp.maxMarks} marks, Weight: {comp.weight}%)
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Term</label>
              <select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
              >
                <option value="Term 1">Term 1</option>
                <option value="Term 2">Term 2</option>
                <option value="Term 3">Term 3</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Year</label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
              >
                <option value={(new Date().getFullYear() - 1).toString()}>{new Date().getFullYear() - 1}-{new Date().getFullYear()}</option>
                <option value={new Date().getFullYear().toString()}>{new Date().getFullYear()}-{new Date().getFullYear() + 1}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Score Entry Info */}
      {currentComponent && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
          <p className="text-sm text-blue-800">
            <strong>{currentComponent.name}</strong> — Enter scores out of <strong>{currentComponent.maxMarks}</strong> marks
          </p>
        </div>
      )}

      {/* Students Score Entry */}
      {students.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">👨‍🎓</div>
          <p className="text-gray-500 text-sm">No students in this class yet</p>
        </div>
      ) : (
        <>
          <div className="space-y-2 mb-4">
            {students.map((student, index) => (
              <div key={student.id} className="bg-white rounded-xl p-3 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium ${
                    student.gender === 'Male' ? 'bg-blue-500' : 'bg-pink-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-sm">{student.firstName} {student.lastName}</p>
                    <p className="text-xs text-gray-500">{student.studentId}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={studentScores[student.id] || ''}
                      onChange={(e) => handleScoreChange(student.id, e.target.value)}
                      className="w-16 px-2 py-2 border border-gray-300 rounded-lg text-center text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="0"
                      min="0"
                      max={currentComponent?.maxMarks || 100}
                    />
                    <span className="text-xs text-gray-400">/{currentComponent?.maxMarks}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveAll}
            className={`w-full py-3 rounded-xl font-semibold text-white transition-all shadow-md ${
              saved ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {saved ? '✓ Saved Successfully!' : '💾 Save All Scores'}
          </button>

          {/* Summary */}
          <div className="mt-6 bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3">📊 Score Summary</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-gray-600 font-medium">#</th>
                    <th className="text-left py-2 text-gray-600 font-medium">Student</th>
                    <th className="text-center py-2 text-gray-600 font-medium">Total %</th>
                    <th className="text-center py-2 text-gray-600 font-medium">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => {
                    const total = getComponentTotal(student.id);
                    const grade = getGrade(total);
                    return (
                      <tr key={student.id} className="border-b border-gray-100">
                        <td className="py-2 text-gray-500">{index + 1}</td>
                        <td className="py-2 text-gray-800">{student.firstName} {student.lastName}</td>
                        <td className="py-2 text-center font-medium">{total.toFixed(1)}%</td>
                        <td className="py-2 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                            Number(grade) <= 3 ? 'bg-green-100 text-green-700' :
                            Number(grade) <= 5 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {grade}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
