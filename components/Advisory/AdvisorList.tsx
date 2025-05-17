// components/AdvisoryList.tsx
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
  Skeleton,
  Spinner,
  Alert,
} from "@heroui/react";
import { useRouter } from "next/router";

import {
  fetchUsers,
  updateEnableUser,
  deleteUser,
  importUsersFromFile,
} from "@/services/userService";
import { User } from "@/types";
import { DocumentIcon, UploadIcon } from "@/components/icons/ActionIcons";
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
import CreateAdvisoryModal from "@/components/Advisory/CreateAdvisoryModal";

const MAX_HOURS = 20;

export default function AdvisoryList() {
  const [advisors, setAdvisors] = useState<User[]>([]);
  const [careers, setCareers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterCareer, setFilterCareer] = useState<string>("");

  const [selectedAdvisor, setSelectedAdvisor] = useState<User | null>(null);
  const [selectedAdvisorId, setSelectedAdvisorId] = useState<string | null>(
    null
  );
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [createTarget, setCreateTarget] = useState<{
    advisorId: string;
    careerId: string;
  }>({ advisorId: "", careerId: "" });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  // Estado para Alert
  const [alertProps, setAlertProps] = useState<{
    color:
      | "success"
      | "danger"
      | "warning"
      | "default"
      | "primary"
      | "secondary";
    title: string;
  } | null>(null);

  // Limpia el alerta tras 5s
  useEffect(() => {
    if (!alertProps) return;
    const t = setTimeout(() => setAlertProps(null), 5000);
    return () => clearTimeout(t);
  }, [alertProps]);

  // Carga inicial
  useEffect(() => {
    (async () => {
      try {
        const users = await fetchUsers();
        const academicFriends = users.filter(
          (u: User) => u.role === "academic_friend"
        );
        interface Career {
          _id: string;
          name: string;
        }

        interface AcademicFriend extends User {
          career: Career | null;
        }

        const uniqueCareerNames: string[] = Array.from(
          new Set(
            (academicFriends as AcademicFriend[])
              .map((u: AcademicFriend) =>
                typeof u.career === "object" && u.career !== null
                  ? u.career.name
                  : null
              )
              .filter(Boolean)
          )
        ) as string[];
        setCareers(uniqueCareerNames);
        setAdvisors(academicFriends);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los datos.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Manejo de importación de archivo
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const result = await importUsersFromFile(file);
      setAlertProps({
        color: "success",
        title: `Usuarios creados: ${result.created}`,
      });
      // recarga
      const refreshed = await fetchUsers();
      setAdvisors(refreshed.filter((u: User) => u.role === "academic_friend"));
    } catch (err) {
      console.error(err);
      setAlertProps({ color: "danger", title: "Error al importar usuarios" });
    } finally {
      setImporting(false);
    }
  };

  // Filtrado
  const filteredAdvisors = advisors.filter((advisor) => {
    const matchesSearch =
      advisor.name.toLowerCase().includes(searchTerm) ||
      advisor.email.toLowerCase().includes(searchTerm) ||
      advisor.codigo?.toLowerCase().includes(searchTerm);
    const matchesStatus =
      !filterStatus ||
      (filterStatus === "Activo" && advisor.enable) ||
      (filterStatus === "Inactivo" && !advisor.enable);
    const matchesCareer =
      !filterCareer ||
      (typeof advisor.career === "object" &&
        advisor.career !== null &&
        advisor.career.name === filterCareer);
    return matchesSearch && matchesStatus && matchesCareer;
  });

  // Handlers de acciones
  const handleToggleStatus = async (advisor: User) => {
    try {
      await updateEnableUser(advisor._id, !advisor.enable);
      setAdvisors((prev) =>
        prev.map((a) =>
          a._id === advisor._id ? { ...a, enable: !advisor.enable } : a
        )
      );
      setAlertProps({
        color: "success",
        title: advisor.enable ? "Asesor deshabilitado" : "Asesor habilitado",
      });
    } catch (err) {
      console.error(err);
      setAlertProps({
        color: "warning",
        title: "No se pudo actualizar el estado.",
      });
    }
  };

  const handleDelete = async (advisor: User) => {
    if (!confirm(`¿Eliminar a ${advisor.name}?`)) return;
    try {
      await deleteUser(advisor._id);
      setAdvisors((prev) => prev.filter((a) => a._id !== advisor._id));
      setAlertProps({
        color: "success",
        title: "Asesor eliminado correctamente",
      });
    } catch (err) {
      console.error(err);
      setAlertProps({
        color: "danger",
        title: "No se pudo eliminar el asesor.",
      });
    }
  };

  if (loading) return <Skeleton className="h-64 w-full" />;
  if (error) return <Alert color="danger" title={error} />;

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      {/* Alert superior */}
      {alertProps && (
        <Alert
          color={alertProps.color}
          title={alertProps.title}
          className="mb-4"
        />
      )}

      {/* Controles */}
      <div className="flex flex-wrap md:flex-nowrap gap-4 mb-4">
        <Input
          className="flex-1"
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          className="flex-1"
          label="Filtrar por estado"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <SelectItem data-value="">Todos</SelectItem>
          <SelectItem data-value="Activo">Activo</SelectItem>
          <SelectItem data-value="Inactivo">Inactivo</SelectItem>
        </Select>
        <Select
          className="flex-1"
          label="Filtrar por carrera"
          value={filterCareer}
          onChange={(e) => setFilterCareer(e.target.value)}
        >
          {[
            <SelectItem data-value="" key="">
              Todas
            </SelectItem>,
            ...careers.map((c) => (
              <SelectItem key={c} data-value={c}>
                {c}
              </SelectItem>
            )),
          ]}
        </Select>

        <Button color="primary" onPress={onOpen}>
          <PlusIcon /> Agregar Mentor
        </Button>

        <label className="relative inline-block group">
          <Button
            color="success"
            as="span"
            variant="bordered"
            startContent={<UploadIcon />}
            isDisabled={importing}
            className="
      transform 
      transition-transform 
      duration-200 
      ease-in-out 
      group-hover:scale-105 
      active:scale-95
    "
          >
            {importing ? <Spinner size="sm" /> : "Importar usuarios"}
          </Button>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            className="absolute inset-0 opacity-0 cursor-pointer"
            disabled={importing}
            onChange={handleUpload}
          />
        </label>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <Table isStriped>
          <TableHeader>
            <TableColumn>#</TableColumn>
            <TableColumn>Nombre</TableColumn>
            <TableColumn>Código</TableColumn>
            <TableColumn>Correo</TableColumn>
            <TableColumn>Carrera</TableColumn>
            <TableColumn>Estado</TableColumn>
            <TableColumn>Hoja de Vida</TableColumn>
            <TableColumn>Acciones</TableColumn>
          </TableHeader>
          <TableBody>
            {filteredAdvisors.map((advisor, i) => (
              <TableRow key={advisor._id}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{advisor.name}</TableCell>
                <TableCell>{advisor.codigo}</TableCell>
                <TableCell>{advisor.email}</TableCell>
                <TableCell>
                  {typeof advisor.career === "object" && advisor.career !== null
                    ? advisor.career.name
                    : "—"}
                </TableCell>
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
                  {advisor.resume ? (
                    <Button
                      color="primary"
                      size="sm"
                      onPress={() => window.open(advisor.resume, "_blank")}
                    >
                      <DocumentIcon /> Ver
                    </Button>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell className="flex gap-2">
                  <Tooltip content="Ver detalles">
                    <button
                    className="hover:text-blue-400"
                      onClick={() => {
                        setSelectedAdvisor(advisor);
                        setViewModalOpen(true);
                      }}
                    >
                      <EyeIcon />
                    </button>
                  </Tooltip>
                  <Tooltip content="Editar">
                    <button
                    className="hover:text-yellow-400"
                      onClick={() => {
                        setSelectedAdvisorId(advisor._id);
                        setEditModalOpen(true);
                      }}
                    >
                      <EditIcon  />
                    </button>
                  </Tooltip>
                  <Tooltip
                    content={advisor.enable ? "Deshabilitar" : "Habilitar"}
                  >
                    <button onClick={() => handleToggleStatus(advisor)}>
                      {advisor.enable ? <BlockIcon color="red" /> : <CheckIcon color="green" />}
                    </button>
                  </Tooltip>
                  <Tooltip content="Eliminar">
                    <button onClick={() => handleDelete(advisor)}>
                      <TrashIcon />
                    </button>
                  </Tooltip>
                  <Tooltip content="Crear asesoría">
                    <Button
                      isIconOnly
                      size="sm"
                      color="primary"
                      isDisabled={(advisor.availableHours ?? 0) >= MAX_HOURS}
                      onPress={() => {
                        setCreateTarget({
                          advisorId: advisor._id,
                          careerId:
                            typeof advisor.career === "object"
                              ? String(advisor.career && advisor.career._id)
                              : "",
                        });
                        setCreateModalOpen(true);
                      }}
                    >
                      +
                    </Button>
                  </Tooltip>
                  <Tooltip content="Ver asesorías">
                    <Button
                      isIconOnly
                      size="sm"
                      color="secondary"
                      onPress={() => router.push(`/advisors/${advisor._id}`)}
                    >
                      <ClipboardIcon />
                    </Button>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modales */}
      <AddUserModal isOpen={isOpen} onClose={onClose} />
      <ViewUserModal
        isOpen={isViewModalOpen}
        user={selectedAdvisor}
        onClose={() => setViewModalOpen(false)}
      />
      {isEditModalOpen && selectedAdvisorId && (
        <EditUserModal
          isOpen={isEditModalOpen}
          userId={selectedAdvisorId}
          onClose={() => setEditModalOpen(false)}
          onUpdateSuccess={() => {
            setEditModalOpen(false);
            // opcional: recargar lista
          }}
        />
      )}
      {isCreateModalOpen && createTarget.advisorId && createTarget.careerId && (
        <CreateAdvisoryModal
          isOpen={isCreateModalOpen}
          onClose={() => setCreateModalOpen(false)}
          advisorId={createTarget.advisorId}
          careerId={createTarget.careerId}
          onSuccess={() => {
            setCreateModalOpen(false);
            // opcional: recargar lista
          }}
        />
      )}
    </div>
  );
}
