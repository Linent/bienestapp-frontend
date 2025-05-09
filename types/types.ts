export interface User {
  _id: string;
  name: string;
  email: string;
  career?: string | { _id: string } | null;
  codigo: string;
  role: "admin" | "student" | "academic_friend";
  enable: boolean;
  password?: string; // Solo para el registro
  availableHours: number;
}

export interface Career {
  _id: string;
  name: string;
  code: string;
  enable: boolean;
}

export interface AdvisoryData {
  advisorId: string;
  careerId: string;
  dateStart: string; // Formato ISO (datetime-local)
  dateEnd: string; // Added dateEnd property
  status?: "pending" | "approved" | "canceled";
  recurring?: boolean;
  day: string;
}
export interface Advisory {
  _id: string;
  day: string;
  dateStart: string;
  dateEnd: string;
  status: string;
  careerId: string | { _id: string; name: string };
  advisorId: string | { _id: string; name: string };
  recurring?: boolean;
}
export interface AdvisoryEvent {
  id: string;
  title: string;
  advisorName: string;
  career: string;
  time: string;
  start: Date;
  end: Date;
  status: string;
  dateStart: Date;
  fullDateString?: string;  // Agrega esto para que sea reconocido
}


export interface Student {
  _id: string;
  topic: string;
  attendance: boolean;
  status: string;
  studentId: {
    _id: string;
    name: string;
    email: string;
    codigo: string;
    career: {
      name: string;
    };
  };
}
export interface TopCareerReport {
  totalAdvisories: number;
  career: string;
}
export interface AdvisoryReport {
  date: string;
  count: number;
}

export interface MostActiveAdvisor {
  advisorName: string;
  totalAdvisories: number;
}

export interface Schedule {
  _id: string;
  studentId: {  name:string  };
  AdvisoryId: { 
    advisorId: { name:string };
    careerId: { name: string };
    day: string;
 };
  topic: string;
  career: string;
  dateStart: string; // ISO date string
  attendance: boolean;
}
export interface Props {
  topic: {
    _id: string;
    name: string;
    description: string;
    filePath: string;
  };
  onEdit: () => void;
  onDelete: (id: string) => void;
}
export interface Topic {
  _id: string;
  name: string;
  description: string;
  filePath: string;
  keywords: string[];
  createdAt?: string;
  updatedAt?: string;
}
