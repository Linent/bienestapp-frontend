import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Form,
  Input,
  Button,
  Card,
  CardBody,
  Tabs,
  Tab,
  Alert,
} from "@heroui/react";
import DefaultLayout from "@/layouts/default";
import { BACKEND_URL } from "@/config";
import { title } from "@/components/primitives";

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
        setIsAuthenticated(true);
        router.push("/");
      }
    } 
    catch (err: any) {
      console.error("Error en el login:", err.toJSON ? err.toJSON() : err);
    
      if (axios.isAxiosError(err) && err.response) {

    
        const status = err.response.status;
        const message =  "usuario o contraseña incorrectos";
    
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
        <h1 className={title()}>Bienvenido de nuevo</h1>
        <Card className="m-4 max-w-full w-96 h-[400px]">
          <CardBody className="overflow-hidden">
            <Tabs>
              <Tab key="login" title="Inicia sesión">
                {error && (
                  <Alert color="danger" title="Error" description={error} />
                )}
                <Form
                  onSubmit={handleSubmit}
                  className="w-full flex flex-col gap-4"
                >
                  <Input
                    isRequired
                    label="Email"
                    name="email"
                    placeholder="Enter your email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <Input
                    isRequired
                    label="Password"
                    name="password"
                    placeholder="Enter your password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                  />

                  <div className="flex gap-2 justify-end">
                    <Button fullWidth color="primary" type="submit">
                      Iniciar sesión
                    </Button>
                  </div>
                </Form>
              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      </div>
    </DefaultLayout>
  );
};

export default LoginPage;
