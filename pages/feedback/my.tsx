// pages/feedbacks/my.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import DefaultLayout from "@/layouts/default";
import { Divider, Spinner } from "@heroui/react";
import { title } from "@/components/primitives";
import FeedbackList from "@/components/schedule/FeedBack";
import { getTokenPayload } from "@/utils/auth"; // Tu archivo, ajusta ruta si es diferente

const MyFeedbacksPage = () => {
  const [mentorId, setMentorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const payload = getTokenPayload();
    if (!payload || payload.role !== "academic_friend") {
      router.replace("/login");
      return;
    }
    setMentorId(payload.id);
    setLoading(false);
  }, [router]);

  if (loading || !mentorId) {
    return (
      <div className="py-20 text-center">
        <Spinner color="danger" label="cargando testimonios..."/>
      </div>
    );
  }

  return (
    <DefaultLayout>
      <div className="w-full p-6">
        <h1 className={title()}>Tus testimonios</h1>
        <Divider className="my-4" />
        <FeedbackList mentorId={mentorId} />
      </div>
    </DefaultLayout>
  );
};

export default MyFeedbacksPage;
