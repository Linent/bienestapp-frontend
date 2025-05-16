import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { Select, SelectItem } from "@heroui/react";

import {
  fetchSchedulesByDay,
  fetchSchedulesByMonth,
  fetchSchedulesByYear,
} from "@/services/reportService";

const AdvisoryLineChart = () => {
  const [filter, setFilter] = useState("7d");
  const [data, setData] = useState<{ date: string; count: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let result;
        if (filter === "7d") {
          result = await fetchSchedulesByDay();
        } else if (filter === "30d") {
          result = await fetchSchedulesByMonth();
        } else {
          result = await fetchSchedulesByYear();
        }

        setData(result);
      } catch (error) {
        console.error("Error al cargar el reporte de asesorías", error);
      }
    };

    fetchData();
  }, [filter]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Total de asesorías</h2>
        <Select
          label="Filtrar por"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-40"
        >
          <SelectItem key="7d" data-value="7d">7 días</SelectItem>
          <SelectItem key="30d" data-value="30d">30 días</SelectItem>
          <SelectItem key="12m" data-value="12m">1 año</SelectItem>
        </Select>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#94a3b8"
            angle={-45}
            textAnchor="end"
            interval={0}
          />
          <YAxis
            stroke="#94a3b8"
            label={{  angle: -90, position: "insideLeft", offset: 0 }}
          />
          <Tooltip formatter={(value: any) => `${value} asesorías`} />
          <Legend verticalAlign="top" height={36} />
          <Line
            type="monotone"
            dataKey="count"
            name="Cantidad"
            stroke="#7c3aed"
            strokeWidth={3}
            dot={{ r: 4, stroke: "#c4b5fd", strokeWidth: 2 }}
            activeDot={{ r: 6, stroke: "#c4b5fd", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AdvisoryLineChart;
