// pages/registro.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import DefaultLayout from "@/layouts/default";
import { Divider, Spinner } from "@heroui/react";
import { title } from "@/components/primitives";
import TableUserInfo from "@/components/reports/TableUserInfo";

const RegistroPage = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [role, setRole]   = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token"),
            role  = localStorage.getItem("role");
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
        <Spinner color="danger" label="cargando..." />
      </div>
    );

  return (
    <DefaultLayout>
      <div className="w-full p-6">
        <h1 className={title()}>Registros de consultores</h1>
        <Divider className="my-4" />
        <TableUserInfo />
      </div>
    </DefaultLayout>
  );
};

export default RegistroPage;
