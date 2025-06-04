// components/reports/UserQueryDashboard.tsx
import React, { useEffect, useState } from "react";
import { Card, CardBody } from "@heroui/react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import {
  fetchByBeneficiary,
  fetchByProgram,
} from "@/services/reportService";
import { Spinner } from "@heroui/react";
import ChartTopTopics from "./ChartTopTopics";
import ChartQueriesByDay from "./ChartQueriesByDay";
import { ActivityIcon, AwardIcon, BookTextIcon, UsersIcon } from "../icons/ActionIcons";

const CHART_HEIGHT = 260;

const CardDashboard = ({ title, icon, children }: any) => (
  <Card className="w-full shadow-md rounded-2xl">
    <div className="flex items-center gap-3 px-6 py-4 border-b bg-gray-50">
      <span className="text-xl">{icon}</span>
      <span className="font-semibold text-lg">{title}</span>
    </div>
    <CardBody className="p-0">{children}</CardBody>
  </Card>
);

const UserQueryDashboard: React.FC = () => {
  const [byBeneficiary, setByBeneficiary] = useState<any[]>([]);
  const [byProgram, setByProgram] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [d2, d3] = await Promise.all([
        fetchByBeneficiary(),
        fetchByProgram(),
      ]);
      setByBeneficiary(d2);
      setByProgram(d3);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner color="danger" size="lg" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
      {/* Consultas por Día */}
      <CardDashboard
        title="Consultas por Día"
        icon={<ActivityIcon className="text-danger" style={{ fontSize: 32 }} />}
      >
        <ChartQueriesByDay height={CHART_HEIGHT} />
      </CardDashboard>

      {/* Top Temas Consultados */}
      <CardDashboard
        title="Top Temas Consultados"
        icon={<BookTextIcon className="text-primary" style={{ fontSize: 32 }} />}
      >
        <div className="flex justify-center items-center w-full" style={{ minHeight: CHART_HEIGHT }}>
          <ChartTopTopics height={CHART_HEIGHT - 30} />
        </div>
      </CardDashboard>

      {/* Consultas por Tipo de Beneficiario */}
      <CardDashboard
        title="Consultas por Tipo de Beneficiario"
        icon={<UsersIcon className="text-success" style={{ fontSize: 32 }} />}
      >
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <BarChart data={byBeneficiary}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="beneficiaryType" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#34D399" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardDashboard>

      {/* Consultas por Programa Académico */}
      <CardDashboard
  title="Consultas por Carrera"
  icon={<AwardIcon className="text-warning" style={{ fontSize: 32 }} />}
>
  <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
    <BarChart data={byProgram}>
      <CartesianGrid strokeDasharray="3 3" />
      {/* Aquí cambiamos la key */}
      <XAxis dataKey="careerName" />
      <YAxis />
      <Tooltip 
        formatter={(value, name, props) =>
          [`${value} consultas`, "Total"]
        }
        labelFormatter={(label, props) =>
          `Carrera: ${label}`
        }
      />
      <Bar dataKey="total" fill="#FBBF24" radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
</CardDashboard>
    </div>
  );
};

export default UserQueryDashboard;
