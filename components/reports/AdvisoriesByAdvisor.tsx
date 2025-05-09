import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { fetchSchedulesByAdvisor } from "@/services/reportService";

const AdvisoriesByAdvisor = () => {
  const [data, setData] = useState<{ advisorName: string; count: number }[]>(
    [],
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchSchedulesByAdvisor();

        setData(
          result.slice(0, 10).map((item) => ({
            // Tomar solo los primeros 10 registros
            advisorName: item.advisorName || "Desconocido", // Asegura que siempre haya un valor
            count: item.count,
          })),
        );
      } catch (err) {
        setError("No se pudo cargar la información. " + err);
      }
    };

    getData();
  }, []);

  return (
    <div className="bg-white p-4 shadow-lg rounded-lg">
      <h2 className="text-lg font-bold mb-4">
        Cantidad de Asesorías por Asesor
      </h2>

      {error && <p className="text-red-500">{error}</p>}

      <ResponsiveContainer height={300} width="100%">
        <BarChart data={data}>
          <XAxis dataKey="advisorName" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" name="Cantidad de Asesorías" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AdvisoriesByAdvisor;
