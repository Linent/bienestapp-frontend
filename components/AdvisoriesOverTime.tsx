import { useEffect, useState } from "react";
import { 
  fetchAdvisoriesLast7Days, 
  fetchAdvisoriesLast30Days, 
  fetchAdvisoriesLastYear, 
  AdvisoryReport 
} from "@/services/reportService";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const AdvisoriesOverTime = () => {
  const [data, setData] = useState<{ range: string; data: AdvisoryReport[] }[]>([]);
  const [selectedRange, setSelectedRange] = useState("Últimos 7 días"); // Estado del filtro
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const last7Days = await fetchAdvisoriesLast7Days();
        const last30Days = await fetchAdvisoriesLast30Days();
        const lastYear = await fetchAdvisoriesLastYear();

        setData([
          { range: "Últimos 7 días", data: last7Days },
          { range: "Últimos 30 días", data: last30Days },
          { range: "Último año", data: lastYear },
        ]);
      } catch (err) {
        setError("No se pudo cargar la información.");
      }
    };

    getData();
  }, []);

  const selectedData = data.find(({ range }) => range === selectedRange)?.data || [];

  return (
    <div className="bg-white p-4 shadow-lg rounded-lg">
      <h2 className="text-lg font-bold mb-4">Asesorías en el Tiempo</h2>
      
      {error && <p className="text-red-500">{error}</p>}

      {/* Filtro de selección */}
      <div className="mb-4">
        <label className="mr-2 font-semibold">Selecciona un rango:</label>
        <select 
          value={selectedRange} 
          onChange={(e) => setSelectedRange(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option>Últimos 7 días</option>
          <option>Últimos 30 días</option>
          <option>Último año</option>
        </select>
      </div>

      {/* Gráfica basada en la selección */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={selectedData}>
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="count" name="Asesorias" stroke="#FF5733" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AdvisoriesOverTime;
