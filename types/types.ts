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
  dateEnd: string; // Formato ISO
  status?: "pending" | "approved" | "canceled";
  recurring?: boolean;
}
export interface Advisory {
  _id: string;
  advisorId?: { name: string };
  careerId?: { name: string };
  dateStart: string;
  dateEnd: string;
  recurring: boolean;
  status: string;
}
