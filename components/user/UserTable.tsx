import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
  Select,
  SelectItem,
  Button,
  useDisclosure,
  Input
} from "@heroui/react";

import { fetchUsers, updateEnableUser, deleteUser } from "@/services/userService";
import {
  EyeIcon,
  EditIcon,
  DeleteIcon,
  PlusIcon
} from "@/components/icons/ActionIcons";
import AddUserModal from "@/components/user/AddUserModal";
import ViewUserModal from "@/components/user/ViewUserModal";
import EditUserModal from "@/components/user/EditUserModal";

const roleMap: Record<string, string> = {
  admin: "Administrador",
  academic_friend: "Amigo Académico",
  student: "Estudiante"
};

const statusColorMap: Record<"Activo" | "Inactivo", "success" | "danger"> = {
  Activo: "success",
  Inactivo: "danger"
};

interface User {
  _id: string;
  name: string;
  email: string;
  codigo: string;
  role: keyof typeof roleMap;
  enable: boolean;
  career: {
    name: string;
  };
}

const UserTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterCareer, setFilterCareer] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await fetchUsers();
        if (Array.isArray(data)) {
          const onlyAdvisors = data.filter((user: User) => user.role === "student");
          setUsers(onlyAdvisors);
        } else {
          throw new Error("Formato de datos inválido");
        }
      } catch (err) {
        setError("No se pudo cargar la lista de asesores.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  const uniqueCareers = Array.from(
    new Set(users.map((user) => user.career?.name).filter(Boolean))
  );

  const filteredUsers = users.filter((user) => {
    const matchesStatus = filterStatus
      ? (user.enable ? "Activo" : "Inactivo") === filterStatus
      : true;
    const matchesCareer = filterCareer
      ? user.career?.name === filterCareer
      : true;
    const matchesSearch = searchTerm
      ? user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    return matchesStatus && matchesCareer && matchesSearch;
  });

  const openViewModal = (user: User) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedUser(null);
  };

  const openEditModal = (userId: string) => {
    setSelectedUserId(userId);
    setEditModalOpen(true);
  };

  const refreshUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();
      const onlyAdvisors = data.filter((user: User) => user.role === "student");
      setUsers(onlyAdvisors);
    } catch (error) {
      setError("No se pudo actualizar la lista de asesores.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Cargando asesores...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-2 w-full md:max-w-2xl">
          <Input
            className="p-2 rounded w-full"
            placeholder="Buscar asesor..."
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            className="w-full"
            label="Filtrar por estado"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <SelectItem key="" data-value="">Todos</SelectItem>
            <SelectItem key="Activo" data-value="Activo">Activo</SelectItem>
            <SelectItem key="Inactivo" data-value="Inactivo">Inactivo</SelectItem>
          </Select>

          <Select
            className="w-full"
            label="Filtrar por carrera"
            value={filterCareer}
            onChange={(e) => setFilterCareer(e.target.value)}
          >
            <SelectItem key="" data-value="">Todas las carreras</SelectItem>
            <>
              {uniqueCareers.map((careerName) => (
                <SelectItem key={careerName} data-value={careerName}>
                  {careerName}
                </SelectItem>
              ))}
            </>
          </Select>
        </div>

        <Button
          color="primary"
          startContent={<PlusIcon />}
          className="w-full md:w-auto"
          onPress={onOpen}
        >
          Agregar Asesor
        </Button>
      </div>

      <div className="min-w-full table-auto border-gray-300">
        <Table isStriped aria-label="Lista de Asesores">
          <TableHeader>
            <TableColumn>#</TableColumn>
            <TableColumn>Nombre</TableColumn>
            <TableColumn>Email</TableColumn>
            <TableColumn>Código</TableColumn>
            <TableColumn>Rol</TableColumn>
            <TableColumn>Carrera</TableColumn>
            <TableColumn>Estado</TableColumn>
            <TableColumn>Acciones</TableColumn>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user, index) => {
              const statusText: "Activo" | "Inactivo" = user.enable ? "Activo" : "Inactivo";

              const handleToggleStatus = async () => {
                try {
                  await updateEnableUser(user._id, !user.enable);
                  alert(`Asesor ${!user.enable ? "habilitado" : "deshabilitado"} correctamente`);
                  refreshUsers();
                } catch (error) {
                  alert("No se pudo cambiar el estado del asesor.");
                }
              };

              const handleDelete = async () => {
                if (confirm("¿Estás seguro de que deseas eliminar este asesor?")) {
                  try {
                    await deleteUser(user._id);
                    alert("Asesor eliminado correctamente");
                    refreshUsers();
                  } catch (error) {
                    alert("No se pudo eliminar el asesor.");
                  }
                }
              };

              return (
                <TableRow key={user._id || index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.codigo}</TableCell>
                  <TableCell>{roleMap[user.role] ?? "Desconocido"}</TableCell>
                  <TableCell>{user.career?.name}</TableCell>
                  <TableCell>
                    <Chip color={statusColorMap[statusText]} size="sm" variant="flat">
                      {statusText}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Tooltip content="Ver detalles">
                        <button
                          aria-label="Ver detalles"
                          className="cursor-pointer text-default-400 hover:text-primary"
                          onClick={() => openViewModal(user)}
                        >
                          <EyeIcon />
                        </button>
                      </Tooltip>
                      <Tooltip content="Editar asesor">
                        <button
                          aria-label="Editar asesor"
                          className="cursor-pointer text-default-400 hover:text-warning"
                          onClick={() => openEditModal(user._id)}
                        >
                          <EditIcon />
                        </button>
                      </Tooltip>
                      <Tooltip content={user.enable ? "Deshabilitar" : "Habilitar"}>
                        <button
                          aria-label="Cambiar estado"
                          className={`cursor-pointer ${user.enable ? "text-danger hover:text-red-600" : "text-success hover:text-green-600"}`}
                          onClick={handleToggleStatus}
                        >
                          {user.enable ? "⛔" : "✔️"}
                        </button>
                      </Tooltip>
                      <Tooltip content="Eliminar asesor">
                        <button
                          aria-label="Eliminar asesor"
                          className="cursor-pointer text-danger hover:text-red-600"
                          onClick={handleDelete}
                        >
                          <DeleteIcon />
                        </button>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <AddUserModal isOpen={isOpen} onClose={onClose} />
      <ViewUserModal isOpen={isViewModalOpen} user={selectedUser} onClose={closeViewModal} />
      {isEditModalOpen && selectedUserId && (
        <EditUserModal
          isOpen={isEditModalOpen}
          userId={selectedUserId}
          onClose={() => setEditModalOpen(false)}
          onUpdateSuccess={refreshUsers}
        />
      )}
    </div>
  );
};

export default UserTable;
