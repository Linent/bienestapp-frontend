import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { fetchAttendancePerSchedule } from "@/services/reportService";

const COLORS = ["#0088FE", "#FF8042"]; // Azul para presente, naranja para ausente

const AttendancePerSchedule = () => {
  const [data, setData] = useState<
    { advisoryId: string; attendanceRate: number }[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchAttendancePerSchedule();
        setData(result);
      } catch (err) {
        setError("No se pudo cargar la información.");
      }
    };

    getData();
  }, []);

  return (
    <div className="bg-white p-4 shadow-lg rounded-lg">
      <h2 className="text-lg font-bold mb-4">
        Porcentaje de Asistencia por Asesoría
      </h2>
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {data.map((item, index) => {
          const chartData = [
            { name: "Asistió", value: item.attendanceRate },
            { name: "No asistió", value: 1 - item.attendanceRate },
          ];

          return (
            <div key={item.advisoryId} className="flex flex-col items-center">
              <ResponsiveContainer width={200} height={200}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    label={({ percent }) =>
                      `${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {chartData.map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <p className="mt-2 font-semibold text-sm text-gray-700">
                ID Asesoría: {item.advisoryId}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AttendancePerSchedule;

