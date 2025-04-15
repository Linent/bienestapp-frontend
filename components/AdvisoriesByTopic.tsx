import { useEffect, useState } from "react";
import { fetchSchedulesByTopic } from "@/services/reportService";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const AdvisoriesByTopic = () => {
  const [data, setData] = useState<{ topicName: string; count: number }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchSchedulesByTopic();
        setData(result.slice(0, 10).map(item => ({ // Tomar solo los primeros 10 registros
          topicName: item._id || "Desconocido", // Asegura que siempre haya un valor
          count: item.count
        })));
      } catch (err) {
        setError("No se pudo cargar la información.");
      }
    };
    getData();
  }, []);

  return (
    <div className="bg-white p-4 shadow-lg rounded-lg">
      <h2 className="text-lg font-bold mb-4">Cantidad de Asesorías por Tema</h2>
      
      {error && <p className="text-red-500">{error}</p>}

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="topicName" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" name="Cantidad de Asesorías" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AdvisoriesByTopic;

