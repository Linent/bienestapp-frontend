import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ProfileComponent from "@/components/user/profileComponent";
import { getTokenPayload } from "@/utils/auth"; // función para obtener el token y decodificarlo
import DefaultLayout from "@/layouts/default"; //  Importa el layout

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login"); // Si no hay token, redirigir al login
      return;
    }

    const payload = getTokenPayload(token); // Obtener los datos del usuario a partir del token
    if (payload) {
      setUser(payload); // Almacenar los datos del usuario en el estado
    }
  }, [router]);

  if (!user) {
    return <div>Cargando...</div>; // Mientras se carga el perfil
  }

  return (
    <DefaultLayout> {/* <== Agrega el layout aquí */}
      <div className="flex flex-col items-center p-6">
        <h1 className="text-3xl font-bold">Perfil de Usuario</h1>
        <ProfileComponent user={user} />
      </div>
    </DefaultLayout>
  );
}
