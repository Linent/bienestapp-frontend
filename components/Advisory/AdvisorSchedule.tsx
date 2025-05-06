import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from "@heroui/react";
import { fetchAdvisoriesByAdvisor } from "@/services/advisoryService";

interface Advisory {
  _id: string;
  advisorId: {
    _id: string;
    name: string;
    email: string;
  };
  careerId: {
    _id: string;
    name: string;
  };
  day: string;
  dateStart: string;
  dateEnd: string;
  status: string;
  recurring: boolean;
}

const statusColorMap: Record<string, "primary" | "success" | "danger"> = {
  approved: "success",
  pending: "primary",
  canceled: "danger",
};

const AdvisorSchedule = ({ advisorId }: { advisorId: string }) => {
  const [advisories, setAdvisories] = useState<Advisory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAdvisories = async () => {
      try {
        const data = await fetchAdvisoriesByAdvisor(advisorId);
        setAdvisories(data);
      } catch (error) {
        console.error("Error cargando asesorías:", error);
      } finally {
        setLoading(false);
      }
    };

    if (advisorId) loadAdvisories();
  }, [advisorId]);

  if (loading) return <p>Cargando asesorías...</p>;

  return (
    <div className="bg-white p-4 shadow rounded">
      <h2 className="text-xl font-bold mb-4">Horario de {advisories[0]?.advisorId?.name || "Asesor"}</h2>

      {advisories.length === 0 ? (
        <p>No hay asesorías registradas.</p>
      ) : (
        <Table isStriped>
          <TableHeader>
            <TableColumn>Día</TableColumn>
            <TableColumn>Inicio</TableColumn>
            <TableColumn>Fin</TableColumn>
            <TableColumn>Carrera</TableColumn>
            <TableColumn>Estado</TableColumn>
          </TableHeader>
          <TableBody>
            {advisories.map((a) => {
              const start = new Date(a.dateStart);
              const end = new Date(a.dateEnd);
              const formatOptions: Intl.DateTimeFormatOptions = {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
                timeZone: "America/Bogota",
              };
              return (
                <TableRow key={a._id}>
                  <TableCell className="capitalize">{a.day}</TableCell>
                  <TableCell>
                    {start.toLocaleTimeString("es-CO", formatOptions)}
                  </TableCell>
                  <TableCell>
                    {end.toLocaleTimeString("es-CO", formatOptions)}
                  </TableCell>
                  <TableCell>{a.careerId.name}</TableCell>
                  <TableCell>
                    <Chip color={statusColorMap[a.status] || "primary"}>
                      {a.status}
                    </Chip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default AdvisorSchedule;
