import { title } from "@/components/primitives";
import AdvisoryList from "@/components/Advisory/AdvisoryList"; // Asegúrate que sea export default
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
        <h1 className={title()}>Lista de Asesores</h1>
          <AdvisoryList />
        </div>
</DefaultLayout>
  );
}