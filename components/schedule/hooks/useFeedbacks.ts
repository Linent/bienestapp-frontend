// hooks/useFeedbacks.ts
import { useEffect, useState } from "react";
import { fetchAllFeedbacks, fetchFeedbacksByMentor } from "@/services/scheduleService";
import { Feedback } from "@/types/types";

export const useFeedbacks = (mentorId?: string) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    const fetch = mentorId
      ? () => fetchFeedbacksByMentor(mentorId)
      : fetchAllFeedbacks;

    fetch()
      .then((res) => {
        if (active) setFeedbacks(res);
      })
      .catch(() => {
        if (active) setError("No se pudo cargar la información.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [mentorId]);

  return { feedbacks, loading, error };
};
