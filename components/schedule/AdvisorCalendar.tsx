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

const diasMap: Record<string, number> = {
  lunes: 1,
  martes: 2,
  miércoles: 3,
  jueves: 4,
  viernes: 5,
};

const convertToEvent = (advisory: Advisory): AdvisoryEvent => {
  const dateStart = new Date(advisory.dateStart);

  return {
    id: advisory._id,
    title: advisory.advisorId?.name || "Sin nombre",
    advisorName: advisory.advisorId?.name || "Sin nombre",
    career: advisory.careerId?.name || "Sin carrera",
    time: moment(advisory.dateStart).format("dddd HH:mm"),
    start: new Date(advisory.dateStart),
    end: new Date(advisory.dateEnd),
    status: advisory.status,
    dateStart: new Date(advisory.dateStart),
    fullDateString: dateStart.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }), // Fecha completa para uso interno
  };
};

const AdvisoryCalendar = () => {
  const [events, setEvents] = useState<AdvisoryEvent[]>([]);
  const [selectedAdvisory, setSelectedAdvisory] = useState<AdvisoryEvent | null>(null);

  useEffect(() => {
    const loadAdvisories = async () => {
      try {
        const payload = getTokenPayload();
        const advisorId = payload?.id;
        if (!advisorId) return;

        const data = await fetchAdvisoriesByAdvisor(advisorId);
        const formattedEvents = data.map((advisory: Advisory) => convertToEvent(advisory));

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

      {selectedAdvisory && <AdvisoryList advisories={[selectedAdvisory]} />}
    </div>
  );
};

export default AdvisoryCalendar;
