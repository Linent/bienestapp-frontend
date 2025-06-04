// components/queries/ChartTopTopics.tsx
import { useEffect, useState } from "react";
import { fetchTopTopics } from "@/services/reportService";
import { Spinner } from "@heroui/react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = [
  "#7c3aed", "#34d399", "#fbbf24", "#ef4444", "#60a5fa",
  "#f472b6", "#a78bfa", "#22d3ee", "#facc15", "#fb7185"
];

// Función para quitar palabras y capitalizar
function limpiarTema(temaRaw = "") {
  // Quitar palabras del inicio
  let tema = temaRaw.replace(/^(Servicio|Programa|Asesoría)\s+/i, "");
  // Quitar "UFPS" donde aparezca (al inicio, en medio o al final, ignorando mayúsculas)
  tema = tema.replace(/\bufps\b/gi, "").trim();
  // Capitalizar la primera letra (resto minúsculas, respeta espacios al inicio/final)
  tema = tema.charAt(0).toUpperCase() + tema.slice(1);
  return tema;
}

export default function ChartTopTopics({ height = 250 }) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopTopics()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  // Limpiar los nombres de los temas
  const cleanedData = data.map(item => ({
    ...item,
    tema: limpiarTema(item.tema),
  }));

  if (loading) return <div className="flex justify-center items-center h-[180px]"><Spinner color="danger" label="cargando datos..."/></div>;
  if (!cleanedData.length) return <div className="text-center py-6">No hay datos para mostrar.</div>;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={cleanedData}
          dataKey="total"
          nameKey="tema"
          cx="50%"
          cy="50%"
          outerRadius="80%"
          label={({ name, percent }) => `${name} (${Math.round(percent * 100)}%)`}
          isAnimationActive={false}
        >
          {cleanedData.map((_, idx) => (
            <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: any) => [`${value}`, "Consultas"]} />
      </PieChart>
    </ResponsiveContainer>
  );
}
