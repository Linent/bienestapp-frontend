import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ProfileComponent from "@/components/user/profileComponent";
import { getTokenPayload } from "@/utils/auth"; // función para obtener el token y decodificarlo
import DefaultLayout from "@/layouts/default"; //  Importa el layout
import { Divider, Spinner } from "@heroui/react";
import { title } from "@/components/primitives";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login"); // Si no hay token, redirigir al login
    } else {
      setIsAuthenticated(true);
    }

    const payload = getTokenPayload(); // Obtener los datos del usuario a partir del token
    if (payload) {
      setUser(payload); // Almacenar los datos del usuario en el estado
    }
  }, [router]);
  if (!isAuthenticated) {
    return null; // No renderiza la página mientras redirige
  }
  if (!user) {
    return <Spinner color="danger" label="cargando perfil..."/>; // Mientras se carga el perfil
  }

  return (
    <DefaultLayout> {/* <== Agrega el layout aquí */}
      <div className="flex flex-col items-center p-6">
        <h1 className={title()}>Perfil de Usuario</h1>
        <Divider className="my-4" />
        <ProfileComponent />
      </div>
    </DefaultLayout>
  );
}
