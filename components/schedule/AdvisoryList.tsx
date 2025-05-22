import { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { useRouter } from "next/router";
import { AdvisoryEvent } from "@/types/types";
import { X } from "lucide-react"; 
import advisoryStatusLabels from "@/utils/advisoryStatusLabels";


interface AdvisoryListProps {
  advisories: AdvisoryEvent[];
  userRole: string;
  onClose?: () => void;
}

const AdvisoryList: React.FC<AdvisoryListProps> = ({ advisories, userRole, onClose }) => {
  const [selectedAdvisory, setSelectedAdvisory] = useState<AdvisoryEvent | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (advisories.length === 1) {
      setSelectedAdvisory(advisories[0]);
      setIsOpen(true);
    }
  }, [advisories]);

  const handleClose = () => {
    setIsOpen(false);
    setSelectedAdvisory(null);
    if (onClose) onClose();
  };

  const openModal = (advisory: AdvisoryEvent) => {
    setSelectedAdvisory(advisory);
    setIsOpen(true);
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

  if (advisories.length > 1) {
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
                  <p><strong>Estado:</strong> {advisoryStatusLabels[selectedAdvisory.status] || selectedAdvisory.status}</p>

                </>
              )}
            </ModalBody>
            <ModalFooter className="flex justify-between">
              <Button
  variant="light"
  className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 font-medium text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors shadow-sm"
  onPress={handleClose}
>
  <X className="w-4 h-4 mr-1" /> Cerrar
</Button>
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
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
      <ModalContent>
        <ModalHeader>Detalles de la Asesoría</ModalHeader>
        <ModalBody>
          {selectedAdvisory && (
            <>
              <p><strong>Asesor:</strong> {selectedAdvisory.advisorName}</p>
              <p><strong>Carrera:</strong> {selectedAdvisory.career}</p>
              <p><strong>Hora:</strong> {selectedAdvisory.time}</p>
              <p><strong>Estado:</strong> {advisoryStatusLabels[selectedAdvisory.status] || selectedAdvisory.status}</p>
            </>
          )}
        </ModalBody>
        <ModalFooter className="flex justify-between">
  {/* Opción A: Light, bordeado y con hover */}
  <Button
    variant="light"
    className="
      border border-gray-300 
      rounded-lg 
      px-4 py-2 
      font-medium 
      text-gray-700
      hover:bg-gray-100 
      hover:text-danger
      transition-colors
      shadow-sm
    "
    onPress={handleClose}
  >
    Cerrar
  </Button>


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
  );
};

export default AdvisoryList;
