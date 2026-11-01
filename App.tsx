import { useState, useEffect } from 'react';
import { getCurrentTeacher } from './store';
import { Teacher } from './types';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ClassesPage from './pages/ClassesPage';
import StudentsPage from './pages/StudentsPage';
import SubjectsPage from './pages/SubjectsPage';
import ScoreEntryPage from './pages/ScoreEntryPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';

type Page = 'dashboard' | 'classes' | 'students' | 'subjects' | 'scores' | 'reports' | 'settings';

function App() {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  useEffect(() => {
    const current = getCurrentTeacher();
    if (current) {
      setTeacher(current);
    }
  }, []);

  const handleLogin = (t: Teacher) => {
    setTeacher(t);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setTeacher(null);
    setCurrentPage('dashboard');
  };

  const navigateToScores = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    setCurrentPage('scores');
  };

  const navigateToStudents = (classId: string) => {
    setSelectedClassId(classId);
    setCurrentPage('students');
  };

  if (!teacher) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main Content */}
      <main className="flex-1 pb-20">
        {currentPage === 'dashboard' && (
          <Dashboard
            teacher={teacher}
            onNavigate={setCurrentPage}
            onNavigateToScores={navigateToScores}
            onNavigateToStudents={navigateToStudents}
          />
        )}
        {currentPage === 'classes' && (
          <ClassesPage onNavigate={setCurrentPage} onNavigateToStudents={navigateToStudents} />
        )}
        {currentPage === 'students' && (
          <StudentsPage classId={selectedClassId} onBack={() => setCurrentPage('classes')} />
        )}
        {currentPage === 'subjects' && (
          <SubjectsPage onNavigate={setCurrentPage} onNavigateToScores={navigateToScores} />
        )}
        {currentPage === 'scores' && (
          <ScoreEntryPage subjectId={selectedSubjectId} onBack={() => setCurrentPage('subjects')} />
        )}
        {currentPage === 'reports' && (
          <ReportsPage onBack={() => setCurrentPage('dashboard')} />
        )}
        {currentPage === 'settings' && (
          <SettingsPage onLogout={handleLogout} onBack={() => setCurrentPage('dashboard')} />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
          <NavButton
            icon="📊"
            label="Home"
            active={currentPage === 'dashboard'}
            onClick={() => setCurrentPage('dashboard')}
          />
          <NavButton
            icon="🏫"
            label="Classes"
            active={currentPage === 'classes'}
            onClick={() => setCurrentPage('classes')}
          />
          <NavButton
            icon="📚"
            label="Subjects"
            active={currentPage === 'subjects'}
            onClick={() => setCurrentPage('subjects')}
          />
          <NavButton
            icon="📝"
            label="Reports"
            active={currentPage === 'reports'}
            onClick={() => setCurrentPage('reports')}
          />
          <NavButton
            icon="⚙️"
            label="Settings"
            active={currentPage === 'settings'}
            onClick={() => setCurrentPage('settings')}
          />
        </div>
      </nav>
    </div>
  );
}

function NavButton({ icon, label, active, onClick }: { icon: string; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center px-3 py-1 rounded-lg transition-colors ${
        active ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className={`text-xs mt-0.5 font-medium ${active ? 'text-blue-600' : 'text-gray-500'}`}>{label}</span>
    </button>
  );
}

export default App;
