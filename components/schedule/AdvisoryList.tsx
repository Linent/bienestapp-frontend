// ✅ FRONTEND - AdvisoryList.tsx
import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { useRouter } from "next/router";
import { AdvisoryEvent } from "@/types/types"; // Asegúrate de que la ruta sea correcta


interface AdvisoryListProps {
  advisories: AdvisoryEvent[];
  userRole: string;
}

const AdvisoryList: React.FC<AdvisoryListProps> = ({ advisories }) => {
  const [selectedAdvisory, setSelectedAdvisory] = useState<AdvisoryEvent | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const openModal = (advisory: AdvisoryEvent) => {
    setSelectedAdvisory(advisory);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedAdvisory(null);
  };

  const handleViewStudents = () => {
    if (!selectedAdvisory) return;

    const advisoryId = selectedAdvisory.id.split("-")[0];
    const day = selectedAdvisory.start.toLocaleDateString("es-ES", {
      weekday: "long",
    }).toLowerCase();
    const dateStart = selectedAdvisory.dateStart.toISOString();

    router.push({
      pathname: "/schedules/StudentsByAdvisory",
      query: {
        advisoryId,
        day,
        dateStart,
      },
    });
  };

  return (
    <div>
      {advisories.map((advisory) => (
        <div
          key={advisory.id}
          className="p-4 border rounded-md shadow-md mb-2"
        >
          <p className="text-lg font-semibold">{advisory.advisorName}</p>
          <Button variant="bordered" onPress={() => openModal(advisory)}>
            Ver detalles
          </Button>
        </div>
      ))}

      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
        <ModalContent>
          <ModalHeader>Detalles de la Asesoría</ModalHeader>
          <ModalBody>
            {selectedAdvisory && (
              <>
                <p><strong>Asesor:</strong> {selectedAdvisory.advisorName}</p>
                <p><strong>Carrera:</strong> {selectedAdvisory.career}</p>
                <p><strong>Hora:</strong> {selectedAdvisory.time}</p>
                <p><strong>Estado:</strong> {selectedAdvisory.status}</p>
              </>
            )}
          </ModalBody>
          <ModalFooter className="flex justify-between">
            <Button variant="light" onPress={closeModal}>Cerrar</Button>
            <Button
              variant="solid"
              color="primary"
              onPress={handleViewStudents}
            >
              Ver estudiantes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AdvisoryList;
