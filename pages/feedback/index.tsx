// pages/feedbacks.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import DefaultLayout from "@/layouts/default";
import { Divider, Spinner } from "@heroui/react";
import { title } from "@/components/primitives";
import TableAllFeedbacks from "@/components/schedule/FeedBack"; // <- Crea este componente

const FeedbacksPage = () => {
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
        <Spinner color="primary" label="cargando testimonios ..." />
      </div>
    );

  return (
    <DefaultLayout>
      <div className="w-full p-6">
        <h1 className={title()}>Feedback y Calificaciones de Mentores</h1>
        <Divider className="my-4" />
        <TableAllFeedbacks />
      </div>
    </DefaultLayout>
  );
};

export default FeedbacksPage;
