// utils/auth.ts
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp: number;
}

export const isTokenExpired = (): boolean => {
  const token = localStorage.getItem("token");
  if (!token) return true;

  try {
    const { exp } = jwtDecode<JwtPayload>(token);
    return exp * 1000 < Date.now(); // true si el token ya expiró
  } catch (error) {
    console.error("Token inválido o malformado", error);
    return true;
  }
};

