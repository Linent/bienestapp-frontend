import axios from "axios";

import { getAuthHeaders } from "@/helpers/authHelper";
import { BACKEND_URL } from "@/config";
import { AdvisoryData } from "@/types/"; // Asegúrate de que la ruta sea correcta
const advisory = "advisory";

export const fetchAdvisories = async () => {
  const headers = getAuthHeaders();
  console.log("Enviando headers:", headers); // DEBUG

  try {
    const response = await axios.get(`${BACKEND_URL}/${advisory}`, {
      headers: getAuthHeaders(),
    });

    return response.data; // Debe devolver un array de asesorías
  } catch (error) {
    console.error("Error al obtener las asesorías:", error);
    throw error;
  }
};

export const createAdvisory = async (advisoryData: AdvisoryData) => {
  const response = await axios.post("/api/advisories", advisoryData);

  return response.data;
};
