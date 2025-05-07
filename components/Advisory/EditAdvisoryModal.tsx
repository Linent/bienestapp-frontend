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
  Input,
} from "@heroui/react";
import { updateAdvisory } from "@/services/advisoryService";

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
  const [dateStart, setDateStart] = useState(advisory.dateStart);
  const [status, setStatus] = useState(advisory.status);

  useEffect(() => {
    setDay(advisory.day);
    setDateStart(advisory.dateStart);
    setStatus(advisory.status);
  }, [advisory]);

  const calculateEndDate = (start: string) => {
    const startDate = new Date(start);
    startDate.setHours(startDate.getHours() + 2);
    return startDate.toISOString();
  };

  const handleSave = async () => {
    try {
      const dateEnd = calculateEndDate(dateStart);
      await updateAdvisory(advisory._id, { 
        day, 
        dateStart, 
        dateEnd, 
        advisorId: advisory.advisorId, 
        careerId: advisory.careerId 
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
          <Input
            label="Día"
            value={day}
            onChange={(e) => setDay(e.target.value)}
          />
          <Input
            type="datetime-local"
            label="Inicio"
            value={dateStart.slice(0, 16)}
            onChange={(e) => setDateStart(e.target.value)}
          />
          <Select label="Estado" value={status} onChange={(e) => setStatus(e.target.value)} isDisabled>
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
