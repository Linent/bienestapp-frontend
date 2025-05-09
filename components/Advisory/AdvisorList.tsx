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
  Tooltip,
} from "@heroui/react";
import { useRouter } from "next/router";
import { fetchUsers, updateEnableUser, deleteUser } from "@/services/userService";
import { User } from "@/types";
import {
  EyeIcon,
  EditIcon,
  PlusIcon,
  DeleteIcon,
} from "@/components/icons/ActionIcons";
import AddUserModal from "@/components/user/AddUserModal";
import ViewUserModal from "@/components/user/ViewUserModal";
import EditUserModal from "@/components/user/EditUserModal";
import CreateAdvisoryModal from "@/components/Advisory/CreateAdvisoryModal";

const MAX_HOURS = 20;

const AdvisoryList = () => {
  const [advisors, setAdvisors] = useState<User[]>([]);
  const [careers, setCareers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterCareer, setFilterCareer] = useState<string>("");
  const [selectedAdvisor, setSelectedAdvisor] = useState<User | null>(null);
  const [selectedAdvisorId, setSelectedAdvisorId] = useState<string | null>(null);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [createTarget, setCreateTarget] = useState<{ advisorId: string; careerId: string }>({ advisorId: "", careerId: "" });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        const users = await fetchUsers();
        const academicFriends = users.filter((user: User) => user.role === "academic_friend");

        const uniqueCareerNames: string[] = Array.from(
          new Set(
            academicFriends.map((user: User) => user.career && typeof user.career === "object" && "name" in user.career ? user.career.name : null).filter(Boolean)
          )
        ) as string[];

        setCareers(uniqueCareerNames);
        setAdvisors(academicFriends);
      } catch (err) {
        console.error("Error cargando los datos:", err);
        setError("No se pudieron cargar los datos.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const openCreateModal = (advisor: User) => {
    const careerId = typeof advisor.career === "string" ? advisor.career : advisor.career?._id || "";
    setCreateTarget({ advisorId: advisor._id, careerId });
    setCreateModalOpen(true);
  };

  const handleToggleStatus = async (advisor: User) => {
    try {
      await updateEnableUser(advisor._id, !advisor.enable);
      alert(`Asesor ${!advisor.enable ? "habilitado" : "deshabilitado"} correctamente`);
      refreshAdvisors();
    } catch (error) {
      alert("No se pudo cambiar el estado del asesor.");
    }
  };

  const handleDelete = async (advisor: User) => {
    if (confirm("¿Estás seguro de que deseas eliminar este asesor?")) {
      try {
        await deleteUser(advisor._id);
        alert("Asesor eliminado correctamente");
        refreshAdvisors();
      } catch (error) {
        alert("No se pudo eliminar el asesor.");
      }
    }
  };

  const filteredAdvisors = advisors.filter((advisor) => {
    const matchSearch = advisor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus ? (advisor.enable ? "Activo" : "Inactivo") === filterStatus : true;
    const matchCareer = filterCareer
      ? advisor.career && typeof advisor.career === "object" && "name" in advisor.career
        ? advisor.career.name === filterCareer
        : false
      : true;
    return matchSearch && matchStatus && matchCareer;
  });

  const openViewModal = (user: User) => {
    setSelectedAdvisor(user);
    setViewModalOpen(true);
  };

  const openEditModal = (userId: string) => {
    setSelectedAdvisorId(userId);
    setEditModalOpen(true);
  };

  const refreshAdvisors = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();
      setAdvisors(data.filter((user: User) => user.role === "academic_friend"));
    } catch (err) {
      setError("No se pudo actualizar la lista de asesores.");
    } finally {
      setLoading(false);
    }
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
          <SelectItem key="">Todos</SelectItem>
          <SelectItem key="Activo">Activo</SelectItem>
          <SelectItem key="Inactivo">Inactivo</SelectItem>
        </Select>
        <Select
          className="flex-1 min-w-[180px]"
          label="Filtrar por carrera"
          value={filterCareer}
          onChange={(e) => setFilterCareer(e.target.value)}
        >
          <SelectItem key="">Todas</SelectItem>
          <>
            {careers.map((career) => (
              <SelectItem key={career} data-value={career}>{career}</SelectItem>
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
                <TableCell>
                  {advisor.career && typeof advisor.career === "object" && "name" in advisor.career
                    ? String(advisor.career.name)
                    : "Desconocida"}
                </TableCell>
                <TableCell>
                  <Chip color={advisor.enable ? "success" : "danger"} size="sm" variant="flat">
                    {advisor.enable ? "Activo" : "Inactivo"}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2 items-center">
                    <Tooltip content="Ver detalles">
                      <button className="text-default-400 hover:text-primary" onClick={() => openViewModal(advisor)}>
                        <EyeIcon />
                      </button>
                    </Tooltip>
                    <Tooltip content="Editar asesor">
                      <button className="text-default-400 hover:text-warning" onClick={() => openEditModal(advisor._id)}>
                        <EditIcon />
                      </button>
                    </Tooltip>
                    <Tooltip content={advisor.enable ? "Deshabilitar" : "Habilitar"}>
                      <button
                        className={`cursor-pointer ${advisor.enable ? "text-danger hover:text-red-600" : "text-success hover:text-green-600"}`}
                        onClick={() => handleToggleStatus(advisor)}
                      >
                        {advisor.enable ? "⛔" : "✔️"}
                      </button>
                    </Tooltip>
                    <Tooltip content="Eliminar asesor">
                      <button
                        className="cursor-pointer text-danger hover:text-red-600"
                        onClick={() => handleDelete(advisor)}
                      >
                        <DeleteIcon />
                      </button>
                    </Tooltip>
                    <Tooltip content="Crear asesoría">
                      <Button
                        isIconOnly
                        size="sm"
                        color="primary"
                        isDisabled={(advisor.availableHours ?? 0) >= MAX_HOURS}
                        onClick={() => openCreateModal(advisor)}
                      >
                        <PlusIcon />
                      </Button>
                    </Tooltip>
                    <Tooltip content="Ver asesorías">
                      <Button
                        isIconOnly
                        size="sm"
                        color="secondary"
                        onClick={() => router.push(`/advisors/${advisor._id}`)}
                      >
                        📋
                      </Button>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddUserModal isOpen={isOpen} onClose={onClose} />
      <ViewUserModal isOpen={isViewModalOpen} user={selectedAdvisor} onClose={() => setViewModalOpen(false)} />
      {isEditModalOpen && selectedAdvisorId && (
        <EditUserModal
          isOpen={isEditModalOpen}
          userId={selectedAdvisorId}
          onClose={() => setEditModalOpen(false)}
          onUpdateSuccess={refreshAdvisors}
        />
      )}
      <CreateAdvisoryModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        advisorId={createTarget.advisorId}
        careerId={createTarget.careerId}
        onSuccess={refreshAdvisors}
      />
    </div>
  );
};

export default AdvisoryList;
