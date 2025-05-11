// components/schedule/ViewObservationModal.tsx
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Button,
  Textarea,
  Card,
  CardBody
} from "@heroui/react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  observation: string;
}

const ViewObservationModal: React.FC<Props> = ({
  isOpen,
  onClose,
  observation,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Observación</ModalHeader>
        <ModalBody>
          <p>{observation}</p>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onPress={onClose}>
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ViewObservationModal;
