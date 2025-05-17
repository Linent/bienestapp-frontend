import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import {
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Card,
  CardBody,
} from "@heroui/react";
import DefaultLayout from "@/layouts/default";
import { title } from "@/components/primitives";
import { BackArrowIcon, EditIcon } from "@/components/icons/ActionIcons";
import CreateAdvisoryModal from "@/components/Advisory/CreateAdvisoryModal";
import EditAdvisoryModal from "@/components/Advisory/EditAdvisoryModal";
import {
  fetchAdvisoriesByAdvisor,
  fetchAdvisorById,
} from "@/services/advisoryService";
import { Advisory } from "@/types";

// Días y franjas horarias fijas
const DAYS = ["lunes", "martes", "miércoles", "jueves", "viernes"];
const TIME_SLOTS = ["08:00", "10:00", "14:00", "16:00"];
const MAX_HOURS = 20;

export default function AdvisoryCardsPage() {
  const router = useRouter();
  const { advisorId } = router.query;
  const [advisories, setAdvisories] = useState<Advisory[]>([]);
  const [advisorName, setAdvisorName] = useState("");
  const [careerName, setCareerName] = useState("");
  const [availableHours, setAvailableHours] = useState(0);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [editAdvisory, setEditAdvisory] = useState<Advisory | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    setUserRole(localStorage.getItem("role"));
  }, []);

  const loadAdvisories = useCallback(() => {
    if (typeof advisorId !== "string") return;
    fetchAdvisoriesByAdvisor(advisorId)
      .then((data) => {
        setAdvisories(data);
        setAvailableHours(data.length * 2);
      })
      .catch(console.error);
  }, [advisorId]);

  useEffect(() => {
    if (typeof advisorId !== "string") return;
    fetchAdvisorById(advisorId)
      .then(({ name, career }) => {
        setAdvisorName(name);
        setCareerName(career);
      })
      .catch(console.error);
  }, [advisorId]);

  useEffect(() => {
    loadAdvisories();
  }, [loadAdvisories]);

  const advisoryMap = useMemo(() => {
    const map: Record<string, Record<string, Advisory[]>> = {};
    DAYS.forEach((day) => {
      map[day] = {};
      TIME_SLOTS.forEach((slot) => {
        map[day][slot] = [];
      });
    });
    advisories.forEach((adv) => {
      const dayKey = adv.day.toLowerCase();
      const hour = new Date(adv.dateStart).toLocaleTimeString("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      if (map[dayKey] && map[dayKey][hour]) {
        map[dayKey][hour].push(adv);
      }
    });
    return map;
  }, [advisories]);

  return (
    <DefaultLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className={title()}>Horario del Asesor</h1>
        <Divider className="my-4" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Asesor: {advisorName}</h2>
            <p className="text-gray-600">Carrera: {careerName}</p>
          </div>
          {availableHours < MAX_HOURS && (
            <Button color="primary" onPress={() => setCreateModalOpen(true)}>
              Agregar Asesoría
            </Button>
          )}
        </div>

        <Button
          color="primary"
          onPress={() => router.back()}
          className="mb-6"
        >
          <BackArrowIcon /> Volver
        </Button>

        <div className="overflow-x-auto">
          <Table className="w-full border-collapse text-center">
            <TableHeader>
              {DAYS.map((day) => (
                <TableColumn
                  key={day}
                  className="border px-4 py-2 capitalize bg-gray-50"
                >
                  {day}
                </TableColumn>
              ))}
            </TableHeader>
            <TableBody>
              {TIME_SLOTS.map((slot) => (
                <TableRow key={slot}>
                  {DAYS.map((day) => (
                    <TableCell
                      key={`${day}-${slot}`}
                      className="border px-2 py-4 align-top"
                    >
                      {advisoryMap[day][slot].length > 0 ? (
                        advisoryMap[day][slot].map((adv) => {
                          const isAcademic = userRole === "academic_friend";
                          const isApproved = adv.status === "approved";
                          const showEditButton = !(isAcademic && isApproved);

                          // Elegimos el color de HeroUI
                          const cardColor: "success" | "warning" | "danger" =
                            adv.status === "approved"
                              ? "success"
                              : adv.status === "canceled"
                              ? "danger"
                              : "warning";

                          return (
                            <Card
                              key={adv._id}
                              className={`mb-2 min-h-[60px] ${
                                cardColor === "success"
                                  ? "bg-green-100 border-green-400"
                                  : cardColor === "danger"
                                  ? "bg-red-100 border-red-400"
                                  : "bg-yellow-100 border-yellow-400"
                              }`}
                            >
                              <CardBody className="p-2">
                                <div className="font-semibold text-sm">
                                  {new Date(adv.dateStart).toLocaleTimeString(
                                    "es-CO",
                                    { hour: "2-digit", minute: "2-digit" }
                                  )}
                                  {" – "}
                                  {new Date(adv.dateEnd).toLocaleTimeString(
                                    "es-CO",
                                    { hour: "2-digit", minute: "2-digit" }
                                  )}
                                </div>
                                {showEditButton && (
                                  <Button
                                    size="sm"
                                    variant="light"
                                    className="mt-1"
                                    onPress={() => setEditAdvisory(adv)}
                                  >
                                    <EditIcon/> Editar
                                  </Button>
                                )}
                              </CardBody>
                            </Card>
                          );
                        })
                      ) : (
                        <span className="text-gray-400">–</span>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Modales */}
        {isCreateModalOpen && (
          <CreateAdvisoryModal
            isOpen={isCreateModalOpen}
            onClose={() => setCreateModalOpen(false)}
            advisorId={advisorId as string}
            careerId={careerName}
            onSuccess={() => {
              loadAdvisories();
              setCreateModalOpen(false);
            }}
          />
        )}

        {editAdvisory && (
          <EditAdvisoryModal
            isOpen={!!editAdvisory}
            onClose={() => setEditAdvisory(null)}
            advisory={{
              ...editAdvisory,
              careerId:
                typeof editAdvisory.careerId === "string"
                  ? editAdvisory.careerId
                  : editAdvisory.careerId._id,
              advisorId:
                typeof editAdvisory.advisorId === "string"
                  ? editAdvisory.advisorId
                  : editAdvisory.advisorId._id,
            }}
            onSuccess={() => {
              loadAdvisories();
              setEditAdvisory(null);
            }}
          />
        )}
      </div>
    </DefaultLayout>
  );
}
