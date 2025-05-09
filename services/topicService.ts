// services/topicService.ts
import api from "./axiosInstance";
import { BACKEND_URL } from "@/config";
import { getAuthHeaders } from "@/helpers/authHelper";

const endpoint = "topics";

export const fetchTopics = async () => {
  const response = await api.get(`${BACKEND_URL}/${endpoint}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const fetchTopicById = async (id: string) => {
  const response = await api.get(`${BACKEND_URL}/${endpoint}/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
export const updateTopicById = async (id: string, formData: FormData) => {
  const res = await api.put(`${BACKEND_URL}/${endpoint}/${id}`, formData, {
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const createTopic = async (formData: FormData) => {
  const res = await api.post(`${BACKEND_URL}/${endpoint}/create`, formData, {
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteTopicById = async (id: string): Promise<void> => {
  await api.delete(`${BACKEND_URL}/${endpoint}/${id}`, {
    headers: getAuthHeaders(),
  });
};