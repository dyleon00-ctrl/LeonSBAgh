import { AppData, Teacher, ClassRoom, Subject, Student, SBAScore, SBAComponent } from './types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'sba_report_system_data';

const defaultData: AppData = {
  teachers: [],
  classes: [],
  subjects: [],
  students: [],
  scores: [],
  currentTeacherId: null,
};

export function loadData(): AppData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error loading data:', e);
  }
  return { ...defaultData };
}

export function saveData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving data:', e);
  }
}

// Auth functions
export function registerTeacher(name: string, email: string, password: string, school: string): Teacher | null {
  const data = loadData();
  const existing = data.teachers.find(t => t.email === email);
  if (existing) return null;

  const teacher: Teacher = {
    id: uuidv4(),
    name,
    email,
    password,
    school,
  };
  data.teachers.push(teacher);
  data.currentTeacherId = teacher.id;
  saveData(data);
  return teacher;
}

export function loginTeacher(email: string, password: string): Teacher | null {
  const data = loadData();
  const teacher = data.teachers.find(t => t.email === email && t.password === password);
  if (teacher) {
    data.currentTeacherId = teacher.id;
    saveData(data);
    return teacher;
  }
  return null;
}

export function logoutTeacher(): void {
  const data = loadData();
  data.currentTeacherId = null;
  saveData(data);
}

export function getCurrentTeacher(): Teacher | null {
  const data = loadData();
  if (!data.currentTeacherId) return null;
  return data.teachers.find(t => t.id === data.currentTeacherId) || null;
}

// Class functions
export function addClass(name: string, level: string): ClassRoom {
  const data = loadData();
  const newClass: ClassRoom = {
    id: uuidv4(),
    name,
    level,
    teacherId: data.currentTeacherId!,
  };
  data.classes.push(newClass);
  saveData(data);
  return newClass;
}

export function deleteClass(classId: string): void {
  const data = loadData();
  data.classes = data.classes.filter(c => c.id !== classId);
  data.subjects = data.subjects.filter(s => s.classId !== classId);
  data.students = data.students.filter(s => s.classId !== classId);
  saveData(data);
}

// Subject functions
export function addSubject(name: string, code: string, classId: string, components: SBAComponent[]): Subject {
  const data = loadData();
  const subject: Subject = {
    id: uuidv4(),
    name,
    code,
    classId,
    teacherId: data.currentTeacherId!,
    components,
  };
  data.subjects.push(subject);
  saveData(data);
  return subject;
}

export function deleteSubject(subjectId: string): void {
  const data = loadData();
  data.subjects = data.subjects.filter(s => s.id !== subjectId);
  data.scores = data.scores.filter(s => s.subjectId !== subjectId);
  saveData(data);
}

// Student functions
export function addStudent(firstName: string, lastName: string, studentId: string, classId: string, gender: 'Male' | 'Female'): Student {
  const data = loadData();
  const student: Student = {
    id: uuidv4(),
    firstName,
    lastName,
    studentId,
    classId,
    gender,
  };
  data.students.push(student);
  saveData(data);
  return student;
}

export function updateStudent(studentId: string, updates: Partial<Student>): void {
  const data = loadData();
  const index = data.students.findIndex(s => s.id === studentId);
  if (index !== -1) {
    data.students[index] = { ...data.students[index], ...updates };
    saveData(data);
  }
}

export function deleteStudent(studentId: string): void {
  const data = loadData();
  data.students = data.students.filter(s => s.id !== studentId);
  data.scores = data.scores.filter(s => s.studentId !== studentId);
  saveData(data);
}

// Score functions
export function addScore(studentId: string, subjectId: string, componentId: string, score: number, term: string, academicYear: string): SBAScore {
  const data = loadData();
  // Remove existing score for same student/subject/component/term/year
  data.scores = data.scores.filter(s =>
    !(s.studentId === studentId && s.subjectId === subjectId &&
      s.componentId === componentId && s.term === term && s.academicYear === academicYear)
  );

  const newScore: SBAScore = {
    id: uuidv4(),
    studentId,
    subjectId,
    componentId,
    score,
    term,
    academicYear,
    dateEntered: new Date().toISOString(),
    teacherId: data.currentTeacherId!,
  };
  data.scores.push(newScore);
  saveData(data);
  return newScore;
}

export function bulkAddScores(scores: { studentId: string; score: number }[], subjectId: string, componentId: string, term: string, academicYear: string): void {
  const data = loadData();
  scores.forEach(({ studentId, score }) => {
    data.scores = data.scores.filter(s =>
      !(s.studentId === studentId && s.subjectId === subjectId &&
        s.componentId === componentId && s.term === term && s.academicYear === academicYear)
    );
    data.scores.push({
      id: uuidv4(),
      studentId,
      subjectId,
      componentId,
      score,
      term,
      academicYear,
      dateEntered: new Date().toISOString(),
      teacherId: data.currentTeacherId!,
    });
  });
  saveData(data);
}

// Query functions
export function getClassesByTeacher(): ClassRoom[] {
  const data = loadData();
  return data.classes.filter(c => c.teacherId === data.currentTeacherId);
}

export function getSubjectsByTeacher(): Subject[] {
  const data = loadData();
  return data.subjects.filter(s => s.teacherId === data.currentTeacherId);
}

export function getStudentsByClass(classId: string): Student[] {
  const data = loadData();
  return data.students.filter(s => s.classId === classId);
}

export function getStudentsBySubject(subjectId: string): Student[] {
  const data = loadData();
  const subject = data.subjects.find(s => s.id === subjectId);
  if (!subject) return [];
  return data.students.filter(s => s.classId === subject.classId);
}

export function getScoresBySubject(subjectId: string, term?: string): SBAScore[] {
  const data = loadData();
  let scores = data.scores.filter(s => s.subjectId === subjectId);
  if (term) {
    scores = scores.filter(s => s.term === term);
  }
  return scores;
}

export function getStudentScores(studentId: string, subjectId: string): SBAScore[] {
  const data = loadData();
  return data.scores.filter(s => s.studentId === studentId && s.subjectId === subjectId);
}

export function getSubjectById(subjectId: string): Subject | null {
  const data = loadData();
  return data.subjects.find(s => s.id === subjectId) || null;
}

export function getClassById(classId: string): ClassRoom | null {
  const data = loadData();
  return data.classes.find(c => c.id === classId) || null;
}

export function getStudentById(studentId: string): Student | null {
  const data = loadData();
  return data.students.find(s => s.id === studentId) || null;
}

export function getComponentById(subjectId: string, componentId: string): SBAComponent | null {
  const subject = getSubjectById(subjectId);
  if (!subject) return null;
  return subject.components.find(c => c.id === componentId) || null;
}
