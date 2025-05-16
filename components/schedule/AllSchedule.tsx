import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  DateRangePicker,
  Input,
  Select,
  SelectItem,
  Chip,
  Button
} from "@heroui/react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useEffect, useState } from "react";
import { fetchSchedules } from "@/services/scheduleService";
import { Schedule } from "@/types/types";
import { DownloadPdfIcon } from "../icons/ActionIcons";

const WeeklySchedules = () => {
  const [allSchedules, setAllSchedules] = useState<Schedule[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCareer, setFilterCareer] = useState("");
  const [filterAttendance, setFilterAttendance] = useState("");
  const [uniqueCareers, setUniqueCareers] = useState<string[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const getDefaultRange = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0);
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);
    friday.setHours(23, 59, 59, 999);
    return { from: monday, to: friday };
  };

  const [selectedDateRange, setSelectedDateRange] = useState(getDefaultRange());

  const exportToExcel = () => {
    const data = filteredSchedules.map((s) => ({
      Estudiante: s.studentId.name,
      Asesor: s.AdvisoryId.advisorId.name,
      Tema: s.topic,
      Carrera: s.AdvisoryId.careerId?.name ?? "No especificada",
      Fecha: new Date(s.dateStart).toLocaleString("es-CO"),
      Asistencia: s.attendance ? "Asistió" : "No asistió"
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Agendamientos");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/octet-stream"
    });
    saveAs(fileData, `agendamientos_${Date.now()}.xlsx`);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterCareer("");
    setFilterAttendance("");
    setSelectedDateRange(getDefaultRange());
  };

  useEffect(() => {
    const loadSchedules = async () => {
      try {
        const schedules: Schedule[] = await fetchSchedules();
        setAllSchedules(schedules);

        const careers = Array.from(
          new Set(
            schedules
              .map(
                (s) =>
                  s.AdvisoryId.careerId &&
                  typeof s.AdvisoryId.careerId === "object" &&
                  s.AdvisoryId.careerId.name
              )
              .filter(Boolean)
          )
        );
        setUniqueCareers(careers as string[]);
      } catch (error) {
        console.error("Error al cargar los horarios", error);
      }
    };

    loadSchedules();
  }, []);

  useEffect(() => {
    const filtered = allSchedules
      .filter((schedule) => {
        const date = new Date(schedule.dateStart);
        return date >= selectedDateRange.from && date <= selectedDateRange.to;
      })
      .filter((schedule) => {
        const matchesCareer = filterCareer
          ? schedule.AdvisoryId.careerId?.name === filterCareer
          : true;

        const matchesAttendance =
          filterAttendance === "asistio"
            ? schedule.attendance === true
            : filterAttendance === "no_asistio"
            ? schedule.attendance === false
            : true;

        const matchesSearch = searchTerm
          ? schedule.studentId.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            schedule.AdvisoryId.advisorId.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          : true;

        return matchesCareer && matchesAttendance && matchesSearch;
      })
      .sort(
        (a, b) =>
          new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime()
      );

    setFilteredSchedules(filtered);
    setCurrentPage(1);
  }, [
    allSchedules,
    selectedDateRange,
    searchTerm,
    filterCareer,
    filterAttendance
  ]);

  const totalPages = itemsPerPage === -1 ? 1 : Math.ceil(filteredSchedules.length / itemsPerPage);
  const paginatedSchedules =
    itemsPerPage === -1
      ? filteredSchedules
      : filteredSchedules.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="w-full p-6 bg-white shadow-md rounded-lg">
      <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-4 mb-4">
        <Input
          className="w-full sm:w-1/3 md:w-1/3"
          placeholder="Buscar por estudiante o asesor"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          className="w-full sm:w-1/3 md:w-1/3"
          label="Filtrar por carrera"
          value={filterCareer}
          onChange={(e) => setFilterCareer(e.target.value)}
        >
          <SelectItem key="" data-value="">
            Todas las carreras
          </SelectItem>
          <>
            {uniqueCareers.map((career) => (
              <SelectItem key={career} data-value={career}>
                {career}
              </SelectItem>
            ))}
          </>
        </Select>
        <Select
          className="w-full sm:w-1/3 md:w-1/3"
          label="Filtrar por asistencia"
          value={filterAttendance}
          onChange={(e) => setFilterAttendance(e.target.value)}
        >
          <SelectItem key="" data-value="">
            Todos
          </SelectItem>
          <SelectItem key="asistio" data-value="asistio">
            Asistió
          </SelectItem>
          <SelectItem key="no_asistio" data-value="no_asistio">
            No asistió
          </SelectItem>
        </Select>
      </div>

      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <DateRangePicker
          className="max-w-md w-full sm:w-auto"
          data-value={selectedDateRange}
          onChange={(value) => {
            if (
              value &&
              value.start &&
              value.end &&
              "toDate" in value.start &&
              "toDate" in value.end
            ) {
              setSelectedDateRange({
                from: value.start.toDate("UTC"),
                to: value.end.toDate("UTC")
              });
            }
          }}
        />

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
          <Select
            className="w-[150px] w-full sm:w-[150px]"
            label="Items por página"
            value={itemsPerPage.toString()}
            onChange={(e) => setItemsPerPage(e.target.value === "all" ? -1 : parseInt(e.target.value))}
          >
            <SelectItem key="25" data-value="25">25</SelectItem>
            <SelectItem key="50" data-value="50">50</SelectItem>
            <SelectItem key="100" data-value="100">100</SelectItem>
            <SelectItem key="all" data-value="all">Todos</SelectItem>
          </Select>
          <Button variant="bordered" color="primary" className="text-sm w-full sm:w-auto" onClick={clearFilters}>
            Limpiar filtros
          </Button>
        </div>
      </div>

      {paginatedSchedules.length > 0 ? (
        <>
          <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
            <div className="flex flex-col sm:flex-row sm:justify-start sm:space-x-6 gap-2 text-sm">
              <span>
                <strong>Asistieron:</strong> {filteredSchedules.filter((s) => s.attendance === true).length}
              </span>
              <span>
                <strong>No asistieron:</strong> {filteredSchedules.filter((s) => s.attendance === false).length}
              </span>
              <span>
                <strong>Total:</strong> {filteredSchedules.length}
              </span>
            </div>
            <Button color="success" onClick={exportToExcel} startContent={<DownloadPdfIcon />}>
              Exportar a Excel
            </Button>
          </div>

          <div className="min-w-full table-auto border-gray-300">
            <Table className="w-full text-sm ">
              <TableHeader>
                <TableColumn>Estudiante</TableColumn>
                <TableColumn>Asesor</TableColumn>
                <TableColumn>Tema</TableColumn>
                <TableColumn>Carrera</TableColumn>
                <TableColumn>Fecha</TableColumn>
                <TableColumn>Asistencia</TableColumn>
              </TableHeader>
              <TableBody>
                {paginatedSchedules.map((schedule) => (
                  <TableRow key={schedule._id}>
                    <TableCell>{schedule.studentId.name}</TableCell>
                    <TableCell>{schedule.AdvisoryId.advisorId.name}</TableCell>
                    <TableCell>{schedule.topic}</TableCell>
                    <TableCell>{schedule.AdvisoryId.careerId?.name ?? "Sin carrera"}</TableCell>
                    <TableCell>{new Date(schedule.dateStart).toLocaleString("es-CO")}</TableCell>
                    <TableCell>
                      <Chip
                        color={schedule.attendance ? "success" : "danger"}
                        size="sm"
                        variant="flat"
                      >
                        {schedule.attendance ? "Asistió" : "No asistió"}
                      </Chip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {itemsPerPage !== -1 && (
            <div className="mt-4 flex justify-center gap-2 text-sm">
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i + 1}
                  size="sm"
                  variant={currentPage === i + 1 ? "solid" : "bordered"}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center text-gray-500 py-8">
          No se encontraron resultados para los filtros aplicados.
        </div>
      )}
    </div>
  );
};

export default WeeklySchedules;
