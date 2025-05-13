import { useEffect, useState } from "react";
import {
  Modal, ModalContent, ModalHeader, ModalBody,
  ModalFooter, Button, Select, SelectItem, Skeleton
} from "@heroui/react";
import { getTokenPayload } from "@/utils/auth";
import { updateAdvisory, fetchAdvisoriesByAdvisor } from "@/services/advisoryService";

const daysOfWeek = ["lunes", "martes", "miércoles", "jueves", "viernes"];
const hoursOfDay = [
  { label: "8:00 AM", value: "8" },
  { label: "10:00 AM", value: "10" },
  { label: "2:00 PM", value: "14" },
  { label: "4:00 PM", value: "16" },
];

const dayToNumber = {
  domingo: 0, lunes: 1, martes: 2, miércoles: 3, jueves: 4, viernes: 5, sábado: 6,
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
  const [status, setStatus] = useState<"pending" | "approved" | "canceled">(advisory.status as any);
  const [role, setRole] = useState<string>("");
  const [availableHours, setAvailableHours] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = getTokenPayload();
    setRole(token?.role || "");
    setDay(advisory.day);
    const initialHour = new Date(advisory.dateStart).getHours().toString();
    setHour(initialHour);
    loadSlots(advisory.day, advisory._id, advisory.advisorId);
  }, [advisory]);

  const loadSlots = async (selectedDay: string, currentId: string, advisorId: string) => {
    setLoading(true);
    if (role === "academic_friend") {
      const advisories = await fetchAdvisoriesByAdvisor(advisorId);
      interface Advisory {
        _id: string;
        day: string;
        dateStart: string;
        status: "pending" | "approved" | "canceled";
        careerId: string;
        advisorId: string;
      }

      const taken: string[] = advisories
        .filter((a: Advisory) => a._id !== currentId && a.day === selectedDay)
        .map((a: Advisory) => new Date(a.dateStart).getHours().toString());

      const remaining = hoursOfDay.filter(h => !taken.includes(h.value));
      setAvailableHours(remaining);
      if (!remaining.find(h => h.value === hour)) {
        setHour(remaining[0]?.value || "");
      }
    } else {
      setAvailableHours(hoursOfDay);
    }
    setLoading(false);
  };

  const getNextDateForDay = (targetDay: keyof typeof dayToNumber, hour: string) => {
    const today = new Date();
    const target = dayToNumber[targetDay];
    let daysToAdd = (target - today.getDay() + 7) % 7;
    if (daysToAdd === 0 && today.getHours() >= parseInt(hour)) daysToAdd = 7;
    const result = new Date();
    result.setDate(today.getDate() + daysToAdd);
    result.setHours(parseInt(hour), 0, 0, 0);
    return result.toISOString();
  };

  const calculateEndDate = (start: string) => {
    const date = new Date(start);
    date.setHours(date.getHours() + 2);
    return date.toISOString();
  };

  const handleSave = async () => {
    if (!hour) return;
    const newDateStart = getNextDateForDay(day as any, hour);
    const dateEnd = calculateEndDate(newDateStart);

    await updateAdvisory(advisory._id, {
      day,
      dateStart: newDateStart,
      dateEnd,
      advisorId: advisory.advisorId,
      careerId: advisory.careerId,
      status: role === "admin" ? status : advisory.status as "pending" | "approved" | "canceled",
    });

    onSuccess();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader>Editar Asesoría</ModalHeader>
        <ModalBody>
          <Select label="Día" value={day} onChange={(e) => {
            setDay(e.target.value);
            loadSlots(e.target.value, advisory._id, advisory.advisorId);
          }}>
            {daysOfWeek.map((d) => (
              <SelectItem key={d} data-value={d}>
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </SelectItem>
            ))}
          </Select>

          {loading ? (
            <Skeleton className="rounded-lg h-10 w-full mt-4" />
          ) : availableHours.length > 0 ? (
            <Select label="Hora" value={hour} onChange={(e) => setHour(e.target.value)}>
              {availableHours.map(({ label, value }) => (
                <SelectItem key={value} data-value={value}>
                  {label}
                </SelectItem>
              ))}
            </Select>
          ) : (
            <div className="text-sm text-danger-500 mt-2">
              No hay horas disponibles para este día.
            </div>
          )}

          {role === "admin" && (
            <Select label="Estado" value={status} onChange={(e) => setStatus(e.target.value as any)}>
              <SelectItem key="approved" data-value="approved">Aprobada</SelectItem>
              <SelectItem key="pending" data-value="pending">Pendiente</SelectItem>
              <SelectItem key="canceled" data-value="canceled">Cancelada</SelectItem>
            </Select>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>Cancelar</Button>
          <Button color="primary" onPress={handleSave} isDisabled={!hour || availableHours.length === 0}>
            Guardar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditAdvisoryModal;
