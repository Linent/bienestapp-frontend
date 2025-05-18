// components/queries/ChartByBeneficiary.tsx
import { useEffect, useState } from "react";
import { fetchByBeneficiary } from "@/services/reportService";
import { Spinner } from "@heroui/react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function ChartByBeneficiary() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchByBeneficiary()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner color="primary" className="my-10" />;
  if (!data.length) return <div>No hay datos para mostrar.</div>;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <h3 className="font-bold text-lg mb-2">Consultas por Tipo de Beneficiario</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="beneficiaryType" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#34d399" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
