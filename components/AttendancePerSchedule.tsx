import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { fetchAttendancePerSchedule } from "@/services/reportService";

const COLORS = ["#0088FE", "#FF8042"];

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
        Promedio de Asistencia por Asesoría
      </h2>
      {error && <p className="text-red-500">{error}</p>}
      <ResponsiveContainer height={300} width="100%">
        <PieChart>
          <Pie
            label
            cx="50%"
            cy="50%"
            data={data}
            dataKey="percentage"
            fill="#8884d8"
            nameKey="status"
            outerRadius={100}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendancePerSchedule;
