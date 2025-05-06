import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Form,
  Input,
  Button,
  Card,
  CardBody,
  Alert,
  CardHeader,
} from "@heroui/react";

import DefaultLayout from "@/layouts/default";
import { BACKEND_URL } from "@/config";

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsAuthenticated(true);
      router.push("/");
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(`${BACKEND_URL}/user/login`, {
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 200) {
        const { token, user } = response.data; // Suponiendo que el backend devuelve el rol del usuario

        localStorage.setItem("token", token);
        localStorage.setItem("role", user.role); // Guardar el rol en localStorage
        localStorage.setItem("codigo", user.codigo); // 👈 Aquí guardas el codigo del usuario logueado
        localStorage.setItem("email", user.email); // (opcional) Guarda también el email si quieres

        setIsAuthenticated(true);
        router.push("/");
      }
    } catch (err: any) {
      console.error("Error en el login:", err.toJSON ? err.toJSON() : err);

      if (axios.isAxiosError(err) && err.response) {
        const status = err.response.status;
        const message = "usuario o contraseña incorrectos";

        if (status === 400 || status === 401) {
          setError(message);
        } else if (status === 500) {
          setError("Error del servidor. Inténtalo más tarde.");
        } else {
          setError(`Error inesperado: ${status}`);
        }
      } else {
        setError("No se pudo conectar con el servidor.");
      }

      // Ocultar la alerta después de 5 segundos
      setTimeout(() => setError(null), 5000);
    }
  };

  if (isAuthenticated) {
    return (
      <DefaultLayout>
        <div className="flex flex-col w-full items-center">
          <h1 className="text-3xl font-bold mb-4">Redirigiendo...</h1>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className=" flex flex-col w-full items-center">
        <Card className="m-4 max-w-full pt-4 w-96 shadow-lg rounded-lg">
          <CardHeader className="text-center py-4">
            <h2 className="text-2xl font-bold text-gray-800">Iniciar sesión</h2>
          </CardHeader>

          <CardBody className="px-6 py-4">
            {error && (
              <Alert
                className="mb-4"
                color="warning"
                description={error}
                title="Error"
              />
            )}

            <Form
              className="w-full flex flex-col gap-5"
              onSubmit={handleSubmit}
            >
              <Input
                isRequired
                label="Correo electrónico"
                name="email"
                placeholder="Ingresa tu correo"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />

              <Input
                isRequired
                label="Contraseña"
                name="password"
                placeholder="Ingresa tu contraseña"
                type="password"
                value={formData.password}
                onChange={handleChange}
              />

              {/* Enlace "¿Olvidaste tu contraseña?" */}
              <div className="text-right text-sm text-primary hover:underline">
                <a href="/forgot-password">¿Olvidaste tu contraseña?</a>
              </div>

              <div className="flex justify-center">
                <Button
                  fullWidth
                  className="py-3 text-lg"
                  color="primary"
                  type="submit"
                >
                  Iniciar sesión
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </div>
    </DefaultLayout>
  );
};

export default LoginPage;
