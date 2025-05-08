import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Card, CardBody, Divider } from "@heroui/react";
import { fetchAdvisoriesByAdvisor } from "@/services/advisoryService";
import { Advisory } from "@/types";
import CreateAdvisoryModal from "@/components/Advisory/CreateAdvisoryModal";
import DefaultLayout from "@/layouts/default";
import EditAdvisoryModal from "@/components/Advisory/EditAdvisoryModal";
import { title } from "@/components/primitives";

const MAX_HOURS = 20;
const DAYS = ["lunes", "martes", "miércoles", "jueves", "viernes"];
const TIME_SLOTS = ["08:00", "10:00", "14:00", "16:00"];

const AdvisoryCardsPage = () => {
  const router = useRouter();
  const { advisorId } = router.query;

  const [advisories, setAdvisories] = useState<Advisory[]>([]);
  const [advisorName, setAdvisorName] = useState("");
  const [careerName, setCareerName] = useState("");
  const [availableHours, setAvailableHours] = useState<number>(0);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [selectedAdvisory, setSelectedAdvisory] = useState<Advisory | null>(null);

  const loadAdvisories = async () => {
    if (!advisorId) return;
    try {
      const data = await fetchAdvisoriesByAdvisor(advisorId as string);
      setAdvisories(data);

      if (data.length > 0) {
        setAdvisorName(data[0].advisorId.name);
        setCareerName(data[0].careerId.name);
        const total = data.reduce((acc: number) => acc + 2, 0);
        setAvailableHours(total);
      }
    } catch (error) {
      console.error("Error cargando asesorías:", error);
    }
  };

  useEffect(() => {
    loadAdvisories();
  }, [advisorId]);

  const statusLabels: Record<"approved" | "canceled" | "pending", string> = {
    approved: "Aprobada",
    canceled: "Cancelada",
    pending: "Pendiente",
  };

  const statusBadgeStyles: Record<"approved" | "canceled" | "pending", string> = {
    approved: "bg-green-900 text-green-400",
    canceled: "bg-red-900 text-red-400",
    pending: "bg-yellow-900 text-yellow-400",
  };

  const handleEdit = (advisory: Advisory) => {
    setSelectedAdvisory(advisory);
  };

  const handleUpdateSuccess = async () => {
    await loadAdvisories();
    setSelectedAdvisory(null);
  };

  const formatTimeRange = (start: Date, end: Date) => {
    const format = (date: Date) =>
      new Date(date).toLocaleTimeString("es-CO", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    return `${format(start)} - ${format(end)}`;
  };

  const getAdvisoryMap = () => {
    const map: Record<string, Record<string, Advisory[]>> = {};
    DAYS.forEach((day) => {
      map[day] = {};
      TIME_SLOTS.forEach((slot) => {
        map[day][slot] = [];
      });
    });

    advisories.forEach((advisory) => {
      const day = advisory.day.toLowerCase();
      const hour = new Date(advisory.dateStart).getHours();
      const slot = TIME_SLOTS.find((s) => parseInt(s) === hour);
      if (slot && map[day]) {
        map[day][slot].push(advisory);
      }
    });

    return map;
  };

  const advisoryMap = getAdvisoryMap();

  return (
    <DefaultLayout>
      <div className="p-6 max-w-6xl mx-auto">
          <h1 className={title()}>Horario del Asesor</h1>
          <Divider className="my-4" />
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Asesor: {advisorName}</h2>
            <p className="mb-2 text-gray-600">Carrera: {careerName}</p>
          </div>
          {availableHours < MAX_HOURS && (
            <Button color="primary" onPress={() => setCreateModalOpen(true)}>
              Agregar Asesoría
            </Button>
          )}
        </div>

        <Button color="primary" onPress={() => router.back()} className="mb-6">
          ⬅️ Volver
        </Button>

        <div className="overflow-x-auto mb-6">
          <table className="w-full border text-center">
            <thead>
              <tr>
                {DAYS.map((day) => (
                  <th key={day} className="border px-4 py-2 capitalize">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map((slot) => (
                <tr key={slot}>
                  {DAYS.map((day) => {
                    const slotAdvisories = advisoryMap[day][slot];
                    return (
                      <td key={day + slot} className="border px-2 py-2">
                        {slotAdvisories.length > 0 ? (
                          slotAdvisories.map((advisory) => {
                            const status = advisory.status as "approved" | "canceled" | "pending";
                            return (
                              <Card
                                key={advisory._id}
                                className={`mb-2 p-2 rounded border ${
                                  advisory.status === "approved"
                                    ? "bg-success-100 border-success-200"
                                    : advisory.status === "pending"
                                    ? "bg-warning-100 border-warning-200"
                                    : "bg-danger-100 border-danger-200"
                                }`}
                              >
                                <CardBody>
                                  <div className="font-semibold">
                                    {formatTimeRange(
                                      new Date(advisory.dateStart),
                                      new Date(advisory.dateEnd)
                                    )}
                                  </div>
                                  <span
                                    className={`text-sm px-3 py-1 rounded-full inline-block mt-1 mb-2 ${statusBadgeStyles[status]}`}
                                  >
                                    {statusLabels[status]}
                                  </span>
                                  <Button className="bg-blue-300"
                                    size="sm"
                                    variant="light"
                                    onClick={() => handleEdit(advisory)}
                                  >
                                    ✏️ Editar
                                  </Button>
                                </CardBody>
                              </Card>
                            );
                          })
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal para crear asesoría */}
        <CreateAdvisoryModal
          isOpen={isCreateModalOpen}
          onClose={() => setCreateModalOpen(false)}
          advisorId={advisorId as string}
          careerId={
            typeof advisories[0]?.careerId === "object"
              ? advisories[0]?.careerId._id
              : (advisories[0]?.careerId ?? "")
          }
          onSuccess={loadAdvisories}
        />

        {/* Modal para editar asesoría */}
        {selectedAdvisory && (
          <EditAdvisoryModal
            isOpen={!!selectedAdvisory}
            onClose={() => setSelectedAdvisory(null)}
            advisory={{
              ...selectedAdvisory,
              careerId:
                typeof selectedAdvisory?.careerId === "object"
                  ? selectedAdvisory.careerId._id
                  : selectedAdvisory?.careerId,
              advisorId:
                typeof selectedAdvisory?.advisorId === "object"
                  ? selectedAdvisory.advisorId._id
                  : selectedAdvisory?.advisorId,
            }}
            onSuccess={handleUpdateSuccess}
          />
        )}
      </div>
    </DefaultLayout>
  );
};

export default AdvisoryCardsPage;
