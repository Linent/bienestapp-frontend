import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import CareerTable from "@/components/career/CareerTable";
import { title } from "@/components/primitives";
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
        <h1 className={title()}>Lista de las Carreras</h1>
        <Divider className="my-4"/>
        <CareerTable />
      </div>
    </DefaultLayout>
  );
}
