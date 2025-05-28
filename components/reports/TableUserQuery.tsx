import React, { useEffect, useState, useMemo } from "react";
import { fetchAllUserQueries } from "@/services/reportService";
import { fetchCareerByCode } from "@/services/careerService";
import { Download, FileDown, X } from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Select, SelectItem, Spinner, Button, DateRangePicker
} from "@heroui/react";
import { parseDate, today } from "@internationalized/date";


const COLUMNS = [
  { key: "fullName", label: "Nombre completo" },
  { key: "documentType", label: "Tipo de documento" },
  { key: "documentNumber", label: "Nro. documento" },
  { key: "ufpsCode", label: "Código UFPS" },
  { key: "beneficiaryType", label: "Tipo de beneficiario" },
  { key: "academicProgram", label: "Programa / Dependencia" },
  { key: "rawQuery", label: "Pregunta" },
  { key: "topicKey", label: "Tema detectado" },
  { key: "createdAt", label: "Fecha" },
];

const PAGE_SIZE_OPTIONS = [
  { key: "10", label: "10" },
  { key: "25", label: "25" },
  { key: "50", label: "50" },
  { key: "100", label: "100" },
  { key: "Todos", label: "Todos" },
];

const DEFAULT_PAGE_SIZE = "10";
const DEFAULT_BENEFICIARY = "Todos";
const DEFAULT_CAREER = "Todas";
const DEFAULT_RANGE = {
  start: today("UTC").subtract({ days: 30 }),
  end: today("UTC")
};

type UserQuery = {
  _id: string;
  userId?: {
    fullName?: string;
    documentType?: string;
    documentNumber?: string;
    ufpsCode?: string;
    beneficiaryType?: string;
    academicProgram?: string;
  };
  rawQuery?: string;
  topicId?: {
    name?: string;
  };
  createdAt?: string;
};

function flattenQueries(queries: UserQuery[] = []) {
  return queries.map((q) => ({
    key: q._id,
    fullName: q.userId?.fullName ?? "",
    documentType: q.userId?.documentType ?? "",
    documentNumber: q.userId?.documentNumber ?? "",
    ufpsCode: q.userId?.ufpsCode ?? "",
    beneficiaryType: q.userId?.beneficiaryType ?? "",
    academicProgram: q.userId?.academicProgram ?? "",
    rawQuery: q.rawQuery ?? "",
    topicKey: q.topicId && q.topicId.name ? q.topicId.name : "Sin tema",
    createdAt: q.createdAt?.slice(0, 10) ?? "",
  }));
}

const getBeneficiaryTypes = (data: { beneficiaryType?: string }[] = []) => {
  const types = new Set<string>();
  data.forEach((q) => {
    if (q.beneficiaryType) types.add(q.beneficiaryType);
  });
  return Array.from(types);
};

