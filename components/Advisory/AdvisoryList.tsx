import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
  Input,
  Select,
  SelectItem,
  Button,
  useDisclosure,
} from "@heroui/react";
import { fetchUsers } from "@/services/userService";
import { fetchCareers } from "@/services/careerService";
import { createAdvisory } from "@/services/advisoryService";
import { User, Career, AdvisoryData } from "@/types";
import { PlusIcon } from "@/components/icons/ActionIcons";
import AddUserModal from "@/components/AddUserModal";

const MAX_HOURS = 20;

const AdvisoryList = () => {
  const [advisors, setAdvisors] = useState<User[]>([]);
  const [careers, setCareers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterCareer, setFilterCareer] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const loadData = async () => {
      try {
        const users = await fetchUsers();
        const careersData = await fetchCareers();
        const careerMap = careersData.reduce((acc: Record<string, string>, career: Career) => {
          acc[career._id] = career.name;
          return acc;
        }, {});
        setCareers(careerMap);
        setAdvisors(users.filter((user: User) => user.role === "academic_friend"));
      } catch (error) {
        console.error("Error cargando los datos:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleCreateAdvisory = async (advisorId: string) => {
    const advisor = advisors.find((a) => a._id === advisorId);
    if (!advisor || advisor.availableHours >= MAX_HOURS) {
      alert("Este asesor ya ha alcanzado el máximo de 20 horas.");
      return;
    }

    try {
      const dateStart = new Date().toISOString(); // Example: current date as start
      const dateEnd = new Date(new Date().setHours(new Date().getHours() + 1)).toISOString(); // Example: 1 hour later as end

      await createAdvisory({
        advisorId,
        careerId: advisor.career,
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
    const matchSearch = advisor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus ? (advisor.enable ? "Activo" : "Inactivo") === filterStatus : true;
    const matchCareer = filterCareer ? advisor.career === filterCareer : true;
    return matchSearch && matchStatus && matchCareer;
  });

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center gap-4 mb-4">
        <Input
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
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
        <Button color="primary" startContent={<PlusIcon />} onPress={onOpen}>
          Agregar
        </Button>
      </div>
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
              <TableCell>{careers[advisor.career] || "Desconocida"}</TableCell>
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
                  size="sm"
                  onClick={() => handleCreateAdvisory(advisor._id)}
                  isDisabled={advisor.availableHours >= MAX_HOURS}
                >
                  Crear Asesoría
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AddUserModal isOpen={isOpen} onClose={onClose} />
    </div>
  );
};

export default AdvisoryList;

