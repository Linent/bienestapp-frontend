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
                // ❌ innerRadius={40} ← Elimina esta línea
                label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-6 w-full">
            <ul className="flex flex-col sm:flex-row sm:justify-center gap-2 text-sm">
              {chartData.map((entry, index) => (
                <li
                  key={index}
                  className="flex items-center justify-center gap-2"
                >
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></span>
                  {entry.name}
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
