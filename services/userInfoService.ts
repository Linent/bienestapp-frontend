import api from "./axiosInstance";
import { BACKEND_URL } from "@/config";
import { getAuthHeaders } from "@/helpers/authHelper";
const userInfoPath = "userInfo";

export const fetchAllUserInfo = async () => {
  const response = await api.get(`${BACKEND_URL}/${userInfoPath}/All`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};