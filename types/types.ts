export interface User {
    _id: string;
    name: string;
    email: string;
    career: string;
    codigo: string;
    role: "admin" | "student" | "academic_friend";
  }
  
  export interface Career {
    _id: string;
    name: string;
  }
  