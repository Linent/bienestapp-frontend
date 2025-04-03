import axios from "axios";
import { BACKEND_URL } from "@/config";
const Advisory = 'advisory'
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
  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });
export const fetchTopCareers = async (): Promise<TopCareerReport[]> => {
  try {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const response = await axios.get<TopCareerReport[]>(`${BACKEND_URL}/${Advisory}/report/top-careers`, { headers });
    return response.data;
  } catch (error) {
    console.error("Error obteniendo datos de top carreras:", error);
    throw new Error("No se pudo cargar la información.");
  }
};
// Funciones para obtener los datos
export const fetchAdvisoriesLast7Days = async (): Promise<AdvisoryReport[]> => {
    const response = await axios.get(`${BACKEND_URL}/${Advisory}/report/last7days`, { headers: getAuthHeaders() });
  
    return response.data.map((item: any) => ({
      date: `${item._id.year}-${String(item._id.month).padStart(2, "0")}-${String(item._id.day).padStart(2, "0")}`,
      count: item.totalAdvisories
    }));
  };
  
  export const fetchAdvisoriesLast30Days = async (): Promise<AdvisoryReport[]> => {
    const response = await axios.get(`${BACKEND_URL}/${Advisory}/report/last30days`, { headers: getAuthHeaders() });
  
    return response.data.map((item: any) => ({
      date: `${item._id.year}-${String(item._id.month).padStart(2, "0")}-${String(item._id.day).padStart(2, "0")}`,
      count: item.totalAdvisories
    }));
  };
  
  export const fetchAdvisoriesLastYear = async (): Promise<AdvisoryReport[]> => {
    const response = await axios.get(`${BACKEND_URL}/${Advisory}/report/lastyear`, { headers: getAuthHeaders() });
  
    return response.data.map((item: any) => ({
      date: new Date(item._id.year, item._id.month - 1).toLocaleString("en-US", { month: "short" }), // Convierte a 'Jan', 'Feb', etc.
      count: Math.round(item.totalAdvisories) // Asegura que sean enteros
    }));
  };
  
  
  export const fetchMostActiveAdvisor = async (): Promise<MostActiveAdvisor[]> => {
    const response = await axios.get<MostActiveAdvisor[]>(`${BACKEND_URL}/${Advisory}/report/mostActiveAdvisor`, { headers: getAuthHeaders() });
    return response.data;
  };

  
  const reportPath = "schedules";
  
  // Obtener cantidad de asesorías por asesor
  export const fetchSchedulesByAdvisor = async (): Promise<{ advisorName: string; count: number }[]> => {
    const response = await axios.get(`${BACKEND_URL}/${reportPath}/schedules-by-advisor`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  };
  
  // Obtener cantidad de asesorías por tema
export const fetchSchedulesByTopic = async (): Promise<{ topic: string; count: number }[]> => {
  const response = await axios.get(`${BACKEND_URL}/${reportPath}/schedules-by-topic`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// Obtener promedio de asistencia por asesoría
export const fetchAttendancePerSchedule = async (): Promise<{ advisoryId: string; attendanceRate: number }[]> => {
  const response = await axios.get(`${BACKEND_URL}/${reportPath}/attendance-per-schedule`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};