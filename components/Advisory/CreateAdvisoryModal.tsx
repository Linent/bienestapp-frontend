import { useState } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Button,
  Select,
  SelectItem,
} from "@heroui/react";
import { createAdvisory } from "@/services/advisoryService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  advisorId: string;
  careerId: string;
  onSuccess: () => void;
}

const weekdays = ["lunes", "martes", "miércoles", "jueves", "viernes"];
const hours = ["08:00", "10:00", "14:00", "16:00"];

const getNextDateInUTC = (day: string, hour: string): Date => {
  const daysMap: Record<string, number> = {
    domingo: 0,
    lunes: 1,
    martes: 2,
    miércoles: 3,
    jueves: 4,
    viernes: 5,
    sábado: 6,
  };

  const now = new Date();
  const today = now.getDay();
  const target = daysMap[day.toLowerCase()];
  let diff = (target - today + 7) % 7;

  if (diff === 0) {
    const [h, m] = hour.split(":").map(Number);
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const selectedTime = h * 60 + m;
    if (selectedTime <= currentTime) diff = 7;
  }

  // Fecha y hora local en Colombia (UTC-5)
  const localDate = new Date(now);
  localDate.setDate(now.getDate() + diff);
  const [hourCol, minuteCol] = hour.split(":").map(Number);
  localDate.setHours(hourCol);
  localDate.setMinutes(minuteCol);
  localDate.setSeconds(0);
  localDate.setMilliseconds(0);

  // Convertir la fecha local a UTC
  return localDate;
};

const CreateAdvisoryModal = ({
  isOpen,
  onClose,
  advisorId,
  careerId,
  onSuccess,
}: Props) => {
  const [day, setDay] = useState("");
  const [hour, setHour] = useState("");

  const handleSubmit = async () => {
    if (!day || !hour) {
      alert("Debes seleccionar el día y la hora.");
      return;
    }

    try {
      const dateStart = getNextDateInUTC(day, hour);
      const dateEnd = new Date(dateStart);
      dateEnd.setHours(dateEnd.getHours() + 1); // Assuming the advisory lasts 1 hour

      const payload = {
        advisorId,
        careerId,
        day,
        dateStart: dateStart.toISOString(),
        dateEnd: dateEnd.toISOString(),
        status: "approved" as "approved",
      };

      await createAdvisory(payload);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error al crear asesoría:", error);
      alert("Hubo un error al crear la asesoría.");
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader>Crear nueva Asesoría</ModalHeader>
        <ModalBody>
          <Select label="Día" value={day} onChange={(e) => setDay(e.target.value)}>
            {weekdays.map((d) => (
              <SelectItem key={d} data-value={d}>
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </SelectItem>
            ))}
          </Select>
          <Select label="Hora (Colombia)" value={hour} onChange={(e) => setHour(e.target.value)}>
            {hours.map((h) => (
              <SelectItem key={h} data-value={h}>
                {h}
              </SelectItem>
            ))}
          </Select>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Cancelar
          </Button>
          <Button color="primary" onPress={handleSubmit}>
            Crear
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateAdvisoryModal;
