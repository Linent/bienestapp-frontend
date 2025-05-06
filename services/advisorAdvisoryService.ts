import axios from "axios";
import { getAuthHeaders } from "@/helpers/authHelper";
import { BACKEND_URL } from "@/config";

/**
 * Obtiene las asesorías de esta semana para los asesores disponibles,
 * con base en los horarios asignados.
 */
export const fetchAdvisoriesThisWeek = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/advisory/thisweek`, {
      headers: getAuthHeaders(),
    });

    return response.data; // [{ advisorCode, name, email, codigo, horarios[] }]
  } catch (error) {
    console.error("Error al obtener las asesorías de esta semana:", error);
    throw error;
  }
};
