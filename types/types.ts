export interface User {
  _id: string;
  name: string;
  email: string;
  career: string;
  codigo: string;
  role: "admin" | "student" | "academic_friend";
  enable: boolean;
  password?: string; // Solo para el registro
}

export interface Career {
  _id: string;
  name: string;
}

export interface Career {
  name: string;
  code: string;
  enable: boolean;
}

export interface AdvisoryData {
  advisorId: string;
  careerId: string;
  dateStart: string; // Formato ISO (datetime-local)
  dateEnd: string;   // Formato ISO
  status?: "pending" | "approved" | "canceled";
}