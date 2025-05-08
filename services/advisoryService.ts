
import api from "./axiosInstance";
import { getAuthHeaders } from "@/helpers/authHelper";
import { BACKEND_URL } from "@/config";
import { AdvisoryData } from "@/types/"; // Asegúrate de que la ruta sea correcta
const advisory = "advisory";
const advisor = "advisor";

export const fetchAdvisories = async () => {

    const response = await api.get(`${BACKEND_URL}/${advisory}`, {
      headers: getAuthHeaders(),
    });

    return response.data; // Debe devolver un array de asesorías
  
};

export const createAdvisory = async (advisoryData: AdvisoryData) => {
  const response = await api.post(`${BACKEND_URL}/${advisory}/create`, advisoryData,
    {
      headers: getAuthHeaders(),
    },);

  return response.data;
};

export const fetchAdvisoriesByAdvisor = async (advisorId: string) => {
  const response = await api.get(`${BACKEND_URL}/${advisory}/${advisor}/${advisorId}`);
  return response.data;
};

export const updateAdvisoryStatus = async (advisoryId: string, advisoryData: AdvisoryData) => {
  const response = await api.put(`${BACKEND_URL}/${advisory}/updateStatus/${advisoryId}`, advisoryData,
    {
      headers: getAuthHeaders(),
    },);

  return response.data;
};

// ✅ Suponiendo que la ruta del backend sea /advisory/update/:advisoryId
export const updateAdvisory = async (advisoryId: string, advisoryData: AdvisoryData) => {
  const response = await api.put(
    `${BACKEND_URL}/${advisory}/${advisoryId}`,
    advisoryData,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};
