import { useEffect, useState } from "react";
import {
  Modal, ModalContent, ModalHeader, ModalBody,
  ModalFooter, Button, Select, SelectItem, Skeleton
} from "@heroui/react";
import { createAdvisory, fetchAdvisoriesByAdvisor } from "@/services/advisoryService";
import { getTokenPayload } from "@/utils/auth";

const daysOfWeek = ["lunes", "martes", "miércoles", "jueves", "viernes"];
const hoursOfDay = [
  { label: "8:00 AM", value: "8" },
  { label: "10:00 AM", value: "10" },
  { label: "2:00 PM", value: "14" },
  { label: "4:00 PM", value: "16" },
];

const dayToNumber = {
  domingo: 0, lunes: 1, martes: 2, miércoles: 3,
  jueves: 4, viernes: 5, sábado: 6
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  advisorId: string;
  careerId: string;
  onSuccess: () => void;
}

const CreateAdvisoryModal = ({ isOpen, onClose, advisorId, careerId, onSuccess }: Props) => {
  const [day, setDay] = useState("lunes");
  const [hour, setHour] = useState("8");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState<"approved" | "pending">("approved");
  const [availableHours, setAvailableHours] = useState<typeof hoursOfDay>([]);
  const [loading, setLoading] = useState(true);

  const loadAvailability = async (selectedDay: string) => {
    setLoading(true);
    const token = getTokenPayload();
    const currentRole = token?.role || "";
    setRole(currentRole);

    const advisories = await fetchAdvisoriesByAdvisor(advisorId);
    interface Advisory {
      day: string;
      dateStart: string;
    }

    const takenHours: string[] = advisories
      .filter((a: Advisory) => a.day === selectedDay)
      .map((a: Advisory) => new Date(a.dateStart).getHours().toString());

    const remaining = hoursOfDay.filter(h => !takenHours.includes(h.value));
    setAvailableHours(remaining);
    setHour(remaining[0]?.value || "");
    setStatus(currentRole === "admin" ? "approved" : "pending");
    setLoading(false);
  };

  useEffect(() => {
    loadAvailability(day);
  }, [advisorId, day]);

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
    const dateStart = getNextDateForDay(day as any, hour);
    const dateEnd = calculateEndDate(dateStart);
    await createAdvisory({ day, dateStart, dateEnd, advisorId, careerId, status });
    onSuccess();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader>Crear nueva Asesoría</ModalHeader>
        <ModalBody>
          <Select label="Día" value={day} onChange={(e) => setDay(e.target.value)}>
            {daysOfWeek.map((d) => (
              <SelectItem key={d} data-value={d}>
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </SelectItem>
            ))}
          </Select>

          {loading ? (
            <Skeleton className="rounded-lg h-10 w-full mt-4" />
          ) : availableHours.length > 0 ? (
            <Select label="Hora (Colombia)" value={hour} onChange={(e) => setHour(e.target.value)}>
              {availableHours.map(({ label, value }) => (
                <SelectItem key={value} data-value={value}>
                  {label}
                </SelectItem>
              ))}
            </Select>
          ) : (
            <p className="text-sm text-danger-500 mt-2">No hay horas disponibles para este día.</p>
          )}

          {role === "admin" && (
            <Select label="Estado" value={status} onChange={(e) => setStatus(e.target.value as any)}>
              <SelectItem key="approved" data-value="approved">Aprobada</SelectItem>
              <SelectItem key="pending" data-value="pending">Pendiente</SelectItem>
            </Select>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>Cancelar</Button>
          <Button color="primary" onPress={handleSave} isDisabled={!hour}>Guardar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateAdvisoryModal;

