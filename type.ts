export interface Teacher {
  id: string;
  name: string;
  email: string;
  password: string;
  school: string;
}

export interface ClassRoom {
  id: string;
  name: string;
  level: string; // e.g., "Form 4", "Form 5", "Grade 10"
  teacherId: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  classId: string;
  teacherId: string;
  components: SBAComponent[];
}

export interface SBAComponent {
  id: string;
  name: string; // e.g., "Paper 1", "Paper 2", "IA", "Oral"
  maxMarks: number;
  weight: number; // percentage weight
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  studentId: string; // school ID number
  classId: string;
  gender: 'Male' | 'Female';
}

export interface SBAScore {
  id: string;
  studentId: string;
  subjectId: string;
  componentId: string;
  score: number;
  term: string; // e.g., "Term 1", "Term 2", "Term 3"
  academicYear: string;
  dateEntered: string;
  teacherId: string;
}

export interface AppData {
  teachers: Teacher[];
  classes: ClassRoom[];
  subjects: Subject[];
  students: Student[];
  scores: SBAScore[];
  currentTeacherId: string | null;
}
