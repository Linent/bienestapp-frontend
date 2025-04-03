import { useEffect, useState } from "react";
import { fetchAttendancePerSchedule } from "@/services/reportService";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#0088FE", "#FF8042"];

const AttendancePerSchedule = () => {
  const [data, setData] = useState([]);
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
      <h2 className="text-lg font-bold mb-4">Promedio de Asistencia por Asesoría</h2>
      {error && <p className="text-red-500">{error}</p>}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey="percentage" nameKey="status" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
