import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

import "moment/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { fetchAdvisoriesThisWeek } from "@/services/advisorAdvisoryService";
import AdvisoryList from "@/components/schedule/AdvisoryList";
import { AdvisoryEvent } from "@/types";

moment.locale("es");
const localizer = momentLocalizer(moment);

const parseHorario = (diaHora: string, nombre: string, email: string): AdvisoryEvent | null => {
  const [dia, horario] = diaHora.split(" de ");
  const [horaInicio, horaFin] = horario.split(" a ");
  const diasMap: Record<string, number> = {
    lunes: 1,
    martes: 2,
    miércoles: 3,
    jueves: 4,
    viernes: 5,
  };

  const diaSemana = diasMap[dia.toLowerCase()];
  if (diaSemana === undefined) return null;

  const now = moment();
  const fechaBase = moment().day(diaSemana);
  if (fechaBase.isBefore(now, "day")) {
    fechaBase.add(7, "days"); // ir a la próxima semana si ya pasó
  }

  const [h1, m1] = horaInicio.split(":").map(Number);
  const [h2, m2] = horaFin.split(":").map(Number);
  const start = fechaBase.clone().hour(h1).minute(m1).toDate();
  const end = fechaBase.clone().hour(h2).minute(m2).toDate();

  return {
    id: `${email}-${diaHora}`,
    title: nombre,
    advisorName: nombre,
    career: "N/A",
    time: diaHora,
    start,
    end,
    status: "available",
    dateStart: start,
  };
};

const AdvisoryCalendar = () => {
  const [events, setEvents] = useState<AdvisoryEvent[]>([]);
  const [selectedAdvisory, setSelectedAdvisory] = useState<AdvisoryEvent | null>(null);

  useEffect(() => {

    // Obtener los datos del localStorage y mostrar en consola
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const codigo = localStorage.getItem("codigo");
    const email = localStorage.getItem("email");

    // Imprimir los datos en consola
    console.log("Token:", token);
    console.log("Role:", role);
    console.log("Codigo:", codigo);
    console.log("Email:", email);

    const loadAdvisories = async () => {
      try {
        const data = await fetchAdvisoriesThisWeek();
        const formattedEvents: AdvisoryEvent[] = [];

        data.forEach((advisor: any) => {
          advisor.horarios.forEach((horario: string) => {
            const event = parseHorario(horario, advisor.name, advisor.email);
            if (event) {
              // Filtrar por 'codigo'
              if (advisor.codigo === codigo) {
                formattedEvents.push(event);
              }
            }
          });
        });

        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error cargando asesorías:", error);
      }
    };

    loadAdvisories();
  }, []);

  const handleEventClick = (event: AdvisoryEvent): void => {
    setSelectedAdvisory(event);
  };

  const eventStyleGetter = (event: AdvisoryEvent): { style: React.CSSProperties } => {
    return {
      style: {
        backgroundColor: "#007bff",
        color: "white",
        borderRadius: "6px",
        padding: "4px",
      },
    };
  };

  return (
    <div className="w-full min-h-[600px] p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Calendario de Asesorías</h2>

      <Calendar
        localizer={localizer}
        views={["day", "week", "agenda"]}
        defaultView="week"
        events={events}
        startAccessor="start"
        endAccessor="end"
        min={new Date(0, 0, 0, 8, 0)}
        max={new Date(0, 0, 0, 18, 0)}
        style={{ height: 550 }}
        eventPropGetter={eventStyleGetter}
        messages={{
          next: "Siguiente",
          previous: "Anterior",
          month: "Mes",
          today: "Hoy",
          week: "Semana",
          day: "Día",
          agenda: "Agenda",
          noEventsInRange: "No hay eventos en este rango.",
        }}
        onSelectEvent={handleEventClick}
      />

      {selectedAdvisory && <AdvisoryList advisories={[selectedAdvisory]} />}
    </div>
  );
};

export default AdvisoryCalendar;
