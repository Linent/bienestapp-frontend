// services/scheduleService.ts o .js
import api from "./axiosInstance";
import { BACKEND_URL } from "@/config"; // Asegúrate de que esta variable esté definida en tu entorno
const schedulePath = "schedules"; // Cambia esto si es necesario
import { getAuthHeaders } from "@/helpers/authHelper";
export const fetchStudentsByAdvisory = async (advisoryId: string, day: string, dateStart: string ) => {
    const response = await api.get(`${BACKEND_URL}/${schedulePath}/students-by-advisory`, {
      params: {
        advisoryId,
        day,
        dateStart
      },
    headers: getAuthHeaders()
    });
    return response.data;
  
};

export const fetchSchedules = async () => {
  const res = await api.get(`${BACKEND_URL}/${schedulePath}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
}

export const updateSchedule = async (
  scheduleId: string,
  scheduleData: { observation: string }
) => {
  const res = await api.put(
    `${BACKEND_URL}/${schedulePath}/${scheduleId}`,
    scheduleData,
    {
      headers: getAuthHeaders(),
    }
  );

  return res.data;
}

export const updateAttendance = async (
  scheduleId: string,
  attendanceStatus: boolean
) => {
  const res = await api.put(
    `${BACKEND_URL}/${schedulePath}/update-attendance`,
    { scheduleId, attendanceStatus },
    {
      headers: getAuthHeaders(),
    }
  );

  return res.data;
};

export const validateFeedbackToken = async (token: string) => {
  const res = await api.get(`${BACKEND_URL}/${schedulePath}/feedback/validate/${token}`);
  return res.data;
};

// Guardar calificación y feedback
export const submitFeedback = async (scheduleId: string, feedback: string, rating: number) => {
  const res = await api.put(
    `${BACKEND_URL}/${schedulePath}/feedback/${scheduleId}`,
    { feedback, rating }
  );
  return res.data; // <--- esto también
};

export const fetchScheduleCountByAdvisory = async (
  advisoryId: string,
  dateStart: string
): Promise<number> => {
  const res = await api.get(
    `${BACKEND_URL}/${schedulePath}/count-by-advisory`,
    { params: { advisoryId, dateStart } }
  );
  // La API responde { count: <número> }
  return res.data.count;
};