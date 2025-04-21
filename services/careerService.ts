import axios from "axios";

import { BACKEND_URL } from "@/config";
const carreraPath = "career";

import { getAuthHeaders } from "@/helpers/authHelper";
import { Career } from "@/types";

export const fetchCareers = async (): Promise<Career[]> => {
  const response = await axios.get(`${BACKEND_URL}/${carreraPath}`, {
    headers: getAuthHeaders(),
  });

  return response.data;
};

// Obtener una carrera por ID
export const fetchCareerById = async (id: string): Promise<Career> => {
  const response = await axios.get(`${BACKEND_URL}/${carreraPath}/${id}`, {
    headers: getAuthHeaders(),
  });

  return response.data;
};

// Crear una nueva carrera
export const createCareer = async (
  careerData: Partial<Career>,
): Promise<Career> => {
  console.log(careerData);
  const response = await axios.post(
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
  careerData: Partial<Career>,
): Promise<Career> => {
  const response = await axios.put(
    `${BACKEND_URL}/${carreraPath}/${id}`,
    careerData,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
};

// Habilitar/Deshabilitar una carrera
export const toggleCareerStatus = async (
  id: string,
  enable: boolean,
): Promise<Career> => {
  const response = await axios.post(
    `${BACKEND_URL}/${carreraPath}/enable/${id}`,
    { enable },
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
};
