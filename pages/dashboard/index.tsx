import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import TopCareersChart from "@/components/reports/Advisory Line";
import DefaultLayout from "@/layouts/default";
import AdvisoriesByTopic from "@/components/reports/AdvisoriesByTopic";
import AdvisoriesByAdvisor from "@/components/reports/AdvisoriesByAdvisor";
import AttendancePerSchedule from "@/components/reports/AttendancePerSchedule";
import { Divider, Spinner } from "@heroui/react";
import { title } from "@/components/primitives";
import KpiCard from "@/components/reports/KpiCard";
import {
  CalendarIcon,
  CheckIcon,
  ClipboardIcon,
  UserIcon,
} from "@/components/icons/ActionIcons";
import {
  fetchTotalAdvisories,
  fetchAttendancePercentage,
  fetchMonthlyAdvisories,
  fetchCountMostActiveAdvisor,
} from "@/services/reportService";

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [totalAdvisories, setTotalAdvisories] = useState(0);
  const [attendanceRate, setAttendanceRate] = useState("0%");
  const [monthlyAdvisories, setMonthlyAdvisories] = useState(0);
  const [mostActiveAdvisor, setMostActiveAdvisor] = useState("-");

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      router.replace("/login");
    } else {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && userRole !== "admin") {
      router.replace("/");
    }
  }, [isAuthenticated, userRole]);

  useEffect(() => {
    if (isAuthenticated && userRole === "admin") {
      const fetchStats = async () => {
        try {
          const [total, attendance, monthly, activeAdvisor] = await Promise.all([
            fetchTotalAdvisories(),
            fetchAttendancePercentage(),
            fetchMonthlyAdvisories(),
            fetchCountMostActiveAdvisor(),
          ]);

          setTotalAdvisories(total);
          setAttendanceRate(`${attendance}%`);
          setMonthlyAdvisories(monthly);
          setMostActiveAdvisor(activeAdvisor);
        } catch (err) {
          setError("No se pudieron cargar las estadísticas.");
        } finally {
          setLoading(false);
        }
      };

      fetchStats();
    }
  }, [isAuthenticated, userRole]);

  if (!isAuthenticated || userRole !== "admin") return null;

  if (loading) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <Spinner color="danger" label="Cargando estadísticas..." />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <DefaultLayout>
      <div className="w-full p-6">
        <h1 className={title()}>Estadísticas de Asesorías</h1>
        <Divider className="my-4" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KpiCard
            title="Total de Asesorías"
            value={totalAdvisories.toString()}
            icon={<ClipboardIcon />}
            color="primary"
          />
          <KpiCard
            title="Porcentaje de Asistencia"
            value={attendanceRate}
            icon={<CheckIcon />}
            color="success"
          />
          <KpiCard
            title="Asesorías este mes"
            value={(monthlyAdvisories ?? 0).toString()}
            icon={<CalendarIcon />}
            color="warning"
          />
          <KpiCard
            title="Asesor con más asesorías"
            value={mostActiveAdvisor ?? "-"}
            icon={<UserIcon />}
            color="primary"
          />
        </div>

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
