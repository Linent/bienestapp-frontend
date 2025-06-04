// hooks/useCareers.ts
import { useEffect, useState } from "react";
import { fetchCareers } from "@/services/careerService";
import { Career } from "@/types";

export function useCareers() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCareers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCareers();
      setCareers(Array.isArray(data) ? data : []);
    } catch {
      setError("No se pudo cargar la lista de carreras.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCareers(); }, []);

  return { careers, setCareers, loading, error, reload: loadCareers };
}
