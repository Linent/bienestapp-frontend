import axios from "axios";
import { BACKEND_URL } from "@/config";
import { User } from "@/types";
import { getAuthHeaders } from "@/helpers/authHelper"; // Se mantiene la importación correcta

const UserPath = "user";

export const fetchUsers = async () => {
  const response = await axios.get(`${BACKEND_URL}/${UserPath}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
export const recoveryPassword = async (token: string, password: string) => {
  const response = await axios.post(`${BACKEND_URL}/${UserPath}/recovery-password/${token}`, {
    password,
  });
  return response.data;
};

export const sendRecoveryEmail = async (email: string) => {
  return await axios.post(`${BACKEND_URL}/${UserPath}/forgot-password`, { email });
};
export const registerUser = async (userData: {
  name: string;
  email: string;
  codigo: string;
  role: string;
  password: string;
  career: string;
}) => {
  const response = await axios.post(`${BACKEND_URL}/${UserPath}/register`, userData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const fetchUserById = async (userId: string): Promise<User> => {
  try {
    const response = await axios.get(`${BACKEND_URL}/${UserPath}/${userId}`, {
      headers: getAuthHeaders(),
    }); // Corrección aquí
    return response.data;
  } catch (error) {
    console.error("❌ Error en fetchUserById:", error);
    throw error;
  }
  
};

export const updateUser = async (userId: string, userData: Partial<User>): Promise<void> => {
  await axios.post(`${BACKEND_URL}/${UserPath}/${userId}`, userData, {
    headers: getAuthHeaders(),
  }); // Corrección aquí
};
