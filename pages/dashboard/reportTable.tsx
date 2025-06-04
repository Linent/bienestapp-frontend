import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import DefaultLayout from "@/layouts/default";
import { Divider, Spinner } from "@heroui/react";
import { title } from "@/components/primitives";
import MentorAttendanceTable from "@/components/reports/MentorAttendanceTable";

const ReportTable = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      setLoading(false);
    }
  }, [isAuthenticated, userRole]);

  if (!isAuthenticated || userRole !== "admin") return null;
  if (loading) return <Spinner color="danger" label="Cargando reporte..."/>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <DefaultLayout>
      <div className="w-full p-6">
        <h1 className={title()}>Reporte de Mentores</h1>
        <Divider className="my-4" />
        <MentorAttendanceTable />
      </div>
    </DefaultLayout>
  );
};

export default ReportTable;
