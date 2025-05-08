import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { title } from "@/components/primitives";
import AdvisorList from "@/components/Advisory/AdvisorList"; // Asegúrate que sea export default
import DefaultLayout from "@/layouts/default";
import { Divider } from "@heroui/react";

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
        <h1 className={title()}>Lista de Mentores</h1>
        <Divider className="my-4" />
        <AdvisorList/>
      </div>
    </DefaultLayout>
  );
}
