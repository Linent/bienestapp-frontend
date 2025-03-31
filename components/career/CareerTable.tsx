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
} from "@heroui/react";
import { fetchCareers } from "@/services/careerService";
import { EyeIcon, EditIcon, DeleteIcon } from "@/components/icons/ActionIcons";
import AddCareerModal from "@/components/career/AddCareerModal";

interface Career {
  _id: string;
  name: string;
  code: string;
  enable: boolean;
}

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

  useEffect(() => {
    const getCareers = async () => {
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

    getCareers();
  }, []);

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

  if (loading) return <p>Cargando carreras...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="m-4">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Buscar carrera..."
          className="border p-2 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          className="w-full max-w-96"
          label="Filtrar por estado"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <SelectItem key="" value="">
            Todas
          </SelectItem>
          <SelectItem key="Activo" value="Activo">
            Activo
          </SelectItem>
          <SelectItem key="Inactivo" value="Inactivo">
            Inactivo
          </SelectItem>
        </Select>
        <Button color="primary" onPress={onOpen}>
          Agregar Carrera
        </Button>
      </div>
      <Table isStriped aria-label="Lista de Carreras">
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
                      >
                        <EyeIcon />
                      </button>
                    </Tooltip>
                    <Tooltip content="Editar carrera">
                      <button
                        aria-label="Editar carrera"
                        className="cursor-pointer text-default-400 hover:text-warning"
                      >
                        <EditIcon />
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

      {/* Modal de agregar carrera */}
      <AddCareerModal isOpen={isOpen} onClose={onClose} />
    </div>
  );
};

export default CareerTable;
