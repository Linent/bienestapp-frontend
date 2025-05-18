// components/UserQueryDashboard.tsx
import React, { useEffect, useState } from "react";
import KpiCard from "./KpiCard";
import { fetchUserQueryKpis } from "@/services/reportService";
import { Users, MessageSquare, TrendingUp, UserCheck } from "lucide-react";

type UserQueryKpi = {
  totalQueries: number;
  last7days: { _id: string; count: number }[];
  topTopics: { topicId: string; topicName: string; count: number }[]; // <-- CAMBIO AQUÍ
  totalUniqueUsers: number;
};

const UserQueryDashboard: React.FC = () => {
  const [kpis, setKpis] = useState<UserQueryKpi | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserQueryKpis()
      .then((data: UserQueryKpi) => {
        setKpis(data);
        setLoading(false);
      })
      .catch((): void => setLoading(false));
  }, []);

  if (loading)
    return <div className="p-6 text-center">Cargando estadísticas...</div>;
  if (!kpis)
    return <div className="p-6 text-center">No hay datos de consultas.</div>;

  // Ejemplo de cálculo de cambio: comparación entre ayer y anteayer
  let change = undefined;
  if (kpis.last7days.length > 1) {
    const dias = kpis.last7days.slice(-2);
    change =
      dias[1].count !== 0
        ? Number(
            (
              ((dias[1].count - dias[0].count) / Math.max(dias[0].count, 1)) *
              100
            ).toFixed(1)
          )
        : undefined;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <KpiCard
        title="Consultas totales"
        value={kpis.totalQueries}
        icon={<MessageSquare />}
        color="primary"
        change={change}
      />
      <KpiCard
        title="Usuarios únicos"
        value={kpis.totalUniqueUsers}
        icon={<Users />}
        color="success"
      />
      <KpiCard
        title="Tema + consultado"
        value={
          kpis.topTopics.length > 0
            ? `${kpis.topTopics[0].topicName} (${kpis.topTopics[0].count})`
            : "Sin datos"
        }
        icon={<TrendingUp />}
        color="warning"
      />
      <KpiCard
        title="Consultas (hoy)"
        value={
          kpis.last7days.length > 0
            ? kpis.last7days[kpis.last7days.length - 1].count
            : 0
        }
        icon={<UserCheck />}
        color="danger"
      />
    </div>
  );
};

export default UserQueryDashboard;