export default function TableUserQuery() {
  const [queries, setQueries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [beneficiary, setBeneficiary] = useState(DEFAULT_BENEFICIARY);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [page, setPage] = useState(1);
  const [dateRange, setDateRange] = useState(DEFAULT_RANGE);

  // Estado para el filtro de carreras dinámicas
  const [careerFilter, setCareerFilter] = useState(DEFAULT_CAREER);
  const [careerOptions, setCareerOptions] = useState<{ code: string, name: string }[]>([]);

  // Fetch Data
  useEffect(() => {
    setLoading(true);
    fetchAllUserQueries()
      .then((data) => setQueries(flattenQueries(data)))
      .finally(() => setLoading(false));
  }, []);

  // Beneficiary filter
  const beneficiaryTypes = useMemo(
    () => [DEFAULT_BENEFICIARY, ...getBeneficiaryTypes(queries)],
    [queries]
  );

  // Filtro de fechas
  const filteredByDate = useMemo(() => {
    if (!dateRange?.start || !dateRange?.end) return queries;
    return queries.filter((q) => {
      if (!q.createdAt) return false;
      const qDate = parseDate(q.createdAt);
      return (
        (qDate.compare(dateRange.start) > 0 || qDate.compare(dateRange.start) === 0) &&
        (qDate.compare(dateRange.end) < 0 || qDate.compare(dateRange.end) === 0)
      );
    });
  }, [queries, dateRange]);

  // Filtro por beneficiario
  const filtered = useMemo(
    () =>
      beneficiary === DEFAULT_BENEFICIARY
        ? filteredByDate
        : filteredByDate.filter((q) => q.beneficiaryType === beneficiary),
    [filteredByDate, beneficiary]
  );

  // Obtén los códigos únicos de 3 dígitos de los registros filtrados
  const codesSet = useMemo(() => {
    const set = new Set<string>();
    filtered.forEach(q => {
      if (q.ufpsCode && q.ufpsCode.length === 7) {
        set.add(q.ufpsCode.substring(0, 3));
      }
    });
    return Array.from(set);
  }, [filtered]);

  // Busca las carreras existentes para esos códigos (solo una vez por código)
  useEffect(() => {
    let isMounted = true;
    if (codesSet.length === 0) {
      setCareerOptions([]);
      return;
    }
    Promise.all(
      codesSet.map(async code => {
        const career = await fetchCareerByCode(code);
        return career ? { code: career.code, name: career.name } : null;
      })
    ).then(results => {
      if (!isMounted) return;
      const carrerasFiltradas = results.filter(Boolean) as { code: string, name: string }[];
      // Sin repeticiones
      const sinRepetir = Array.from(
        new Map(carrerasFiltradas.map(c => [c.code, c])).values()
      );
      setCareerOptions(sinRepetir);
    });
    return () => { isMounted = false };
  }, [codesSet]);

  // Filtro por carrera seleccionada
  const filteredByCareer = useMemo(() => {
    if (careerFilter === DEFAULT_CAREER) return filtered;
    return filtered.filter(q => q.ufpsCode && q.ufpsCode.length === 7 && q.ufpsCode.substring(0, 3) === careerFilter);
  }, [filtered, careerFilter]);

  // Paginación
  const numericPageSize =
    pageSize === "Todos" ? filteredByCareer.length : parseInt(pageSize, 10) || 25;
  const pageCount = Math.ceil(filteredByCareer.length / numericPageSize) || 1;
  const pageData =
    pageSize === "Todos"
      ? filteredByCareer
      : filteredByCareer.slice((page - 1) * numericPageSize, page * numericPageSize);

  // Limpiar filtros
  const handleResetFilters = () => {
    setBeneficiary(DEFAULT_BENEFICIARY);
    setCareerFilter(DEFAULT_CAREER);
    setPageSize(DEFAULT_PAGE_SIZE);
    setDateRange(DEFAULT_RANGE);
    setPage(1);
  };

  // Solo exportar las columnas definidas en COLUMNS (sin 'key')
  const exportRows = pageData.map(row => {
    const filtered: Record<string, any> = {};
    COLUMNS.forEach(col => { filtered[col.key] = row[col.key]; });
    return filtered;
  });

  // Exportar a Excel
  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(exportRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Consultas");
    XLSX.writeFile(wb, "consultas_chatbot.xlsx");
  };

  // Exportar a PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [COLUMNS.map((c) => c.label)],
      body: exportRows.map(row => COLUMNS.map(col => row[col.key] ?? "")),
      styles: { fontSize: 8 },
    });
    doc.save("consultas_chatbot.pdf");
  };

  // Reset page cuando cambia filtro/pageSize
  useEffect(() => setPage(1), [beneficiary, careerFilter, pageSize, dateRange]);

  return (
    <div className="bg-white rounded-2xl p-6 border shadow-sm">
      {/* Header filtros */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold">
            Consulta, filtra y exporta tus registros
          </h2>
          <span className="text-gray-400 text-sm">
            Administración de datos de usuarios de chatbot
          </span>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {/* Filtro beneficiario */}
          <Select
            label="Filtrar por beneficiario"
            className="w-full sm:w-52"
            selectedKeys={new Set([beneficiary])}
            onSelectionChange={(keys) =>
              setBeneficiary(String(Array.from(keys)[0] ?? DEFAULT_BENEFICIARY))
            }
            items={beneficiaryTypes.map((t) => ({
              key: t,
              label: t,
            }))}
          >
            {(item) => (
              <SelectItem key={item.key} data-value={item.key}>
                {item.label}
              </SelectItem>
            )}
          </Select>

          {/* Filtro carrera dinámico */}
          <Select
            label="Filtrar por carrera"
            className="w-full sm:w-56"
            selectedKeys={new Set([careerFilter])}
            onSelectionChange={(keys) =>
              setCareerFilter(String(Array.from(keys)[0] ?? DEFAULT_CAREER))
            }
            items={[
              { key: DEFAULT_CAREER, label: "Todas las carreras" },
              ...careerOptions.map(c => ({ key: c.code, label: c.name }))
            ]}
          >
            {(item) => (
              <SelectItem key={item.key} data-value={item.key}>
                {item.label}
              </SelectItem>
            )}
          </Select>

          {/* Filtro de Rango de Fechas */}
          <DateRangePicker
            className="w-full sm:w-64"
            label="Filtrar por fechas"
            value={dateRange}
            onChange={(value) => {
              if (value) setDateRange(value);
            }}
            isRequired
          />

          {/* Limpiar */}
          <Button
            color="secondary"
            variant="solid"
            className="font-semibold"
            onClick={handleResetFilters}
            startContent={<X size={18} />}
          >
            Limpiar filtros
          </Button>
          <Button
            color="danger"
            variant="solid"
            className="font-semibold"
            onClick={handleExportPDF}
            startContent={<FileDown size={18} />}
          >
            Exportar PDF
          </Button>
          <Button
            color="success"
            variant="solid"
            className="font-semibold"
            onClick={handleExportExcel}
            startContent={<Download size={18} />}
          >
            Exportar Excel
          </Button>
        </div>
      </div>

      {/* Tamaño de página */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-gray-500 font-medium">Mostrar:</span>
        <Select
          className="w-24"
          selectedKeys={new Set([pageSize])}
          onSelectionChange={(keys) => {
            const next = Array.from(keys)[0] ?? DEFAULT_PAGE_SIZE;
            setPageSize(String(next));
            setPage(1);
          }}
          items={PAGE_SIZE_OPTIONS}
        >
          {(item) => (
            <SelectItem key={item.key} data-value={item.key}>
              {item.label}
            </SelectItem>
          )}
        </Select>
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="py-12 flex justify-center items-center">
          <Spinner color="primary" size="lg" />
        </div>
      ) : (
        <Table aria-label="Consultas de usuarios">
          <TableHeader>
            {COLUMNS.map((column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            ))}
          </TableHeader>
          <TableBody>
            {pageData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={COLUMNS.length}
                  className="text-center text-gray-400 py-6"
                >
                  No hay registros para mostrar.
                </TableCell>
              </TableRow>
            ) : (
              pageData.map((row) => (
                <TableRow key={row.key}>
                  {COLUMNS.map((col) => (
                    <TableCell key={col.key}>
                      {["beneficiaryType", "topicKey"].includes(col.key)
                        ? row[col.key] || (col.key === "topicKey" ? "Sin tema" : "-")
                        : row[col.key] || "-"}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      {/* Paginación */}
      {pageSize !== "Todos" && pageCount > 1 && (
        <div className="flex justify-between items-center mt-4 flex-wrap gap-2">
          <Button
            size="sm"
            color="secondary"
            variant="bordered"
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
            color="secondary"
            variant="bordered"
            disabled={page >= pageCount}
            onPress={() => setPage((p) => Math.min(pageCount, p + 1))}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
}
