import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

import "moment/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { fetchAdvisories } from "@/services/advisoryService";
import AdvisoryList from "@/components/schedule/AdvisoryList";
import { Advisory, AdvisoryEvent } from "@/types";

moment.locale("es");
const localizer = momentLocalizer(moment);

const getNext7Weekdays = (): Date[] => {
  const result: Date[] = [];
  let current = moment();
  while (result.length < 7) {
    if (current.day() !== 0 && current.day() !== 6) {
      result.push(current.toDate());
    }
    current = current.add(1, "day");
  }
  return result;
};

const AdvisoryCalendar = () => {
  const [events, setEvents] = useState<AdvisoryEvent[]>([]);
  const [selectedAdvisory, setSelectedAdvisory] = useState<AdvisoryEvent | null>(null);

  useEffect(() => {
    const today = moment();
    const [minDate, maxDate] = [getNext7Weekdays()[0], getNext7Weekdays().slice(-1)[0]];

    const getAdvisories = async () => {
      try {
        const data = await fetchAdvisories();

        const formattedEvents: AdvisoryEvent[] = [];

        data.forEach((advisory: Advisory) => {
          const start = moment(advisory.dateStart);
          const end = moment(advisory.dateEnd);

          if (!advisory.recurring) {
            if (
              start.isBetween(moment(minDate).startOf("day"), moment(maxDate).endOf("day"), undefined, "[]") &&
              ![0, 6].includes(start.day()) &&
              start.isAfter(today)
            ) {
              formattedEvents.push({
                id: advisory._id,
                title: advisory.advisorId?.name || "Sin nombre",
                advisorName: advisory.advisorId?.name || "Sin nombre",
                career: advisory.careerId?.name || "Sin carrera",
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

              if (
                newStart.isBetween(moment(minDate).startOf("day"), moment(maxDate).endOf("day"), undefined, "[]") &&
                ![0, 6].includes(newStart.day()) &&
                newStart.isAfter(today)
              ) {
                formattedEvents.push({
                  id: `${advisory._id}-${i}`,
                  title: advisory.advisorId?.name || "Sin nombre",
                  advisorName: advisory.advisorId?.name || "Sin nombre",
                  career: advisory.careerId?.name || "Sin carrera",
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

  return (
    <div className="w-full min-h-[600px] p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Calendario de Asesorías</h2>

      <Calendar
        localizer={localizer}
        views={['day', 'week', 'agenda']}
        defaultView="day"
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

