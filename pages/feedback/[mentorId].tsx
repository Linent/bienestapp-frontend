// pages/feedbacks/[mentorId].tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import DefaultLayout from "@/layouts/default";
import { Button, Divider, Spinner } from "@heroui/react";
import { title } from "@/components/primitives";
import TableMentorFeedbacks from "@/components/schedule/FeedBack"; // Cambia la ruta si es necesario
import { BackArrowIcon } from "@/components/icons/ActionIcons";

const MentorFeedbacksPage = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { mentorId } = router.query;

  // Asegurarse de que mentorId es un string
  const mentorIdStr = typeof mentorId === "string" ? mentorId : null;

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
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

  if (!isAuth || role !== "admin" || !mentorIdStr) return null;
  if (loading)
    return (
      <div className="py-20 text-center">
        <Spinner color="danger" label="cargando tus testimonios..."/>
      </div>
    );

  return (
    <DefaultLayout>
      <div className="w-full p-6">
        <h1 className={title()}>Feedback de este Mentor</h1>
        <Divider className="my-4" />
        {/* Solo pasamos mentorId si es string */}
        <Button
        color="primary"
          onPress={() => router.back()}
          className="mb-6"
      >
        <BackArrowIcon className="w-5 h-5" />
        Volver
      </Button>
        <TableMentorFeedbacks mentorId={mentorIdStr} />
      </div>
    </DefaultLayout>
  );
};

export default MentorFeedbacksPage;
