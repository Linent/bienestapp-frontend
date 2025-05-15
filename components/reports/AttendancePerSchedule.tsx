import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { fetchSchedules } from "@/services/scheduleService";
import { Schedule } from "@/types/types";

// Colores más suaves y accesibles
const COLORS = ["#4ade80", "#f87171"]; // Verde suave / Rojo claro

const AttendancePieChart = () => {
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAttendance = async () => {
      try {
        const schedules: Schedule[] = await fetchSchedules();
        const total = schedules.length;
        const attended = schedules.filter((s) => s.attendance).length;
        const notAttended = total - attended;

        const data = [
          { name: "Asistió", value: attended },
          { name: "No asistió", value: notAttended },
        ];

        setChartData(data);
      } catch (err) {
        setError("No se pudo cargar la información.");
      }
    };

    loadAttendance();
  }, []);

  return (
    <div className="w-full bg-white p-6 shadow-lg rounded-lg max-w-xl mx-auto">
      <h2 className="text-lg font-bold mb-6 text-center">
        Porcentaje de Asistencia General
      </h2>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {!error && chartData.length > 0 && (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="40%"
              cy="50%"
              outerRadius={100}
              innerRadius={0}
              label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend
              verticalAlign="middle"
              align="right"
              layout="vertical"
              iconType="circle"
              formatter={(value) => <span className="text-sm">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default AttendancePieChart;
