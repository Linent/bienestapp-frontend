import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import TopCareersChart from "@/components/TopCareers";
import DefaultLayout from "@/layouts/default";
import AdvisoriesByTopic from "@/components/AdvisoriesByTopic";
import AdvisoriesByAdvisor from "@/components/AdvisoriesByAdvisor";
import AttendancePerSchedule from "@/components/AttendancePerSchedule";
import { Divider } from "@heroui/react";

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      router.replace("/login"); // Redirige si no está autenticado
    } else {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  }, []);

  // Redirigir si no es admin
  useEffect(() => {
    if (isAuthenticated && userRole !== "admin") {
      router.replace("/"); // Redirige a la página principal si no es admin
    }
  }, [isAuthenticated, userRole]);

  useEffect(() => {
    if (userRole === "admin") {
      const fetchReport = async () => {
        try {
        } catch (err) {
          setError("No se pudieron cargar las estadísticas.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchReport();
    }
  }, [userRole]);

  if (!isAuthenticated || userRole !== "admin") return null; // No renderiza hasta que verifique el rol

  if (loading) return <p>Cargando estadísticas...</p>;
  if (error) return <p>{error}</p>;

  return (
    <DefaultLayout>
      <div className="w-full  p-6">
        <h1 className="text-3xl font-bold mb-6">Estadísticas de Asesorías</h1>
        <Divider className="my-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdvisoriesByAdvisor />
          <AdvisoriesByTopic />
          <TopCareersChart />
          <AttendancePerSchedule />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Dashboard;
