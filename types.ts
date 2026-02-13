
export enum Role {
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  contactInfo?: string;
  qualifications?: string;
}

export interface Proof {
  fileName: string;
  mimeType: string;
  data: string; // base64
  extractedInfo?: string;
}

export interface Practice {
  id: string;
  teacherId: string;
  title: string;
  description: string;
  date: string;
  proof?: Proof;
}

export interface Seminar {
  id: string;
  teacherId: string;
  title: string;
  fromDate: string;
  toDate: string;
  description: string;
  proof?: Proof;
}

export interface SystemState {
  currentUser: User | null;
  teachers: User[];
  practices: Practice[];
  seminars: Seminar[];
}
