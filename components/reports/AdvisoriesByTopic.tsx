import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { fetchSchedulesByTopic } from "@/services/reportService";

const AdvisoriesByTopic = () => {
  const [data, setData] = useState<{ topicName: string; count: number }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchSchedulesByTopic();
        setData(
          result.slice(0, 10).map((item) => ({
            topicName: item.topic || "Desconocido",
            count: item.count,
          }))
        );
      } catch (err) {
        setError("No se pudo cargar la información.");
      }
    };

    getData();
  }, []);

  return (
    <div className="w-full bg-white p-6 shadow-lg rounded-lg max-w-4xl mx-auto">
      <h2 className="text-lg font-semibold text-center mb-4">
        Asesorías por Tema (Top 10)
      </h2>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {!error && data.length > 0 && (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 10, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="topicName"
              angle={-25}
              textAnchor="end"
              interval={0}
              height={70}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 12 }}
              label={{
                value: "Cantidad",
                angle: -90,
                position: "insideLeft",
                offset: 10,
                fontSize: 12,
              }}
            />
            <Tooltip
              formatter={(value: number) => `${value} asesorías`}
              labelStyle={{ fontWeight: 500 }}
            />
            <Bar
              dataKey="count"
              name="Asesorías"
              fill="#6366f1" // Indigo-500 HeroUI
              radius={[6, 6, 0, 0]}
              barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default AdvisoriesByTopic;
