import { jwtDecode } from "jwt-decode";

interface JwtPayload {
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

export const getTokenPayload = (): { id: string } | null => {
  // Example implementation
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return { id: payload.id };
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};
