import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment-timezone";
import "moment/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { fetchAdvisories } from "@/services/advisoryService";
import AdvisoryList from "@/components/schedule/AdvisoryList";
import { Advisory, AdvisoryEvent } from "@/types";
import { getTokenPayload } from "@/utils/auth";

moment.locale("es");
const localizer = momentLocalizer(moment);
const COLOMBIA_TZ = "America/Bogota";

// Devuelve los siguientes 7 días laborables a partir de hoy
const getNext7Workdays = () => {
  const days: moment.Moment[] = [];
  let current = moment().tz(COLOMBIA_TZ).startOf("day");
  while (days.length < 7) {
    // Solo lunes a viernes
    if (current.isoWeekday() >= 1 && current.isoWeekday() <= 5) {
      days.push(current.clone());
    }
    current.add(1, "day");
  }
  return days;
};

const AdvisoryCalendar = () => {
  const [events, setEvents] = useState<AdvisoryEvent[]>([]);
  const [selectedAdvisory, setSelectedAdvisory] = useState<AdvisoryEvent | null>(null);
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    const daysToShow = getNext7Workdays();
    const minDate = daysToShow[0].clone().startOf("day");
    const maxDate = daysToShow[daysToShow.length - 1].clone().endOf("day");
    const payload = getTokenPayload() as { id: string; role?: string };
    setUserRole(payload.role || "");

    const getAdvisories = async () => {
      try {
        const data = await fetchAdvisories();
        const formattedEvents: AdvisoryEvent[] = [];

        data.forEach((advisory: Advisory) => {
          const baseStart = moment.utc(advisory.dateStart).tz(COLOMBIA_TZ);
          const baseEnd = moment.utc(advisory.dateEnd).tz(COLOMBIA_TZ);

          if (advisory.recurring) {
            // Para cada uno de los próximos 7 días laborables
            daysToShow.forEach((day: moment.Moment) => {
              if (day.isoWeekday() === baseStart.isoWeekday()) {
                const start: moment.Moment = day.clone()
                  .hour(baseStart.hour())
                  .minute(baseStart.minute())
                  .second(baseStart.second())
                  .millisecond(baseStart.millisecond());
                const end: moment.Moment = day.clone()
                  .hour(baseEnd.hour())
                  .minute(baseEnd.minute())
                  .second(baseEnd.second())
                  .millisecond(baseEnd.millisecond());
                if (end.isSameOrAfter(moment().tz(COLOMBIA_TZ))) {
                  formattedEvents.push({
                    id: `${advisory._id}-${start.format("YYYY-MM-DD")}`,
                    title: typeof advisory.advisorId === "object" && advisory.advisorId !== null
                      ? advisory.advisorId.name
                      : typeof advisory.advisorId === "string"
                        ? advisory.advisorId
                        : "Sin nombre",
                    advisorName: typeof advisory.advisorId === "object" && advisory.advisorId !== null
                      ? advisory.advisorId.name
                      : typeof advisory.advisorId === "string"
                        ? advisory.advisorId
                        : "Sin nombre",
                    career:
                      typeof advisory.careerId === "object" && advisory.careerId !== null
                        ? advisory.careerId.name
                        : typeof advisory.careerId === "string"
                          ? advisory.careerId
                          : "Sin carrera",
                    time: start.format("LLLL"),
                    start: start.toDate(),
                    end: end.toDate(),
                    status: advisory.status,
                    dateStart: start.toDate(),
                  });
                }
              }
            });
          } else {
            if (
              baseStart.isBetween(minDate, maxDate, undefined, "[]") &&
              baseEnd.isSameOrAfter(moment().tz(COLOMBIA_TZ)) &&
              baseStart.isoWeekday() >= 1 &&
              baseStart.isoWeekday() <= 5
            ) {
              formattedEvents.push({
                id: advisory._id,
                title: typeof advisory.advisorId === "object" && advisory.advisorId !== null
                  ? advisory.advisorId.name
                  : typeof advisory.advisorId === "string"
                    ? advisory.advisorId
                    : "Sin nombre",
                advisorName: typeof advisory.advisorId === "object" && advisory.advisorId !== null
                  ? advisory.advisorId.name
                  : typeof advisory.advisorId === "string"
                    ? advisory.advisorId
                    : "Sin nombre",
                career: typeof advisory.careerId === "object" && advisory.careerId !== null
                  ? advisory.careerId.name
                  : typeof advisory.careerId === "string"
                    ? advisory.careerId
                    : "Sin carrera",
                time: baseStart.format("LLLL"),
                start: baseStart.toDate(),
                end: baseEnd.toDate(),
                status: advisory.status,
                dateStart: baseStart.toDate(),
              });
            }
          }
        });

        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error cargando asesorías:", error);
      }
    };

    getAdvisories();
  }, []);

  const handleEventClick = (event: AdvisoryEvent): void => {
    setSelectedAdvisory(event);
  };

  const eventStyleGetter = (event: AdvisoryEvent): { style: React.CSSProperties } => {
    const backgroundColor = event.status === "approved" ? "#007bff" : "#ccc";
    return {
      style: {
        backgroundColor,
        color: "white",
        borderRadius: "6px",
        padding: "4px",
      },
    };
  };

  const slotPropGetter = (date: Date) => {
    const hour = date.getHours();
    if (hour >= 12 && hour < 14) {
      return {
        style: {
          backgroundColor: "#e5e7eb",
          pointerEvents: "none" as React.CSSProperties["pointerEvents"],
          opacity: 0.4,
        },
      };
    }
    return {};
  };

  return (
    <div className="w-full min-h-[600px] p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Calendario de Asesorías</h2>
      <Calendar
        localizer={localizer}
        views={["work_week", "day", "agenda"]}
        defaultView="work_week"
        events={events}
        startAccessor="start"
        endAccessor="end"
        min={new Date(0, 0, 0, 8, 0)}
        max={new Date(0, 0, 0, 18, 0)}
        style={{ height: 550 }}
        eventPropGetter={eventStyleGetter}
        slotPropGetter={slotPropGetter}
        step={30}
        timeslots={2}
        messages={{
          next: "Siguiente",
          previous: "Anterior",
          month: "Mes",
          today: "Hoy",
          week: "Semana",
          work_week: "Semana laboral",
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
