import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Button,
  Textarea,
} from "@heroui/react";
import { useState } from "react";
import { updateSchedule } from "@/services/scheduleService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  scheduleId: string;
  initialObservation: string;
  onUpdateSuccess: () => void;
}

const EditObservationModal: React.FC<Props> = ({
  isOpen,
  onClose,
  scheduleId,
  initialObservation,
  onUpdateSuccess,
}) => {
  const [observation, setObservation] = useState(initialObservation);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateSchedule(scheduleId, {
  observation, // ✅ nombre correcto del campo
});
      onUpdateSuccess();
      onClose();
    } catch (err) {
      console.error("Error al actualizar observación:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Editar Observación</ModalHeader>
        <ModalBody>
          <Textarea
            label="Observaciones del asesor"
            placeholder="Escribe aquí las observaciones..."
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Cancelar
          </Button>
          <Button color="primary" isLoading={loading} onPress={handleSave}>
            Guardar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditObservationModal;
