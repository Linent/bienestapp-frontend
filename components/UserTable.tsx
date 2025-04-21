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
} from "@heroui/react";

import { fetchUsers } from "@/services/userService";
import {
  EyeIcon,
  EditIcon,
  DeleteIcon,
  PlusIcon,
} from "@/components/icons/ActionIcons";
import AddUserModal from "@/components/AddUserModal";
import ViewUserModal from "@/components/ViewUserModal";
import EditUserModal from "@/components/EditUserModal";

const roleMap: Record<string, string> = {
  admin: "Administrador",
  academic_friend: "Amigo Académico",
  student: "Estudiante",
};

const statusColorMap: Record<"Activo" | "Inactivo", "success" | "danger"> = {
  Activo: "success",
  Inactivo: "danger",
};

interface User {
  _id: string;
  name: string;
  email: string;
  codigo: string;
  role: keyof typeof roleMap;
  enable: boolean;
}

const UserTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Manejo del modal
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await fetchUsers();

        if (Array.isArray(data)) {
          setUsers(data as User[]);
        } else {
          throw new Error("Formato de datos inválido");
        }
      } catch (err) {
        setError("No se pudo cargar la lista de usuarios.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesStatus = filterStatus
      ? (user.enable ? "Activo" : "Inactivo") === filterStatus
      : true;
    const matchesSearch = searchTerm
      ? user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    return matchesStatus && matchesSearch;
  });

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
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

      setUsers(data);
    } catch (error) {
      setError("No se pudo actualizar la lista de usuarios.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m-4">
      <div className="flex justify-between items-center mb-4">
        <input
          className="border p-2 rounded"
          placeholder="Buscar usuario..."
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex items-center gap-2 w-full max-w-96">
          <Select
            className="w-full"
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
        </div>
        <Button color="primary" startContent={<PlusIcon />} onPress={onOpen}>
          Agregar Usuario
        </Button>
      </div>
      <Table isStriped aria-label="Lista de Usuarios">
        <TableHeader>
          <TableColumn>#</TableColumn>
          <TableColumn>Nombre</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Código</TableColumn>
          <TableColumn>Rol</TableColumn>
          <TableColumn>Estado</TableColumn>
          <TableColumn>Acciones</TableColumn>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user, index) => {
            const statusText: "Activo" | "Inactivo" = user.enable
              ? "Activo"
              : "Inactivo";

            return (
              <TableRow key={user._id || index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.codigo}</TableCell>
                <TableCell>{roleMap[user.role] ?? "Desconocido"}</TableCell>
                <TableCell>
                  <Chip
                    color={statusColorMap[statusText]}
                    size="sm"
                    variant="flat"
                  >
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
                    <Tooltip content="Editar usuario">
                      <button
                        aria-label="Editar usuario"
                        className="cursor-pointer text-default-400 hover:text-warning"
                        onClick={() => openEditModal(user._id)}
                      >
                        <EditIcon />
                      </button>
                    </Tooltip>
                    <Tooltip content="Eliminar usuario">
                      <button
                        aria-label="Eliminar usuario"
                        className="cursor-pointer text-danger hover:text-red-600"
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

      {/* Agregar Modal de Usuario */}
      <AddUserModal isOpen={isOpen} onClose={onClose} />
      <ViewUserModal
        isOpen={isViewModalOpen}
        user={selectedUser}
        onClose={closeViewModal}
      />
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
