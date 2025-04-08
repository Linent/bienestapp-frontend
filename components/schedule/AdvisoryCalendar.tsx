import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { fetchAdvisories } from "@/services/advisoryService";
import AdvisoryList from "@/components/schedule/AdvisoryList"; // Asegúrate que sea export default
moment.locale("es");

const localizer = momentLocalizer(moment);

const AdvisoryCalendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedAdvisory, setSelectedAdvisory] = useState(null);

  useEffect(() => {
    const getAdvisories = async () => {
      try {
        const data = await fetchAdvisories();
  
        const today = moment().startOf("day");
        const formattedEvents = [];
  
        data.forEach((advisory) => {
          const start = moment(advisory.dateStart);
          const end = moment(advisory.dateEnd);
  
          // Si la fecha ya pasó y no es recurrente, no lo mostramos
          if (!advisory.recurring && start.isBefore(today)) return;
  
          if (advisory.recurring) {
            for (let i = 0; i < 8; i++) {
              const newStart = start.clone().add(i, "weeks");
              const newEnd = end.clone().add(i, "weeks");
  
              // Evita fechas pasadas
              if (newStart.isBefore(today)) continue;
  
              formattedEvents.push({
                id: `${advisory._id}-${i}`,
                title: advisory.advisorId?.name || "Sin nombre",
                advisorName: advisory.advisorId?.name || "Sin nombre",
                career: advisory.careerId?.name || "Sin carrera",
                time: newStart.format("LLLL"),
                start: newStart.toDate(),
                end: newEnd.toDate(),
                status: advisory.status,
              });
            }
          } else {
            formattedEvents.push({
              id: advisory._id,
              title: advisory.advisorId?.name || "Sin nombre",
              advisorName: advisory.advisorId?.name || "Sin nombre",
              career: advisory.careerId?.name || "Sin carrera",
              time: start.format("LLLL"),
              start: start.toDate(),
              end: end.toDate(),
              status: advisory.status,
            });
          }
        });
  

        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error cargando asesorías:", error);
      }
    };
  
    getAdvisories();
  }, []);
  
  const handleEventClick = (event) => {
    setSelectedAdvisory(event); // Pasamos el evento seleccionado
  };

  const eventStyleGetter = (event) => {
    const backgroundColor = event.status === "approved" ? "#007bff" : "#ddd";
    return {
      style: {
        backgroundColor,
        color: "white",
        borderRadius: "5px",
        padding: "5px",
      },
    };
  };

  return (
    <div className="min-h-[600px] p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Calendario de Asesorías</h2>

      <Calendar
  localizer={localizer}
  events={events}
  startAccessor="start"
  endAccessor="end"
  style={{ height: 550 }}
  eventPropGetter={eventStyleGetter}
  onSelectEvent={handleEventClick}
  defaultView="day" // 👉 inicia en la vista agenda
  defaultDate={new Date()} // 👉 inicia en la fecha actual
  messages={{
    next: "Siguiente",
    previous: "Anterior",
    today: "Hoy",
    month: "Mes",
    week: "Semana",
    day: "Día",
    agenda: "Agenda",
    noEventsInRange: "No hay eventos en este rango.",
  }}
  min={new Date(0, 0, 0, 8, 0)}
  max={new Date(0, 0, 0, 18, 0)}
/>

      {/* Mostramos el componente que tiene el modal, pasándole el evento seleccionado */}
      {selectedAdvisory && <AdvisoryList advisories={[selectedAdvisory]} />}
    </div>
  );
};

export default AdvisoryCalendar;

