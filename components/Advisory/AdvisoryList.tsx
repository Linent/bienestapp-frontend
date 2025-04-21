import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Input,
  Select,
  SelectItem,
  Button,
  useDisclosure,
} from "@heroui/react";

import { fetchUsers } from "@/services/userService";
import { fetchCareers } from "@/services/careerService";
import { createAdvisory } from "@/services/advisoryService";
import { User, Career } from "@/types";
import { PlusIcon } from "@/components/icons/ActionIcons";
import AddUserModal from "@/components/AddUserModal";

const MAX_HOURS = 20;

const AdvisoryList = () => {
  const [advisors, setAdvisors] = useState<User[]>([]);
  const [careers, setCareers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterCareer, setFilterCareer] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const loadData = async () => {
      try {
        const users = await fetchUsers();
        const careersData = await fetchCareers();

        // Mapeo de ID de carrera a nombre
        const careerMap = careersData.reduce(
          (acc: Record<string, string>, career: Career) => {
            acc[career._id] = career.name;

            return acc;
          },
          {},
        );

        setCareers(careerMap);
        setAdvisors(
          users.filter((user: User) => user.role === "academic_friend"),
        );
      } catch (err) {
        console.error("Error cargando los datos:", err);
        setError("No se pudieron cargar los datos.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCreateAdvisory = async (advisorId: string) => {
    const advisor = advisors.find((a) => a._id === advisorId);

    if (!advisor || (advisor.availableHours ?? 0) >= MAX_HOURS) {
      alert("Este asesor ya ha alcanzado el máximo de 20 horas.");

      return;
    }

    try {
      const dateStart = new Date().toISOString();
      const dateEnd = new Date(
        new Date().setHours(new Date().getHours() + 1),
      ).toISOString();

      await createAdvisory({
        advisorId,
        careerId:
          typeof advisor.career === "string"
            ? advisor.career
            : advisor.career?._id || "",
        status: "pending",
        recurring: true,
        dateStart,
        dateEnd,
      });

      alert("Asesoría creada exitosamente.");
    } catch (error) {
      console.error("Error al crear la asesoría:", error);
      alert("Hubo un error al crear la asesoría.");
    }
  };

  const filteredAdvisors = advisors.filter((advisor) => {
    const matchSearch = advisor.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus
      ? (advisor.enable ? "Activo" : "Inactivo") === filterStatus
      : true;
    const matchCareer = filterCareer
      ? (typeof advisor.career === "string"
          ? advisor.career
          : advisor.career?._id) === filterCareer
      : true;

    return matchSearch && matchStatus && matchCareer;
  });

  const getCareerName = (
    career: string | { _id: string } | null | undefined,
  ) => {
    if (!career) return "Desconocida";
    if (typeof career === "string") return careers[career] || "Desconocida";

    return careers[career._id] || "Desconocida";
  };

  if (loading) return <p>Cargando datos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-4 mb-4">
        <Input
          className="flex-1 min-w-[180px]"
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          className="flex-1 min-w-[180px]"
          label="Filtrar por estado"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <SelectItem key="" data-value="">
            Todos
          </SelectItem>
          <SelectItem key="Activo" data-value="Activo">
            Activo
          </SelectItem>
          <SelectItem key="Inactivo" data-value="Inactivo">
            Inactivo
          </SelectItem>
        </Select>
        <Select
          className="flex-1 min-w-[180px]"
          label="Filtrar por carrera"
          value={filterCareer}
          onChange={(e) => setFilterCareer(e.target.value)}
        >
          <SelectItem key="" data-value="">
            Todas
          </SelectItem>
          <>
            {Object.entries(careers).map(([id, name]) => (
              <SelectItem key={id} data-value={id}>
                {name}
              </SelectItem>
            ))}
          </>
        </Select>
        <Button
          className="min-w-[120px]"
          color="primary"
          startContent={<PlusIcon />}
          onPress={onOpen}
        >
          Agregar
        </Button>
      </div>
      <div className="w-full overflow-x-auto px-2 sm:rounded-lg">
        <Table isStriped aria-label="Lista de Asesores">
          <TableHeader>
            <TableColumn>#</TableColumn>
            <TableColumn>Nombre</TableColumn>
            <TableColumn>Código</TableColumn>
            <TableColumn>Correo</TableColumn>
            <TableColumn>Carrera</TableColumn>
            <TableColumn>Estado</TableColumn>
            <TableColumn>Acciones</TableColumn>
          </TableHeader>
          <TableBody>
            {filteredAdvisors.map((advisor, index) => (
              <TableRow key={advisor._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{advisor.name}</TableCell>
                <TableCell>{advisor.codigo}</TableCell>
                <TableCell>{advisor.email}</TableCell>
                <TableCell>{getCareerName(advisor.career)}</TableCell>
                <TableCell>
                  <Chip
                    color={advisor.enable ? "success" : "danger"}
                    size="sm"
                    variant="flat"
                  >
                    {advisor.enable ? "Activo" : "Inactivo"}
                  </Chip>
                </TableCell>
                <TableCell>
                  <Button
                    color="primary"
                    isDisabled={(advisor.availableHours ?? 0) >= MAX_HOURS}
                    size="sm"
                    onClick={() => handleCreateAdvisory(advisor._id)}
                  >
                    Crear Asesoría
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <AddUserModal isOpen={isOpen} onClose={onClose} />
    </div>
  );
};

export default AdvisoryList;
