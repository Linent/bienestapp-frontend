import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

import { Career } from "@/types";

interface ViewCareerModalProps {
  isOpen: boolean;
  onClose: () => void;
  career: Career | null;
}

const ViewCareerModal: React.FC<ViewCareerModalProps> = ({
  isOpen,
  onClose,
  career,
}) => {
  if (!career) return null;

  return (
    <Modal className="w-full max-w-lg" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Detalles de la Carrera</ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Nombre:</p>
              <p>{career.name}</p>
            </div>
            <div>
              <p className="font-semibold">código:</p>
              <p>{career.code}</p>
            </div>
            <div>
              <p className="font-semibold">Estado:</p>
              <p className={career.enable ? "text-green-500" : "text-red-500"}>
                {career.enable ? "Activo" : "Inactivo"}
              </p>
            </div>
          </div>
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

export default ViewCareerModal;
