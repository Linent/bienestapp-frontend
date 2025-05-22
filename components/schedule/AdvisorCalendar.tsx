import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { fetchAdvisoriesByAdvisor } from "@/services/advisoryService";
import AdvisoryList from "@/components/schedule/AdvisoryList";
import { Advisory, AdvisoryEvent } from "@/types";
import { getTokenPayload } from "@/utils/auth";

moment.locale("es");
const localizer = momentLocalizer(moment);

// --- Helper: obtener lunes actual y domingo de la siguiente semana ---
function getWeekRange() {
  const today = moment();
  const mondayThisWeek = today.clone().startOf("week").add(1, "day"); // lunes
  const sundayNextWeek = mondayThisWeek.clone().add(13, "days"); // domingo de la próxima semana
  return [mondayThisWeek.startOf("day"), sundayNextWeek.endOf("day")];
}

const convertToEvent = (advisory: Advisory, customDateStart?: Date, customDateEnd?: Date): AdvisoryEvent => {
  const dateStart = customDateStart ? new Date(customDateStart) : new Date(advisory.dateStart);
  const dateEnd = customDateEnd ? new Date(customDateEnd) : new Date(advisory.dateEnd);

  return {
    id: advisory._id + "-" + dateStart.getTime(),
    title: typeof advisory.advisorId === "object" && advisory.advisorId?.name ? advisory.advisorId.name : "Sin nombre",
    advisorName: typeof advisory.advisorId === "object" && advisory.advisorId?.name ? advisory.advisorId.name : "Sin nombre",
    career: typeof advisory.careerId === "object" && advisory.careerId?.name ? advisory.careerId.name : "Sin carrera",
    time: moment(dateStart).format("dddd HH:mm"),
    start: dateStart,
    end: dateEnd,
    status: advisory.status,
    dateStart: dateStart,
    fullDateString: dateStart.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  };
};

const AdvisoryCalendar = () => {
  const [events, setEvents] = useState<AdvisoryEvent[]>([]);
  const [userRole, setUserRole] = useState<string>("");
  const [selectedAdvisory, setSelectedAdvisory] = useState<AdvisoryEvent | null>(null);

  useEffect(() => {
    const loadAdvisories = async () => {
      try {
        const payload = getTokenPayload() as { id: string; role?: string };
        setUserRole(payload.role || "");
        const advisorId = payload?.id;
        if (!advisorId) return;

        const [minDate, maxDate] = getWeekRange();
        const data = await fetchAdvisoriesByAdvisor(advisorId);
        const formattedEvents: AdvisoryEvent[] = [];

        data.forEach((advisory: Advisory) => {
          const originalStart = moment(advisory.dateStart);
          const originalEnd = moment(advisory.dateEnd);

          // Si no es recurrente, solo agrega si cae en el rango
          if (!advisory.recurring) {
            if (originalStart.isBetween(minDate, maxDate, undefined, "[]")) {
              formattedEvents.push(convertToEvent(advisory));
            }
          } else {
            // Repite la asesoría en cada semana SIEMPRE que esté en el rango
            let i = 0;
            while (true) {
              const newStart = originalStart.clone().add(i, "weeks");
              const newEnd = originalEnd.clone().add(i, "weeks");
              if (newStart.isAfter(maxDate)) break; // No seguir si ya pasó el rango

              if (newStart.isBetween(minDate, maxDate, undefined, "[]")) {
                formattedEvents.push(
                  convertToEvent(advisory, newStart.toDate(), newEnd.toDate())
                );
              }
              i++;
            }
          }
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

  const eventStyleGetter = (
    event: AdvisoryEvent
  ): { style: React.CSSProperties } => {
    let backgroundColor = "#007bff";
    if (event.status === "pending") backgroundColor = "#facc15";
    if (event.status === "canceled") backgroundColor = "#ef4444";

    return {
      style: {
        backgroundColor,
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

      {selectedAdvisory && (
        <AdvisoryList advisories={[selectedAdvisory]} userRole={userRole} />
      )}
    </div>
  );
};

export default AdvisoryCalendar;
