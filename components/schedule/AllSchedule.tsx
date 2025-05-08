import { Card, CardBody, CardHeader, Tab, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { useEffect, useState } from "react";
import { fetchSchedules } from "@/services/scheduleService";
import { Schedule } from "@/types/types";

const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

const WeeklySchedules = () => {
  const [schedulesByDay, setSchedulesByDay] = useState<Record<string, Schedule[]>>({});

  // Función para obtener el lunes y viernes de la semana actual
  const getWeekRange = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 (domingo) - 6 (sábado)
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Si es domingo, ir al lunes anterior

    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0);

    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);
    friday.setHours(23, 59, 59, 999);

    return { monday, friday };
  };

  useEffect(() => {
    const loadSchedules = async () => {
      try {
        const schedules: Schedule[] = await fetchSchedules();
        const { monday, friday } = getWeekRange();

        // Filtrar solo los que están dentro del rango lunes-viernes
        const filtered = schedules.filter((schedule) => {
          const date = new Date(schedule.dateStart);
          return date >= monday && date <= friday;
        });

        // Agrupar por día de la semana
        const grouped: Record<string, Schedule[]> = {};
        filtered.forEach((schedule) => {
          const date = new Date(schedule.dateStart);
          const dayIndex = date.getDay();
          const dayLabel = daysOfWeek[dayIndex - 1]; // lunes = 1, así que restamos 1
          if (!grouped[dayLabel]) grouped[dayLabel] = [];
          grouped[dayLabel].push(schedule);
        });

        setSchedulesByDay(grouped);
      } catch (error) {
        console.error("Error al cargar los horarios", error);
      }
    };

    loadSchedules();
  }, []);

  return (
    <div className="w-full p-4 overflow-x-auto">
      <Table className="w-full text-sm">
        <TableHeader>
          <TableColumn>Estudiante</TableColumn>
          <TableColumn>Asesor</TableColumn>
          <TableColumn>Tema</TableColumn>
          <TableColumn>Carrera</TableColumn>
          <TableColumn>Día</TableColumn>
          <TableColumn>Fecha</TableColumn>
          <TableColumn>Asistencia</TableColumn>
        </TableHeader>
        <TableBody>
          {Object.entries(schedulesByDay)
            .flatMap(([day, schedules]: [string, Schedule[]]) =>
              schedules.map((schedule: Schedule) => (
                <TableRow key={schedule._id} className="border-b">
                  <TableCell>{schedule.studentId.name}</TableCell>
                  <TableCell>{schedule.AdvisoryId.advisorId.name}</TableCell>
                  <TableCell>{schedule.topic}</TableCell>
                  <TableCell>{schedule.AdvisoryId.careerId.name}</TableCell>
                  <TableCell>{schedule.AdvisoryId.day}</TableCell>
                  <TableCell>{new Date(schedule.dateStart).toLocaleString("es-CO")}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        schedule.attendance
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {schedule.attendance ? "Asistió" : "No asistió"}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
        </TableBody>
      </Table>
    </div>
  );
};

export default WeeklySchedules;
