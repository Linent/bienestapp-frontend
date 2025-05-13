import { jwtDecode } from "jwt-decode";

export interface JwtPayload {
  id: string;
  role: "admin" | "student" | "academic_friend";
  exp: number;
}

export const isTokenExpired = (): boolean => {
  const token = localStorage.getItem("token");
  if (!token) return false; // No está logueado, pero no consideramos el token expirado

  try {
    const { exp } = jwtDecode<JwtPayload>(token);
    return exp * 1000 < Date.now(); // true si expiró
  } catch (error) {
    console.error("Token inválido o malformado", error);
    return true;
  }
};

export const getTokenPayload = (): JwtPayload | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return { id: payload.id, role: payload.role, exp: payload.exp };
  } catch (error) {
    console.error("Token inválido:", error);
    return null;
  }
};
