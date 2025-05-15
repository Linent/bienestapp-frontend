import api from "./axiosInstance";
import { BACKEND_URL } from "@/config";
import { User } from "@/types";
import { getAuthHeaders } from "@/helpers/authHelper"; // Se mantiene la importación correcta

const UserPath = "user";

export const fetchUsers = async () => {
  const response = await api.get(`${BACKEND_URL}/${UserPath}`, {
    headers: getAuthHeaders(),
  });

  return response.data;
};

export const importUsersFromFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post(
    `${BACKEND_URL}/${UserPath}/import`, // asegúrate que la ruta es correcta
    formData,
    {
      headers: {
        ...getAuthHeaders(),
      },
    }
  );
  console.log(response);
  return response.data;
};

export const deleteUser = async (userId: string) => {
  const response = await api.put(`${BACKEND_URL}/${UserPath}/delete/${userId}`, {
    headers: getAuthHeaders(),
  });

  return response.data;
}
export const updateEnableUser = async (userId: string, enable: boolean) => {
  const response = await api.post(
    `${BACKEND_URL}/${UserPath}/enable/${userId}`,
    { enable },
    {
      headers: getAuthHeaders(),
    },
  );
  return response.data;
};
export const recoveryPassword = async (token: string, password: string) => {
  const response = await api.post(
    `${BACKEND_URL}/${UserPath}/recovery-password/${token}`,
    {
      password,
    },
  );

  return response.data;
};

export const sendRecoveryEmail = async (email: string) => {
  return await api.post(`${BACKEND_URL}/${UserPath}/forgot-password`, {
    email,
  });
};
export const registerUser = async (userData: {
  name: string;
  email: string;
  codigo: string;
  role: string;
  password: string;
  career: string;
}) => {
  const response = await api.post(
    `${BACKEND_URL}/${UserPath}/register`,
    userData,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
};

export const fetchUserById = async (userId: string): Promise<User> => {

    const response = await api.get(`${BACKEND_URL}/${UserPath}/${userId}`, {
      headers: getAuthHeaders(),
    }); // Corrección aquí

    return response.data;
  
};

export const updateUser = async (
  userId: string,
  userData: Partial<User>,
): Promise<void> => {
  await api.post(`${BACKEND_URL}/${UserPath}/${userId}`, userData, {
    headers: getAuthHeaders(),
  }); // Corrección aquí
};



export const loginUser = async (email: string, password: string) => {
  const response = await api.post(`${BACKEND_URL}/${UserPath}/login`, {
    email,
    password,
  });
  return response.data; // debe incluir { token, user }
};

export const uploadUserFiles = async (userId: string, formData: FormData) => {
  const res = await api.put(`${BACKEND_URL}/${UserPath}/${userId}/files`, formData, {
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};