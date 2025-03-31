import { useEffect, useState } from "react";
import { fetchMostActiveAdvisor, MostActiveAdvisor } from "@/services/reportService";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const MostActiveAdvisorChart = () => {
  const [data, setData] = useState<MostActiveAdvisor[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchMostActiveAdvisor();
        setData(result);
      } catch (err) {
        setError("No se pudo cargar la información.");
      }
    };

    getData();
  }, []);

  return (
    <div className="bg-white p-4 shadow-lg rounded-lg">
      <h2 className="text-lg font-bold mb-4">Asesor Más Activo</h2>
      {error && <p className="text-red-500">{error}</p>}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="advisorName" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="totalAdvisories" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MostActiveAdvisorChart;
