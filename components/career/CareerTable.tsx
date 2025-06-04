import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Select,
  SelectItem,
  Tooltip,
  Chip,
  useDisclosure,
  Input,
  Spinner,
  Alert,
} from "@heroui/react";
import { toggleCareerStatus, fetchCareers } from "@/services/careerService";
import {
  EyeIcon,
  EditIcon,
  DeleteIcon,
  BlockIcon,
  CheckIcon,
} from "@/components/icons/ActionIcons";
import AddCareerModal from "@/components/career/AddCareerModal";
import ViewCareerModal from "@/components/career/viewCareerModal";
import EditCareerModal from "@/components/career/EditCareerModal";

import { Career } from "@/types";

const statusColorMap: Record<"Activo" | "Inactivo", "success" | "danger"> = {
  Activo: "success",
  Inactivo: "danger",
};

const CareerTable = () => {
  const [careers, setCareers] = useState<Career[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [loadingToggle, setLoadingToggle] = useState<string | null>(null);
  const [editCareerId, setEditCareerId] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  // ALERT
  const [alert, setAlert] = useState<{
    color: "success" | "danger";
    message: string;
  } | null>(null);

  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();

  useEffect(() => {
    getCareers();
  }, []);

  const getCareers = async () => {
    setLoading(true);
    try {
      const data = await fetchCareers();
      if (Array.isArray(data)) {
        setCareers(data as Career[]);
      } else {
        throw new Error("Formato de datos inválido");
      }
    } catch (err) {
      setError("No se pudo cargar la lista de carreras.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ACCIÓN HABILITAR/DESHABILITAR usando recarga de la lista y ALERT
  const handleToggleCareerStatus = async (career: Career) => {
    setLoadingToggle(career._id);
    try {
      const result = await toggleCareerStatus(career._id, !career.enable);
      await getCareers();
      setAlert({
        color: "success",
        message: !career.enable
          ? "¡Carrera habilitada correctamente!"
          : "¡Carrera deshabilitada correctamente!",
      });
    } catch (err) {
      setAlert({
        color: "danger",
        message: "No se pudo cambiar el estado de la carrera.",
      });
    } finally {
      setLoadingToggle(null);
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleViewCareer = (career: Career) => {
    setSelectedCareer(career);
    onViewOpen();
  };

  const filteredCareers = careers.filter((career) => {
    const matchesStatus = filterStatus
      ? (career.enable ? "Activo" : "Inactivo") === filterStatus
      : true;
    const matchesSearch = searchTerm
      ? career.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        career.code.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesStatus && matchesSearch;
  });

  if (loading) return <Spinner color="danger" />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="m-4">
      {alert && (
        <Alert color={alert.color} className="mb-4">
          {alert.message}
        </Alert>
      )}

      {/* Filtros y buscador */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <Input
          className="p-2 rounded w-full sm:w-1/3"
          placeholder="Buscar carrera..."
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          className="w-full sm:w-1/3"
          label="Filtrar por estado"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <SelectItem key="" data-value="">
            Todas
          </SelectItem>
          <SelectItem key="Activo" data-value="Activo">
            Activo
          </SelectItem>
          <SelectItem key="Inactivo" data-value="Inactivo">
            Inactivo
          </SelectItem>
        </Select>
        <Button className="w-full sm:w-auto" color="primary" onPress={onOpen}>
          Agregar Carrera
        </Button>
      </div>

      {/* Tabla responsiva con scroll horizontal */}
      <div className="overflow-x-auto rounded-lg shadow">
        <Table
          isStriped
          aria-label="Lista de Carreras"
          className="min-w-[700px]"
        >
          <TableHeader>
            <TableColumn>#</TableColumn>
            <TableColumn>Código</TableColumn>
            <TableColumn>Nombre</TableColumn>
            <TableColumn>Estado</TableColumn>
            <TableColumn>Acciones</TableColumn>
          </TableHeader>
          <TableBody>
            {filteredCareers.map((career, index) => {
              const statusText: "Activo" | "Inactivo" = career.enable
                ? "Activo"
                : "Inactivo";
              return (
                <TableRow key={career._id || index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{career.code}</TableCell>
                  <TableCell>{career.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Chip
                        color={statusColorMap[statusText]}
                        size="sm"
                        variant="flat"
                      >
                        {statusText}
                      </Chip>
                      {/* Botón con Tooltip e ícono */}
                      {loadingToggle === career._id && <Spinner size="sm" />}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap items-center gap-2">
                      <Tooltip content="Ver detalles">
                        <button
                          aria-label="Ver detalles"
                          className="cursor-pointer text-default-400 hover:text-primary"
                          onClick={() => handleViewCareer(career)}
                        >
                          <EyeIcon />
                        </button>
                      </Tooltip>
                      <Tooltip content="Editar carrera">
                        <button
                          aria-label="Editar carrera"
                          className="cursor-pointer text-default-400 hover:text-warning"
                          onClick={() => { setEditCareerId(career._id); setIsEditOpen(true); }}
                        >
                          <EditIcon />
                        </button>
                      </Tooltip>
                      <Tooltip
                        content={career.enable ? "Deshabilitar" : "Habilitar"}
                      >
                        <button
                          aria-label={
                            career.enable ? "Deshabilitar" : "Habilitar"
                          }
                          onClick={() => handleToggleCareerStatus(career)}
                          disabled={loadingToggle === career._id}
                          className="focus:outline-none"
                        >
                          {career.enable ? (
                            <BlockIcon color="red" />
                          ) : (
                            <CheckIcon color="green" />
                          )}
                        </button>
                      </Tooltip>
                      <Tooltip content="Eliminar carrera">
                        <button
                          aria-label="Eliminar carrera"
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
      </div>

      {/* Modales */}
      <AddCareerModal
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={getCareers}
      />
      <ViewCareerModal
        career={selectedCareer}
        isOpen={isViewOpen}
        onClose={onViewClose}
      />
      {isEditOpen && editCareerId && (
  <EditCareerModal
    isOpen={isEditOpen}
    onClose={() => setIsEditOpen(false)}
    careerId={editCareerId}
    onUpdateSuccess={getCareers} // o la función que recargue tu lista
  />
)}
    </div>
  );
};

export default CareerTable;
