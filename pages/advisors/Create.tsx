import CreateAdvisoryForm from "@/components/Advisory/CreateAdvisoryForm";
import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function CareerPage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
  
    useEffect(() => {
      const token = localStorage.getItem("token");
  
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
        <div className="p-6"> 
        <h1 className={title()}>Crear el horario</h1>
          <CreateAdvisoryForm />
        </div>
</DefaultLayout>
  );
}