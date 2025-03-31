import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";

interface Career {
  name: string;
  description: string;
  enable: boolean;
}

interface ViewCareerModalProps {
  isOpen: boolean;
  onClose: () => void;
  career: Career | null;
}

const ViewCareerModal: React.FC<ViewCareerModalProps> = ({ isOpen, onClose, career }) => {
  if (!career) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-lg">
      <ModalContent>
        <ModalHeader>Detalles de la Carrera</ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Nombre:</p>
              <p>{career.name}</p>
            </div>
            <div>
              <p className="font-semibold">Descripción:</p>
              <p>{career.description}</p>
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
          <Button onPress={onClose} color="primary">Cerrar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ViewCareerModal;
