import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import DefaultLayout from "@/layouts/default";
import AdvisorCalendar from "@/components/schedule/AdvisorCalendar"; // <== ¡Este es el nuevo componente!

export default function SchedulePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // const role = localStorage.getItem("role");
    // const codigo = localStorage.getItem("codigo");
    // const email = localStorage.getItem("email");

    // // Imprimir los datos en consola
    // console.log("Token:", token);
    // console.log("Role:", role);
    // console.log("Codigo:", codigo);
    // console.log("Email:", email);

    if (!token) {
      router.replace("/login"); // Redirige automáticamente
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return null; // No renderiza la página mientras redirige
  }

  return (
    <DefaultLayout>
      <div className=" flex flex-col w-full items-center p-6">
        <h1 className="text-3xl font-bold">Todas las asesorías</h1>
        <AdvisorCalendar  />
      </div>
    </DefaultLayout>
  );
}
