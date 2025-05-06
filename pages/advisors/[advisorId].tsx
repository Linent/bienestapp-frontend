// pages/advisories/[advisorId].tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Chip,
} from "@heroui/react";
import { fetchAdvisoriesByAdvisor } from "@/services/advisoryService";
import { Advisory } from "@/types";
import CreateAdvisoryModal from "@/components/Advisory/CreateAdvisoryModal";
import DefaultLayout from "@/layouts/default";

const MAX_HOURS = 20;

const AdvisoryCardsPage = () => {
  const router = useRouter();
  const { advisorId } = router.query;

  const [advisories, setAdvisories] = useState<Advisory[]>([]);
  const [advisorName, setAdvisorName] = useState("");
  const [careerName, setCareerName] = useState("");
  const [availableHours, setAvailableHours] = useState<number>(0);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    if (!advisorId) return;

    const getAdvisories = async () => {
      try {
        const data = await fetchAdvisoriesByAdvisor(advisorId as string);
        setAdvisories(data);

        if (data.length > 0) {
          setAdvisorName(data[0].advisorId.name);
          setCareerName(data[0].careerId.name);
          const total = data.reduce(
            (acc: number, advisory: Advisory) => acc + 2,
            0
          ); // cada asesoría = 2h
          setAvailableHours(total);
        }
      } catch (error) {
        console.error("Error cargando asesorías:", error);
      }
    };

    getAdvisories();
  }, [advisorId]);

  return (
    <DefaultLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">Asesor: {advisorName}</h2>
        <p className="mb-6 text-gray-600">Carrera: {careerName}</p>
        <Button color="primary" onPress={() => router.back()} className="mb-6">
          ⬅️ Volver
        </Button>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {advisories.map((advisory) => (
            <Card key={advisory._id} className="shadow-md">
              <CardHeader>
                <h3 className="font-semibold text-lg capitalize">
                  {new Date(advisory.dateStart).toLocaleDateString("es-CO", {
                    weekday: "long",
                  })}
                </h3>
              </CardHeader>
              <CardBody>
                <p>
                  <strong>Inicio:</strong>{" "}
                  {new Date(advisory.dateStart).toLocaleTimeString("es-CO", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p>
                  <strong>Fin:</strong>{" "}
                  {new Date(advisory.dateEnd).toLocaleTimeString("es-CO", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </CardBody>
              <CardFooter className="justify-end">
                <Chip
                  color={advisory.status === "approved" ? "success" : "warning"}
                >
                  {advisory.status === "approved"
                    ? "Aprobada"
                    : advisory.status}
                </Chip>
              </CardFooter>
            </Card>
          ))}
        </div>

        {availableHours < MAX_HOURS && (
          <div className="mt-8 flex justify-center">
            <Button color="primary" onPress={() => setCreateModalOpen(true)}>
              Agregar Asesoría
            </Button>
          </div>
        )}

        <CreateAdvisoryModal
          isOpen={isCreateModalOpen}
          onClose={() => setCreateModalOpen(false)}
          advisorId={advisorId as string}
          careerId={
            typeof advisories[0]?.careerId === "object"
              ? advisories[0]?.careerId._id // <-- usa _id en lugar de name
              : (advisories[0]?.careerId ?? "")
          }
          onSuccess={() => router.reload()}
        />
      </div>
    </DefaultLayout>
  );
};

export default AdvisoryCardsPage;
