import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

import { fetchSchedulesByTopic } from "@/services/reportService";

const COLORS = [
  "#6366f1", // indigo-500
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#3b82f6",
  "#f97316",
  "#14b8a6",
  "#22c55e",
];

interface TopicData {
  topicName: string;
  count: number;
}

const AdvisoriesByTopic = () => {
  const [data, setData] = useState<TopicData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const result = await fetchSchedulesByTopic();
        const top10 = result
          .map(item => ({
            topicName: item.topic || "Desconocido",
            count: item.count,
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);
        setData(top10);
      } catch {
        setError("No se pudo cargar la información.");
      }
    })();
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
              // Color de fondo, borde y texto del tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderColor: "#e5e7eb",
                color: "#6366f1",
              }}
              // Color del título (topicName)
              labelStyle={{ color: "#27272A", fontWeight: 500 }}
              // Color de cada línea del payload
              itemStyle={{ color: "#6366f1" }}
            />
            <Bar
              dataKey="count"
              name="Asesorías"
              radius={[6, 6, 0, 0]}
              barSize={40}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default AdvisoriesByTopic;
