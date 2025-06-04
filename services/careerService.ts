import api from "./axiosInstance";

import { BACKEND_URL } from "@/config";
const carreraPath = "career";

import { getAuthHeaders } from "@/helpers/authHelper";
import { Career } from "@/types";

export const fetchCareers = async (): Promise<Career[]> => {
  const response = await api.get(`${BACKEND_URL}/${carreraPath}`, {
    headers: getAuthHeaders(),
  });

  return response.data;
};
export const fetchCareerByCode = async (code: string): Promise<Career | null> => {
  try {
    const response = await api.get(`${BACKEND_URL}/${carreraPath}/code/${code}`,
      {
    headers: getAuthHeaders(),
  }
    );
    return response.data;
  } catch {
    return null;
  }
};
// Obtener una carrera por ID
export const fetchCareerById = async (id: string): Promise<Career> => {
  const response = await api.get(`${BACKEND_URL}/${carreraPath}/${id}`, {
    headers: getAuthHeaders(),
  });

  return response.data;
};

// Crear una nueva carrera
export const createCareer = async (
  careerData: Partial<Career>,
): Promise<Career> => {

  const response = await api.post(
    `${BACKEND_URL}/${carreraPath}/create`,
    careerData,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
};

// Actualizar una carrera
export const updateCareer = async (
  id: string,
  careerData: Partial<Career>
): Promise<{ success: boolean; data?: Career; message?: string }> => {
  const response = await api.put(
    `${BACKEND_URL}/${carreraPath}/${id}`,
    careerData,
    {
      headers: getAuthHeaders(),
    }
  );
  return response.data;
};

// Habilitar/Deshabilitar una carrera
export const toggleCareerStatus = async (
  id: string,
  enable: boolean,
): Promise<{ success: boolean; data: Career }> => {
  const response = await api.post(
    `${BACKEND_URL}/${carreraPath}/enable/${id}`,
    { enable },
    { headers: getAuthHeaders() },
  );
  return response.data;
};
