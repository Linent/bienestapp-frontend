import api from "./axiosInstance";
import { BACKEND_URL } from "@/config";
const Advisory = "advisory";
import { getAuthHeaders } from "@/helpers/authHelper";
import {TopCareerReport, AdvisoryReport, MostActiveAdvisor} from "@/types/types";
const dashboardPath = "schedules";

const USER_QUERY_PATH = "userqueries";
// Gráficas
export const fetchQueriesByDay = async (days = 30) => {
  const res = await api.get(
    `${BACKEND_URL}/${USER_QUERY_PATH}/by-day?days=${days}`,
    { headers: getAuthHeaders() }
  );
  return res.data;
};
export const fetchTopTopics = async () => {
  const res = await api.get(`${BACKEND_URL}/${USER_QUERY_PATH}/top-topics`, { headers: getAuthHeaders() });
  return res.data;
};
export const fetchByBeneficiary = async () => {
  const res = await api.get(`${BACKEND_URL}/${USER_QUERY_PATH}/by-beneficiary`, { headers: getAuthHeaders() });
  return res.data;
};
export const fetchByProgram = async () => {
  const res = await api.get(`${BACKEND_URL}/${USER_QUERY_PATH}/by-program`, { headers: getAuthHeaders() });
  return res.data;
};
// Obtener TODAS las consultas (para tabla)
export const fetchAllUserQueries = async () => {
  try {
    const headers = getAuthHeaders();
    const response = await api.get(
      `${BACKEND_URL}/${USER_QUERY_PATH}/all`,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error("Error obteniendo consultas de usuarios:", error);
    throw new Error("No se pudo cargar la información.");
  }
};

// Obtener KPIs / estadísticas para dashboard y gráficas
export const fetchUserQueryKpis = async () => {
  try {
    const headers = getAuthHeaders();
    const response = await api.get(
      `${BACKEND_URL}/${USER_QUERY_PATH}/kpis`,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error("Error obteniendo estadísticas de consultas:", error);
    throw new Error("No se pudo cargar la información de KPIs.");
  }
};

export const fetchTopCareers = async (): Promise<TopCareerReport[]> => {
  try {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const response = await api.get<TopCareerReport[]>(
      `${BACKEND_URL}/${Advisory}/report/top-careers`,
      { headers },
    );

    return response.data;
  } catch (error) {
    console.error("Error obteniendo datos de top carreras:", error);
    throw new Error("No se pudo cargar la información.");
  }
};


export const fetchSchedulesByDay = async (): Promise<{ date: string; count: number }[]> => {
  const response = await api.get(`${BACKEND_URL}/${dashboardPath}/schedules-by-day`, {
    headers: getAuthHeaders(),
  });

  return response.data.map((item: any) => {
    const { day, month, year, count } = item;
    const formattedDate = `${day}/${month}/${year.toString().slice(-2)}`;
    return { date: formattedDate, count };
  });
};

// 🟡 Últimos 30 días (también agrupado por día)
export const fetchSchedulesByMonth = async (): Promise<{ date: string; count: number }[]> => {
  const response = await api.get(`${BACKEND_URL}/${dashboardPath}/schedules-by-month`, {
    headers: getAuthHeaders(),
  });

  return response.data.map((item: any) => {
    const { day, month, year, count } = item;
    const formattedDate = `${day}/${month}/${year.toString().slice(-2)}`;
    return { date: formattedDate, count };
  });
};

// 🔵 Último año (agrupado por mes)
export const fetchSchedulesByYear = async (): Promise<{ date: string; count: number }[]> => {
  const response = await api.get(`${BACKEND_URL}/${dashboardPath}/schedules-by-year`, {
    headers: getAuthHeaders(),
  });

  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

  return response.data.map((item: any) => {
    const { month, year, count } = item;
    const formattedDate = `${meses[month - 1]} ${year}`;
    return { date: formattedDate, count };
  });
};


export const fetchMostActiveAdvisor = async (): Promise<
  MostActiveAdvisor[]
> => {
  const response = await api.get<MostActiveAdvisor[]>(
    `${BACKEND_URL}/${Advisory}/report/mostActiveAdvisor`,
    { headers: getAuthHeaders() },
  );

  return response.data;
};

const reportPath = "schedules";

// Obtener cantidad de asesorías por asesor
export const fetchSchedulesByAdvisor = async (): Promise<
  { advisorName: string; count: number }[]
> => {
  const response = await api.get(
    `${BACKEND_URL}/${reportPath}/schedules-by-advisor`,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
};

export const fetchSchedulesByAdvisorAll = async (from: Date, to: Date) => {
  const response = await api.get(`${BACKEND_URL}/${dashboardPath}/schedules-by-advisorAll`, {
    params: {
      startDate: from.toISOString(),
      endDate: to.toISOString(),
    },
    headers: getAuthHeaders(),
  });
  return response.data;
};
// Obtener cantidad de asesorías por tema
export const fetchSchedulesByTopic = async (): Promise<
  { topic: string; count: number }[]
> => {
  const response = await api.get(
    `${BACKEND_URL}/${reportPath}/schedules-by-topic`,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
};

// Obtener promedio de asistencia por asesoría
export const fetchAttendancePerSchedule = async (): Promise<
  { advisoryId: string; attendanceRate: number }[]
> => {
  const response = await api.get(
    `${BACKEND_URL}/${reportPath}/attendance-per-schedule`,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
};

export const fetchTotalAdvisories = async (): Promise<number> => {
  const response = await api.get(`${BACKEND_URL}/${dashboardPath}/total-advisories`, {
    headers: getAuthHeaders(),
  });
  return response.data.total;
};

export const fetchAttendancePercentage = async (): Promise<number> => {
  const response = await api.get(`${BACKEND_URL}/${dashboardPath}/attendance-percentage`, {
    headers: getAuthHeaders(),
  });
  return response.data.percentage;
};

export const fetchMonthlyAdvisories = async (): Promise<number> => {
  const response = await api.get(`${BACKEND_URL}/${dashboardPath}/monthly-advisories`, {
    headers: getAuthHeaders(),
  });
  return response.data.total;
};

export const fetchCountMostActiveAdvisor = async (): Promise<string> => {
  const response = await api.get(`${BACKEND_URL}/${dashboardPath}/most-active-advisor`, {
    headers: getAuthHeaders(),
  });
  return response.data.advisor.name;
};