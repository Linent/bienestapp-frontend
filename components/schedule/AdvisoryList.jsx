import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";

const AdvisoryList = ({ advisories }) => {
  const [selectedAdvisory, setSelectedAdvisory] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = (advisory) => {
    setSelectedAdvisory(advisory);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedAdvisory(null);
  };

  return (
    <div>
      {advisories.map((advisory) => (
        <div key={advisory.id} className="p-4 border rounded-md shadow-md mb-2">
          <p className="text-lg font-semibold">{advisory.advisorName}</p>
          <Button variant="bordered" onPress={() => openModal(advisory)}>
            Ver detalles
          </Button>
        </div>
      ))}

      {/* Modal de detalles */}
      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
        <ModalContent>
          <ModalHeader>Detalles de la Asesoría</ModalHeader>
          <ModalBody>
            {selectedAdvisory && (
              <>
                <p><strong>Asesor:</strong> {selectedAdvisory.advisorName}</p>
                <p><strong>Carrera:</strong> {selectedAdvisory.career}</p>
                <p><strong>Hora:</strong> {selectedAdvisory.time}</p>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="primary" onPress={closeModal}>Cerrar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AdvisoryList;
