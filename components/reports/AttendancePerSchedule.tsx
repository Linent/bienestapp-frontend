import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchAttendancePercentage } from "@/services/reportService";
import { Spinner } from "@heroui/react";

// Colores accesibles
const COLORS = ["#4ade80", "#f87171"]; // verde / rojo

const AttendancePieChart = () => {
  const [percentage, setPercentage] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPercentage = async () => {
      setLoading(true);
      try {
        const value = await fetchAttendancePercentage();
        setPercentage(Number(value));
      } catch {
        setPercentage(null);
      } finally {
        setLoading(false);
      }
    };
    loadPercentage();
  }, []);

  const chartData = [
    { name: "Asistió", value: percentage ?? 0 },
    { name: "No asistió", value: percentage !== null ? 100 - percentage : 0 },
  ];

  return (
    <div className="w-full bg-white p-6 shadow-lg rounded-lg max-w-xl mx-auto">
      <h2 className="text-lg font-bold mb-6 text-center">
        Porcentaje de Asistencia General
      </h2>
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner color="success" size="lg" />
        </div>
      ) : percentage === null ? (
        <p className="text-red-500 text-center">No se pudo cargar la información.</p>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <ResponsiveContainer width={450} height={250}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ percent, name }) =>
                  name === "Asistió" ? `${percent ? (percent * 100).toFixed(1) : 0}%` : ""
                }
              >
                {chartData.map((entry, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => `${v.toFixed(1)}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-6 w-full">
            <ul className="flex flex-col sm:flex-row sm:justify-center gap-2 text-sm">
              {chartData.map((entry, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  ></span>
                  {entry.name}: <b>{entry.value.toFixed(1)}%</b>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendancePieChart;
