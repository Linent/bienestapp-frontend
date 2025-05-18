import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import DefaultLayout from "@/layouts/default";
import { Accordion, AccordionItem, Divider, Spinner } from "@heroui/react";
import { title } from "@/components/primitives";
import UserQueryDashboard from "@/components/reports/UserQueryDashboard";
import TableUserQuery from "@/components/reports/TableUserQuery";
import UserQueryDashboardCard from "@/components/reports/UserQueryDashboardCard";


const ConsultasPage = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token"),
        role = localStorage.getItem("role");
      if (!token) {
        router.replace("/login");
        return;
      }
      setIsAuth(true);
      setRole(role);
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (isAuth && role !== "admin") router.replace("/");
    if (isAuth && role === "admin") setLoading(false);
  }, [isAuth, role, router]);

  if (!isAuth || role !== "admin") return null;
  if (loading)
    return (
      <div className="py-20 text-center">
        <Spinner color="primary" />
      </div>
    );

  return (
    <DefaultLayout>
      <div className="w-full p-6">
        <h1 className={title()}>Consultas por WhatsApp</h1>
        <Divider className="my-4" />
                <UserQueryDashboard />
        <Accordion>
            <AccordionItem aria-label="Estadisticas" title="Estadisticas">
                <UserQueryDashboardCard/>
            </AccordionItem> 
        </Accordion>
        <Divider className="my-4" />
        <TableUserQuery />
      </div>
    </DefaultLayout>
  );
};

export default ConsultasPage;
