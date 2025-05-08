import { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
} from "@heroui/react";
import { updateAdvisory } from "@/services/advisoryService";

const daysOfWeek = [
  "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"
];

const hoursOfDay = [
  { label: "8:00 AM", value: "8" },
  { label: "10:00 AM", value: "10" },
  { label: "2:00 PM", value: "14" },
  { label: "4:00 PM", value: "16" },
];

const dayToNumber = {
  "domingo": 0,
  "lunes": 1,
  "martes": 2,
  "miércoles": 3,
  "jueves": 4,
  "viernes": 5,
  "sábado": 6,
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  advisory: {
    _id: string;
    day: string;
    dateStart: string;
    status: string;
    careerId: string;
    advisorId: string;
  };
  onSuccess: () => void;
}

const EditAdvisoryModal = ({ isOpen, onClose, advisory, onSuccess }: Props) => {
  const [day, setDay] = useState(advisory.day);
  const [hour, setHour] = useState("8");
  const [status, setStatus] = useState<"pending" | "approved" | "canceled" | undefined>(advisory.status as "pending" | "approved" | "canceled" | undefined);

  useEffect(() => {
    setDay(advisory.day);
    const currentDate = new Date(advisory.dateStart);
    setHour(currentDate.getHours().toString());
    setStatus(advisory.status as "pending" | "approved" | "canceled" | undefined);
  }, [advisory]);

  const getNextDateForDay = (targetDay: keyof typeof dayToNumber, hour: string) => {
      const today = new Date();
      const dayNumber = dayToNumber[targetDay];
    const todayNumber = today.getDay();

    // Calcular cuántos días faltan para el día objetivo
    let daysToAdd = (dayNumber - todayNumber + 7) % 7;
    if (daysToAdd === 0 && today.getHours() >= parseInt(hour)) {
      daysToAdd = 7; // Si es el mismo día pero ya pasó la hora, se toma la siguiente semana
    }

    const resultDate = new Date(today);
    resultDate.setDate(today.getDate() + daysToAdd);
    resultDate.setHours(parseInt(hour), 0, 0, 0);

    // Convertir a UTC ISO
    return resultDate.toISOString();
  };

  const calculateEndDate = (startISO: string) => {
    const startDate = new Date(startISO);
    startDate.setHours(startDate.getHours() + 2);
    return startDate.toISOString();
  };

  const handleSave = async () => {
    try {
      const newDateStart = getNextDateForDay(day as keyof typeof dayToNumber, hour);
      const dateEnd = calculateEndDate(newDateStart);

      await updateAdvisory(advisory._id, {
        day,
        dateStart: newDateStart,
        dateEnd,
        advisorId: advisory.advisorId,
        careerId: advisory.careerId,
        status,
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error al actualizar asesoría:", error);
      alert("No se pudo actualizar la asesoría.");
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader>Editar Asesoría</ModalHeader>
        <ModalBody>
          <Select label="Día" value={day} onChange={(e) => setDay(e.target.value)}>
            {daysOfWeek.map((d) => (
              <SelectItem key={d} data-value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</SelectItem>
            ))}
          </Select>

          <Select label="Hora" value={hour} onChange={(e) => setHour(e.target.value)}>
            {hoursOfDay.map(({ label, value }) => (
              <SelectItem key={value} data-value={value}>{label}</SelectItem>
            ))}
          </Select>

          <Select
            label="Estado"
            value={status}
            onChange={(e) => setStatus(e.target.value as "pending" | "approved" | "canceled")}
          >
            <SelectItem key="approved" data-value="approved">Aprobada</SelectItem>
            <SelectItem key="pending" data-value="pending">Pendiente</SelectItem>
            <SelectItem key="canceled" data-value="canceled">Cancelada</SelectItem>
          </Select>
        </ModalBody>

        <ModalFooter>
          <Button variant="light" onPress={onClose}>Cancelar</Button>
          <Button color="primary" onPress={handleSave}>Guardar cambios</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditAdvisoryModal;
