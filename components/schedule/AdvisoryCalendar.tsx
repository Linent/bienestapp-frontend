import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

import "moment/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { fetchAdvisories } from "@/services/advisoryService";
import AdvisoryList from "@/components/schedule/AdvisoryList";
import { Advisory, AdvisoryEvent } from "@/types";
import { getTokenPayload } from "@/utils/auth";

moment.locale("es");
const localizer = momentLocalizer(moment);

const getNextWeekdaysRange = (): [Date, Date] => {
  const start = moment().startOf("day");
  const weekdays: Date[] = [];

  while (weekdays.length < 7) {
    if (![0, 6].includes(start.day())) {
      weekdays.push(start.toDate());
    }
    start.add(1, "day");
  }

  return [weekdays[0], weekdays[weekdays.length - 1]];
};

const AdvisoryCalendar = () => {
  const [events, setEvents] = useState<AdvisoryEvent[]>([]);
  const [selectedAdvisory, setSelectedAdvisory] =
    useState<AdvisoryEvent | null>(null);
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    const today = moment();
    const [minDate, maxDate] = getNextWeekdaysRange();
    const payload = getTokenPayload() as { id: string; role?: string };
    setUserRole(payload.role || "");

    const getAdvisories = async () => {
      try {
        const data = await fetchAdvisories();
        const formattedEvents: AdvisoryEvent[] = [];

        data.forEach((advisory: Advisory) => {
          const start = moment(advisory.dateStart);
          const end = moment(advisory.dateEnd);

          const now = moment();
          const startWindow = start.clone().subtract(30, "minutes");
          const endWindow = end.clone().add(30, "minutes");

          const isInDisplayWindow =
            now.isBetween(startWindow, endWindow, undefined, "[]") ||
            now.isBefore(startWindow);

          const isInRange = start.isBetween(
            moment(minDate).startOf("day"),
            moment(maxDate).endOf("day"),
            undefined,
            "[]"
          );
          const isWeekday = ![0, 6].includes(start.day());

          if (!advisory.recurring) {
            if (isInRange && isWeekday && isInDisplayWindow) {
              formattedEvents.push({
                id: advisory._id,
                title:
                  typeof advisory.advisorId === "object" &&
                  advisory.advisorId?.name
                    ? advisory.advisorId.name
                    : "Sin nombre",
                advisorName:
                  typeof advisory.advisorId === "object" &&
                  advisory.advisorId?.name
                    ? advisory.advisorId.name
                    : "Sin nombre",
                career:
                  typeof advisory.careerId === "object" &&
                  advisory.careerId?.name
                    ? advisory.careerId.name
                    : "Sin carrera",
                time: start.format("LLLL"),
                start: start.toDate(),
                end: end.toDate(),
                status: advisory.status,
                dateStart: start.toDate(),
              });
            }
          } else {
            for (let i = 0; i < 8; i++) {
              const newStart = start.clone().add(i, "weeks");
              const newEnd = end.clone().add(i, "weeks");

              const recStartWindow = newStart.clone().subtract(30, "minutes");
              const recEndWindow = newEnd.clone().add(30, "minutes");

              const recIsInDisplayWindow =
                now.isBetween(recStartWindow, recEndWindow, undefined, "[]") ||
                now.isBefore(recStartWindow);

              const recIsInRange = newStart.isBetween(
                moment(minDate).startOf("day"),
                moment(maxDate).endOf("day"),
                undefined,
                "[]"
              );
              const recIsWeekday = ![0, 6].includes(newStart.day());

              if (recIsInRange && recIsWeekday && recIsInDisplayWindow) {
                formattedEvents.push({
                  id: `${advisory._id}-${i}`,
                  title:
                    typeof advisory.advisorId === "object" &&
                    advisory.advisorId?.name
                      ? advisory.advisorId.name
                      : "Sin nombre",
                  advisorName:
                    typeof advisory.advisorId === "object" &&
                    advisory.advisorId?.name
                      ? advisory.advisorId.name
                      : "Sin nombre",
                  career:
                    typeof advisory.careerId === "object" &&
                    advisory.careerId?.name
                      ? advisory.careerId.name
                      : "Sin carrera",
                  time: newStart.format("LLLL"),
                  start: newStart.toDate(),
                  end: newEnd.toDate(),
                  status: advisory.status,
                  dateStart: newStart.toDate(),
                });
              }
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

  const eventStyleGetter = (
    event: AdvisoryEvent
  ): { style: React.CSSProperties } => {
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

  // --- Aquí va el truco para deshabilitar las horas de 12:00 a 14:00 ---
  const slotPropGetter = (date: Date) => {
  const hour = date.getHours();
  if (hour >= 12 && hour < 14) {
    return {
      style: {
        backgroundColor: "#e5e7eb",
        pointerEvents: "none" as React.CSSProperties["pointerEvents"], // <-- TIPADO
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
