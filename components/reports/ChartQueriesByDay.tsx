// components/queries/ChartQueriesByDay.tsx
import { useEffect, useState } from "react";
import { fetchQueriesByDay } from "@/services/reportService";
import { Spinner, Select, SelectItem } from "@heroui/react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const RANGES = [
  { key: "7", label: "Últimos 7 días" },
  { key: "15", label: "Últimos 15 días" },
  { key: "30", label: "Últimos 30 días" },
  { key: "90", label: "Últimos 90 días" },
];

export default function ChartQueriesByDay({ height = 320 }: { height?: number }) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState("30");

  useEffect(() => {
    setLoading(true);
    fetchQueriesByDay(Number(days))
      .then(setData)
      .finally(() => setLoading(false));
  }, [days]);

  if (loading)
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <Spinner color="primary" />
      </div>
    );
  if (!data.length)
    return (
      <div className="flex items-center justify-center text-gray-500" style={{ height }}>
        No hay datos para mostrar.
      </div>
    );

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2 px-2">
        <h3 className="font-bold text-lg">Consultas por Día</h3>
        <Select
          className="w-44"
          aria-label="Rango de días"
          selectedKeys={new Set([days])}
          onSelectionChange={(keys) => setDays(Array.from(keys)[0] as string)}
        >
          {RANGES.map((r) => (
            <SelectItem key={r.key}>{r.label}</SelectItem>
          ))}
        </Select>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#7c3aed" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
