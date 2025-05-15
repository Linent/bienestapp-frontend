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
import { Select, SelectItem } from "@heroui/react";

import { fetchSchedulesByAdvisor } from "@/services/reportService";

const AdvisoriesByAdvisor = () => {
  const [data, setData] = useState<{ advisorName: string; count: number }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [topN, setTopN] = useState<number | "all">(10);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchSchedulesByAdvisor();

        const processed = result.map((item: any) => ({
          advisorName: item.advisorName || "Desconocido",
          count: item.count,
        }));

        setData(
          topN === "all" ? processed : processed.slice(0, Number(topN))
        );
      } catch (err) {
        setError("No se pudo cargar la información.");
      }
    };

    getData();
  }, [topN]);

  return (
    <div className="w-full bg-white p-6 shadow-lg rounded-lg max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Asesorías por Asesor
        </h2>
        <Select
          label="Mostrar"
          size="sm"
          className="max-w-xs"
          value={String(topN)}
          onChange={(e) =>
            setTopN(e.target.value === "all" ? "all" : parseInt(e.target.value))
          }
        >
          <SelectItem key="5" data-value="5">Top 5</SelectItem>
          <SelectItem key="10" data-value="10">Top 10</SelectItem>
          <SelectItem key="20" data-value="20">Top 20</SelectItem>
          <SelectItem key="all" data-value="all">Todos</SelectItem>
        </Select>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {!error && data.length > 0 && (
        <ResponsiveContainer width="100%" height={380}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 10, bottom: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="advisorName"
              angle={-30}
              textAnchor="end"
              interval={0}
              height={90}
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
              fill="#4f46e5" // Indigo-600 HeroUI
              radius={[6, 6, 0, 0]}
              barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default AdvisoriesByAdvisor;
