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

interface AdvisoryEvent {
  id: string;
  advisorName: string;
  career: string;
  time: string;
  start: Date;
  status: string;
  dateStart: Date;
  fullDateString?: string;
}

interface AdvisoryListProps {
  advisories: AdvisoryEvent[];
}

const AdvisorList: React.FC<AdvisoryListProps> = ({ advisories }) => {
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
    const day = selectedAdvisory.start.toLocaleDateString("es-ES", { weekday: "long" }).toLowerCase();
    const dateStart = selectedAdvisory.dateStart.toISOString();

    router.push({
      pathname: "/schedules/StudentsByAdvisory",
      query: { advisoryId, day, dateStart },
    });
  };

  // if (selectedAdvisory && selectedAdvisory.fullDateString) {
  //   console.log("Full Date String:", selectedAdvisory.fullDateString);
  // }

  const isSameDay = selectedAdvisory && selectedAdvisory.fullDateString
    ? (() => {
        const advisoryDateString = selectedAdvisory.fullDateString.split(',')[1].trim(); // "6 de mayo de 2025"
        const [dayStr, , monthName, , yearStr] = advisoryDateString.split(" "); // "6", "de", "mayo", "de", "2025"
        
        const day = parseInt(dayStr, 10);
        const month = getMonthFromName(monthName) - 1; // Mes indexado desde 0
        const year = parseInt(yearStr, 10);
        
        const advisoryDate = new Date(year, month, day);
        const currentDate = new Date();

        // console.log("Fecha actual:", currentDate.toLocaleDateString());
        // console.log("Fecha de la asesoría:", advisoryDate.toLocaleDateString());

        return currentDate.toLocaleDateString() === advisoryDate.toLocaleDateString();
      })()
    : false;

  // console.log("¿Son las mismas fechas?:", isSameDay);

  function getMonthFromName(monthName: string): number {
    const months = new Map<string, number>([
      ["enero", 1], ["febrero", 2], ["marzo", 3], ["abril", 4],
      ["mayo", 5], ["junio", 6], ["julio", 7], ["agosto", 8],
      ["septiembre", 9], ["octubre", 10], ["noviembre", 11], ["diciembre", 12],
    ]);
  
    return months.get(monthName.toLowerCase()) || 1;
  }

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
          <ModalFooter className="flex justify-between">
            <Button variant="light" onPress={closeModal}>Cerrar</Button>
            {isSameDay && (
              <Button variant="solid" color="primary" onPress={handleViewStudents}>
                Ver estudiantes
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AdvisorList;
