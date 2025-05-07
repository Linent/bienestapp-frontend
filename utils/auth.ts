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


