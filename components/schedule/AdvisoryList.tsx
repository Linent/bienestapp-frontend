import { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Badge,
  Spinner,
  Chip,
} from "@heroui/react";
import { useRouter } from "next/router";
import { AdvisoryEvent } from "@/types/types";
import { X, Calendar, User2, Users } from "lucide-react";
import advisoryStatusLabels from "@/utils/advisoryStatusLabels";
import { fetchScheduleCountByAdvisory } from "@/services/scheduleService";

interface AdvisoryListProps {
  advisories: AdvisoryEvent[];
  userRole: string;
  onClose?: () => void;
}

const statusColors: Record<string, string> = {
  approved: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  completed: "bg-blue-100 text-blue-700",
  canceled: "bg-red-100 text-red-700",
};

const AdvisoryList: React.FC<AdvisoryListProps> = ({
  advisories,
  userRole,
  onClose,
}) => {
  const [selectedAdvisory, setSelectedAdvisory] =
    useState<AdvisoryEvent | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Estados para el conteo de estudiantes agendados
  const [scheduleCount, setScheduleCount] = useState<number | null>(null);
  const [loadingCount, setLoadingCount] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (advisories.length === 1) {
      setSelectedAdvisory(advisories[0]);
      setIsOpen(true);
    }
  }, [advisories]);

  // Cargar el conteo cada vez que cambia la asesoría seleccionada
  useEffect(() => {
    if (!selectedAdvisory) return;
    const advisoryId = selectedAdvisory.id.split("-")[0];
    const dateStart = selectedAdvisory.dateStart.toISOString();

    setLoadingCount(true);
    fetchScheduleCountByAdvisory(advisoryId, dateStart)
      .then((count) => setScheduleCount(count))
      .catch(() => setScheduleCount(null))
      .finally(() => setLoadingCount(false));
  }, [selectedAdvisory]);

  const handleClose = () => {
    setIsOpen(false);
    setSelectedAdvisory(null);
    setScheduleCount(null);
    if (onClose) onClose();
  };

  const openModal = (advisory: AdvisoryEvent) => {
    setSelectedAdvisory(advisory);
    setIsOpen(true);
  };

  const handleViewStudents = () => {
    if (!selectedAdvisory) return;

    const advisoryId = selectedAdvisory.id.split("-")[0];
    const day = selectedAdvisory.start
      .toLocaleDateString("es-ES", {
        weekday: "long",
      })
      .toLowerCase();
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

  // Card para cada asesoría (vista previa)
  if (advisories.length > 1) {
    return (
      <div className="grid md:grid-cols-2 gap-4">
        {advisories.map((advisory) => (
          <div
            key={advisory.id}
            className="p-4 bg-white border rounded-2xl shadow hover:shadow-lg transition-shadow duration-150 flex flex-col gap-2"
          >
            <div className="flex items-center gap-2">
              <User2 className="w-6 h-6 text-primary" />
              <span className="text-lg font-semibold">
                {advisory.advisorName}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-5 h-5" /> {advisory.time}
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <span className="text-xs">{advisory.career}</span>
            </div>
            <Button variant="bordered" onPress={() => openModal(advisory)}>
              Ver detalles
            </Button>
          </div>
        ))}

        <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
          <ModalContent>
            <ModalHeader>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Detalles de la Asesoría
              </div>
            </ModalHeader>
            <ModalBody>
              {selectedAdvisory && (
                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <User2 className="w-5 h-5 text-secondary" />
                    <span className="font-medium">Asesor:</span>
                    <span>{selectedAdvisory.advisorName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Carrera:</span>
                    <span>{selectedAdvisory.career}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-secondary" />
                    <span className="font-medium">Hora:</span>
                    <span>{selectedAdvisory.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Estado:</span>
                    <Badge
                      className={`text-xs px-2 py-1 rounded ${statusColors[selectedAdvisory.status] || "bg-gray-100 text-gray-700"}`}
                    >
                      {advisoryStatusLabels[selectedAdvisory.status] ||
                        selectedAdvisory.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Agendados:</span>
                    {loadingCount ? (
                      <Spinner size="sm" color="primary" />
                    ) : (
                      <Badge className="bg-primary text-white px-2 py-1 rounded">
                        {scheduleCount !== null
                          ? `${scheduleCount} estudiante(s)`
                          : "-"}
                      </Badge>
                    )}
                  </div>
                </div>
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

  // Modal para un solo evento
  return (
    <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
      <ModalContent>
        <ModalHeader>
          <div className="flex items-center gap-2">Detalles de la Asesoría</div>
        </ModalHeader>
        <ModalBody>
          {selectedAdvisory && (
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <User2 className="w-5 h-5 text-secondary" />
                <span className="font-medium">Asesor:</span>
                <span>{selectedAdvisory.advisorName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Carrera:</span>
                <span>{selectedAdvisory.career}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-secondary" />
                <span className="font-medium">Hora:</span>
                <span>{selectedAdvisory.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Estado:</span>
                <Badge
                  className={`text-xs px-2 rounded ${statusColors[selectedAdvisory.status] || "bg-gray-100 text-gray-700"}`}
                >
                  {advisoryStatusLabels[selectedAdvisory.status] ||
                    selectedAdvisory.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="font-medium">Agendados: </span>
                {loadingCount ? (
                  <Spinner size="sm" color="primary" />
                ) : (
                  <Chip
                    color={
                      scheduleCount === 0
                        ? "danger"
                        : scheduleCount && scheduleCount > 0
                          ? "success"
                          : "default"
                    }
                    variant="flat"
                  >
                    {scheduleCount !== null
                      ? `${scheduleCount} estudiante(s)`
                      : "-"}
                  </Chip>
                )}
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter className="flex justify-between">
          <Button
            color="danger"
            variant="light"
            className="flex items-center gap-2 rounded-lg px-4 py-2 font-medium hover:bg-gray-100 hover:text-danger transition-colors shadow-sm"
            onPress={handleClose}
          >
            Cerrar
          </Button>
          <Button variant="solid" color="primary" onPress={handleViewStudents}>
            Ver estudiantes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AdvisoryList;
