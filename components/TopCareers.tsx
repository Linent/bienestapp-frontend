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

import { fetchTopCareers, TopCareerReport } from "@/services/reportService";

const TopCareersChart = () => {
  const [data, setData] = useState<TopCareerReport[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchTopCareers();

        setData(result);
      } catch (err) {
        setError("No se pudo cargar la información.");
      }
    };

    getData();
  }, []);

  return (
    <div className="bg-white p-4 shadow-lg rounded-lg">
      <h2 className="text-lg font-bold mb-4">Top Carreras con Más Asesorías</h2>
      {error && <p className="text-red-500">{error}</p>}
      <ResponsiveContainer height={300} width="100%">
        <BarChart data={data}>
          <XAxis dataKey="career" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="totalAdvisories"
            fill="#8884d8"
            name="carreras más solicitadas"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopCareersChart;
