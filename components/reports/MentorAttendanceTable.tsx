// components/reports/MentorAttendanceTable.tsx
import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Select,
  SelectItem,
  Avatar,
  Chip,
  Button,
  DateRangePicker,
  Image,
  Spinner,
} from "@heroui/react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { fetchSchedulesByAdvisorAll } from "@/services/reportService";
import { DownloadPdfIcon } from "../icons/ActionIcons";
import { fromDate } from "@internationalized/date";
import { MentorAttendance } from "@/types";

const getDefaultDateRange = () => {
  const now = new Date();
  const fourMonthsAgo = new Date();
  fourMonthsAgo.setMonth(now.getMonth() - 4);
  return { from: fourMonthsAgo, to: now };
};

const MentorAttendanceTable: React.FC = () => {
  const [data, setData] = useState<MentorAttendance[]>([]);
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [dateRange, setDateRange] = useState(getDefaultDateRange());
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await fetchSchedulesByAdvisorAll(
        dateRange.from,
        dateRange.to
      );
      setData(
        result.map((item: any, idx: number) => ({
          advisorId: item.advisorId ?? `${idx}`,
          advisorName: item.advisorName,
          count: item.count,
          profileImage: item.profileImage ?? null,
        }))
      );
    } catch (error) {
      console.error("Error cargando datos de asistencia por mentor", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]);

  const sortedData = [...data].sort((a, b) =>
    order === "asc" ? a.count - b.count : b.count - a.count
  );

  // Exportar a PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    const start = dateRange.from.toLocaleDateString("es-CO");
    const end = dateRange.to.toLocaleDateString("es-CO");

    doc.setFontSize(16);
    doc.text("Asesorías atendidas por mentor", 14, 16);
    doc.setFontSize(11);
    doc.text(`Rango: ${start} – ${end}`, 14, 24);

    autoTable(doc, {
      startY: 30,
      head: [["Mentor", "Cantidad"]],
      body: sortedData.map((m) => [m.advisorName, String(m.count)]),
      styles: { fontSize: 9 },
    });

    doc.save("reporte_mentores.pdf");
  };

  // Exportar a Excel
  const exportToExcel = () => {
  const excelData = sortedData.map((mentor) => {
    // Divide el nombre por espacios y toma hasta 4 partes
    const nameParts = (mentor.advisorName || "").split(" ").slice(0, 4);
    // Rellena hasta 4 columnas, en blanco si faltan partes
    while (nameParts.length < 4) nameParts.push("");

    return {
      "Nombre 1": nameParts[0],
      "Nombre 2": nameParts[1],
      "Apellido 1": nameParts[2],
      "Apellido 2": nameParts[3],
      "Asesorías atendidas": mentor.count,
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, "reporte_mentores.xlsx");
};


  const clearFilters = () => {
    setDateRange(getDefaultDateRange());
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg space-y-4">
      {/* -- Header y Filtros -- */}
      <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
        {/* Date Range + Clear */}
        <div className="flex flex-col sm:flex-row items-start sm:w-64 sm:items-center gap-2 w-full lg:w-auto break-words">
          <DateRangePicker
            granularity="day"
            className="w-full sm:w-64"
            value={{
              start: fromDate(dateRange.from, "UTC"),
              end: fromDate(dateRange.to, "UTC"),
            }}
            onChange={(value) => {
              if (value?.start && value?.end) {
                setDateRange({
                  from: value.start.toDate(),
                  to: value.end.toDate(),
                });
              }
            }}
          />
          <Button
            variant="bordered"
            color="primary"
            onPress={clearFilters}
            className="w-full sm:w-auto"
          >
            Limpiar filtros
          </Button>
        </div>

        {/* Orden + Export */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full lg:w-auto">
          <Select
            label="Ordenar por"
            value={order}
            onChange={(e) => setOrder(e.target.value as "asc" | "desc")}
            className="w-full sm:w-40"
          >
            <SelectItem key="asc" data-value="asc">
              Ascendente
            </SelectItem>
            <SelectItem key="desc" data-value="desc">
              Descendente
            </SelectItem>
          </Select>
          <Button
            color="success"
            onPress={exportToExcel}
            className="w-full sm:w-auto"
            startContent={<DownloadPdfIcon />}
          >
            Exportar Excel
          </Button>
          <Button
            color="danger"
            onPress={exportToPDF}
            startContent={<DownloadPdfIcon />}
            className="w-full sm:w-auto"
          >
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* -- Tabla -- */}
      {loading ? (
        <div className="text-center py-10">
          <Spinner color="danger" label="cargando datos..."/>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table isStriped className="min-w-full">
            <TableHeader>
              <TableColumn>Mentor</TableColumn>
              <TableColumn className="text-right">
                Asesorías Atendidas
              </TableColumn>
            </TableHeader>
            <TableBody>
              {sortedData.map((mentor) => (
                <TableRow key={mentor.advisorId}>
                  <TableCell className="flex items-center gap-3">
                    {mentor.profileImage ? (
                      <Image
                        alt={mentor.advisorName}
                        src={mentor.profileImage}
                        width={32}
                        height={32}
                        className="rounded-full object-cover border border-gray-300"
                      />
                    ) : (
                      <Avatar
                        name={mentor.advisorName}
                        className="bg-indigo-100 text-indigo-600 w-8 h-8"
                      />
                    )}
                    <span className="font-semibold">{mentor.advisorName}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Chip color="success" variant="flat">
                      {mentor.count}
                    </Chip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default MentorAttendanceTable;
