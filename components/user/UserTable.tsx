// components/UserTable.tsx
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
  Select,
  SelectItem,
  Button,
  Input,
  Alert,
  useDisclosure,
} from "@heroui/react";

import {
  fetchUsers,
  updateEnableUser,
  deleteUser,
} from "@/services/userService";
import {
  EyeIcon,
  EditIcon,
  PlusIcon,
  ClipboardIcon,
  TrashIcon,
  BlockIcon,
  CheckIcon,
} from "@/components/icons/ActionIcons";
import AddUserModal from "@/components/user/AddUserModal";
import ViewUserModal from "@/components/user/ViewUserModal";
import EditUserModal from "@/components/user/EditUserModal";
import { User } from "@/types";

const roleMap: Record<string, string> = {
  admin: "Administrador",
  academic_friend: "Amigo Académico",
  student: "Estudiante",
};

const statusColorMap: Record<"Activo" | "Inactivo", "success" | "danger"> = {
  Activo: "success",
  Inactivo: "danger",
};

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterCareer, setFilterCareer] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  // Estado para el Alert
  const [alertProps, setAlertProps] = useState<{
    color: "success" | "danger";
    title: string;
  } | null>(null);

  // Carga inicial de usuarios
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchUsers();
        // solo estudiantes para este ejemplo
        setUsers(data.filter((u: User) => u.role === "student"));
      } catch (err) {
        setError("No se pudo cargar la lista de mentores.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Oculta el alert tras 5s
  useEffect(() => {
    if (!alertProps) return;
    const t = setTimeout(() => setAlertProps(null), 5000);
    return () => clearTimeout(t);
  }, [alertProps]);

  const uniqueCareers = Array.from(
    new Set(
      users
        .map((u) =>
          typeof u.career === "object" && u.career?.name
            ? u.career.name
            : (u.career as string)
        )
        .filter(Boolean)
    )
  ) as string[];

  // Filtrado
  const filteredUsers = users.filter((u) => {
    const status = u.enable ? "Activo" : "Inactivo";
    return (
      (filterStatus ? status === filterStatus : true) &&
      (filterCareer
        ? (typeof u.career === "object"
            ? u.career && u.career.name
            : u.career) === filterCareer
        : true) &&
      (searchTerm
        ? u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase())
        : true)
    );
  });

  const refreshUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data.filter((u: User) => u.role === "student"));
    } catch {
      setAlertProps({ color: "danger", title: "Error actualizando la lista." });
    } finally {
      setLoading(false);
    }
  };

  // Handlers que disparan el Alert
  const handleToggleStatus = async (user: User) => {
    try {
      await updateEnableUser(user._id, !user.enable);
      setAlertProps({
        color: !user.enable ? "success" : "danger",
        title: `Asesor ${!user.enable ? "habilitado" : "deshabilitado"} correctamente`,
      });
      await refreshUsers();
    } catch {
      setAlertProps({
        color: "danger",
        title: "No se pudo cambiar el estado del asesor.",
      });
    }
  };

  const handleDelete = async (user: User) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este asesor?")) return;
    try {
      await deleteUser(user._id);
      setAlertProps({ color: "success", title: "Asesor eliminado correctamente" });
      await refreshUsers();
    } catch {
      setAlertProps({
        color: "danger",
        title: "No se pudo eliminar el asesor.",
      });
    }
  };

  if (loading) return <p>Cargando mentores...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      {/* Alert */}
      {alertProps && (
        <Alert
          color={alertProps.color}
          title={alertProps.title}
          className="mb-4"
        />
      )}

      {/* Filtros y acciones */}
      <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-2 w-full md:max-w-2xl">
          <Input
            placeholder="Buscar asesor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            className="w-full"
            label="Filtrar por estado"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <SelectItem data-value="">Todos</SelectItem>
            <SelectItem data-value="Activo">Activo</SelectItem>
            <SelectItem data-value="Inactivo">Inactivo</SelectItem>
          </Select>
          <Select
            className="w-full"
            label="Filtrar por carrera"
            value={filterCareer}
            onChange={(e) => setFilterCareer(e.target.value)}
          >
            {[
              <SelectItem key="" data-value="">Todas las carreras</SelectItem>,
              ...uniqueCareers.map((c) => (
                <SelectItem key={c} data-value={c}>
                  {c}
                </SelectItem>
              ))
            ]}
          </Select>
        </div>
        <Button color="primary" onPress={onOpen}>
          <PlusIcon /> Agregar Estudiante
        </Button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto border border-gray-200 rounded">
        <Table isStriped aria-label="Lista de Mentores">
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
            {filteredUsers.map((user, idx) => {
              const statusText: "Activo" | "Inactivo" = user.enable
                ? "Activo"
                : "Inactivo";
              return (
                <TableRow key={user._id}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.codigo}</TableCell>
                  <TableCell>{roleMap[user.role] ?? "Desconocido"}</TableCell>
                  <TableCell>
                    {typeof user.career === "object"
                      ? user.career?.name ?? "—"
                      : user.career ?? "—"}
                  </TableCell>
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
                        <button className="hover:text-blue-400" onClick={() => { setSelectedUser(user); setIsViewModalOpen(true); }}>
                          <EyeIcon />
                        </button>
                      </Tooltip>
                      <Tooltip content="Editar asesor">
                        <button className="hover:text-yellow-400" onClick={() => { setSelectedUserId(user._id); setEditModalOpen(true); }}>
                          <EditIcon />
                        </button>
                      </Tooltip>
                      <Tooltip content={user.enable ? "Deshabilitar" : "Habilitar"}>
                        <button  onClick={() => handleToggleStatus(user)}>
                          {user.enable ? <BlockIcon color="red" /> : <CheckIcon color="green" />}
                        </button>
                      </Tooltip>
                      <Tooltip content="Eliminar asesor">
                        <button onClick={() => handleDelete(user)}>
                          <TrashIcon />
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

      {/* Modales */}
      <AddUserModal isOpen={isOpen} onClose={onClose} />
      <ViewUserModal
        isOpen={isViewModalOpen}
        user={selectedUser}
        onClose={() => setIsViewModalOpen(false)}
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
}
