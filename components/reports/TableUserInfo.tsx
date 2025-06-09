// components/TableUserInfo.tsx
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
  Spinner,
  Button,
} from "@heroui/react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { fetchAllUserInfo } from "@/services/userInfoService";
import { UserInfo } from "@/types/types";
import { DownloadPdfIcon, UploadIcon } from "@/components/icons/ActionIcons";

const columnas = [
  { key: "fullName", label: "Nombre completo" },
  { key: "documentType", label: "Tipo de documento" },
  { key: "documentNumber", label: "Nro. documento" },
  { key: "ufpsCode", label: "Código UFPS" },
  { key: "beneficiaryType", label: "Tipo de beneficiario" },
  { key: "academicProgram", label: "Programa / Dependencia" },
];

const tiposBeneficiario = [
  "Estudiante UFPS",
  "Egresado(a) UFPS",
  "Docente UFPS",
  "Personal Administrativo UFPS",
  "Externo(a) a la UFPS",
];

const pageSizeOptions = [
  { key: "25", label: "25" },
  { key: "50", label: "50" },
  { key: "100", label: "100" },
  { key: "all", label: "Todos" },
];

export default function TableUserInfo() {
  const [data, setData] = useState<UserInfo[]>([]);
  const [filterType, setFilterType] = useState<string>("todos");
  const [loading, setLoading] = useState<boolean>(true);
  const [pageSize, setPageSize] = useState<string>("25");
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    (async () => {
      try {
        const result = await fetchAllUserInfo();
        setData(result);
      } catch (err) {
        console.error("Error al obtener registros", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filtrado
  const filteredData =
    filterType === "todos"
      ? data
      : data.filter((item) => item.beneficiaryType === filterType);

  // Paginación
  const numericSize =
    pageSize === "all" ? filteredData.length : parseInt(pageSize, 10);
  const pageCount = Math.ceil(filteredData.length / numericSize) || 1;
  const paginatedData =
    pageSize === "all"
      ? filteredData
      : filteredData.slice((page - 1) * numericSize, page * numericSize);

  // Capitalizar
  const capitalize = (s: string) =>
    s
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");

  // Export PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Registros de Bienestar Universitario", 14, 16);
    doc.setFontSize(11);
    doc.text(`Total de registros: ${filteredData.length}`, 14, 24);

    autoTable(doc, {
      startY: 30,
      head: [columnas.map((c) => c.label)],
      body: filteredData.map((item) => [
        capitalize(item.fullName),
        item.documentType,
        item.documentNumber,
        item.ufpsCode,
        item.beneficiaryType,
        item.academicProgram,
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: "#7c3aed" },
    });

    doc.save("registros_bienestar.pdf");
  };

  // Export CSV
  const exportToExcel = () => {
  // Procesar los datos: cortar el nombre en 4 columnas
  const excelData = filteredData.map((item) => {
    const nameParts = (item.fullName || "").split(" ").slice(0, 4);
    while (nameParts.length < 4) nameParts.push("");
    return [
      nameParts[0], // Nombre 1
      nameParts[1], // Nombre 2
      nameParts[2], // Nombre 3
      nameParts[3], // Nombre 4
      item.documentType,
      item.documentNumber,
      item.ufpsCode,
      item.beneficiaryType,
      item.academicProgram,
    ];
  });

  // Cabeceras para el Excel
  const headers = [
    "Nombre 1",
    "Nombre 2",
    "Nombre 1",
    "Nombre 4",
    "Tipo de documento",
    "Nro. documento",
    "Código UFPS",
    "Tipo de beneficiario",
    "Programa / Dependencia",
  ];

  // (Opcional) Agregar una fila fusionada como título general
  const aoa = [
    ["NOMBRE COMPLETO", "", "", "", ...headers.slice(4)], // Fila 1, fusiona las 4 primeras celdas
    headers,                                               // Fila 2, cabeceras reales
    ...excelData,                                          // Fila 3 en adelante, los datos
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(aoa);

  // Fusionar A1:D1 para el título "NOMBRE COMPLETO"
  worksheet["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }, // A1:D1
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Registros");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, "registros_bienestar.xlsx");
};

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">
            Consulta, filtra y exporta tus registros
          </h2>
          <p className="text-gray-600">Administración de datos de usuarios de chatbot</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Select
            label="Filtrar por beneficiario"
            className="w-full sm:w-60"
            selectedKeys={new Set([filterType])}
            onSelectionChange={(keys) =>
              setFilterType(String(Array.from(keys)[0] ?? "todos"))
            }
            items={[
              { key: "todos", label: "Todos" },
              ...tiposBeneficiario.map((t) => ({ key: t, label: t })),
            ]}
          >
            {(item) => (
              <SelectItem key={item.key} data-value={item.key}>
                {item.label}
              </SelectItem>
            )}
          </Select>

          <Button
            color="danger"
            onPress={exportToPDF}
            startContent={<DownloadPdfIcon />}
            className="w-full sm:w-auto"
          >
            Exportar PDF
          </Button>
          <Button
            color="success"
            onPress={exportToExcel}
            startContent={<DownloadPdfIcon />}
            className="w-full sm:w-auto"
          >
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Tamaño de página */}
      <div className="flex justify-end items-center gap-2">
        <span>Mostrar:</span>
        <Select
          className="w-24"
          selectedKeys={new Set([pageSize])}
          onSelectionChange={(keys) => {
            const next = Array.from(keys)[0] ?? "25";
            setPageSize(String(next));
            setPage(1);
          }}
          items={pageSizeOptions}
        >
          {(item) => (
            <SelectItem key={item.key} data-value={item.key}>
              {item.label}
            </SelectItem>
          )}
        </Select>
      </div>

      {/* Contenido */}
      {loading ? (
        <div className="text-center py-10">
          <Spinner color="danger" label="cargando consultores..." />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto border-gray-300 rounded-lg">
            <Table className="min-w-full">
              <TableHeader>
                {columnas.map((col) => (
                  <TableColumn key={col.key}>{col.label}</TableColumn>
                ))}
              </TableHeader>
              <TableBody<UserInfo>
                items={paginatedData.map((item) => ({
                  key: item._id,
                  ...item,
                }))}
              >
                {(item) => (
                  <TableRow key={item._id}>
                    <TableCell>{capitalize(item.fullName)}</TableCell>
                    <TableCell>{item.documentType}</TableCell>
                    <TableCell>{item.documentNumber}</TableCell>
                    <TableCell>{item.ufpsCode}</TableCell>
                    <TableCell>{item.beneficiaryType}</TableCell>
                    <TableCell>{item.academicProgram}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Paginación */}
          {filteredData.length > numericSize && (
            <div className="flex justify-between items-center mt-4 flex-wrap gap-2">
              <Button
                size="sm"
                disabled={page <= 1}
                onPress={() => setPage((p) => Math.max(1, p - 1))}
              >
                Anterior
              </Button>
              <span className="text-sm">
                Página {page} de {pageCount}
              </span>
              <Button
                size="sm"
                disabled={page >= pageCount}
                onPress={() => setPage((p) => Math.min(pageCount, p + 1))}
              >
                Siguiente
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
