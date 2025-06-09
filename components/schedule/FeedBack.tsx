import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import { Star, ChevronLeft, ChevronRight, Search } from "lucide-react";
import {
  Card,
  CardBody,
  CardHeader,
  Spinner,
  Button,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { FeedbackListProps, Feedback } from "@/types/types";
import { useFeedbacks } from "./hooks/useFeedbacks";

// Opciones de cantidad por página
const PAGE_SIZES = [10, 25, 50, 100, "all"] as const;

const FeedbackList: React.FC<FeedbackListProps> = ({ mentorId }) => {
  const { feedbacks, loading, error } = useFeedbacks(mentorId);
  const router = useRouter();

  // Detectar si es una vista de detalle de mentor o de "my"
  const hideSearch =
    router.pathname === "/feedback/[mentorId]" ||
    router.pathname === "/feedback/my";

  const [selectedStars, setSelectedStars] = useState<number | null>(null);
  const [searchMentor, setSearchMentor] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZES)[number]>(10);

  // Filtro en memoria
  const filteredFeedbacks = useMemo(() => {
    let arr = feedbacks;
    if (selectedStars !== null) {
      arr = arr.filter((f) => f.rating === selectedStars);
    }
    if (!hideSearch && searchMentor.trim() !== "") {
      arr = arr.filter((f) =>
        (f.AdvisoryId?.advisorId?.name || "")
          .toLowerCase()
          .includes(searchMentor.trim().toLowerCase())
      );
    }
    return arr;
  }, [feedbacks, selectedStars, searchMentor, hideSearch]);

  // Calcular páginas
  const totalRecords = filteredFeedbacks.length;
  const computedPageSize = pageSize === "all" ? totalRecords || 1 : pageSize;
  const maxPage = Math.ceil(totalRecords / computedPageSize) || 1;

  // Slice de los elementos a mostrar
  const paginated = useMemo(() => {
    if (pageSize === "all") return filteredFeedbacks;
    return filteredFeedbacks.slice(
      (page - 1) * computedPageSize,
      page * computedPageSize
    );
  }, [filteredFeedbacks, page, computedPageSize, pageSize]);

  useEffect(() => {
    setPage(1); // Reset a la primera página si cambian filtros o el tamaño de página
  }, [selectedStars, searchMentor, feedbacks, pageSize]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        {mentorId
          ? "Feedbacks del mentor"
          : "Testimonios de todas las asesorías"}
      </h2>

      {/* Filtros y paginación */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        {/* Solo renderiza el buscador si NO es feedback/my ni feedback/[mentorId] */}
        {!hideSearch && (
          <Input
            startContent={<Search />}
            placeholder="Buscar mentor..."
            value={searchMentor}
            onChange={(e) => setSearchMentor(e.target.value)}
            className="w-full md:w-60"
          />
        )}
        <Select
          label="Filtrar por estrellas"
          value={selectedStars?.toString() || ""}
          onChange={(e) =>
            setSelectedStars(e.target.value ? Number(e.target.value) : null)
          }
          className="w-full md:w-44"
        >
          <>
            {[5, 4, 3, 2, 1].map((num) => (
              <SelectItem key={num} data-value={num.toString()}>
                {`${num} ${num === 1 ? "estrella" : "estrellas"}`}
              </SelectItem>
            ))}
          </>
        </Select>
        <Select
          label="Registros por página"
          value={pageSize.toString()}
          onChange={(e) => {
            const val = e.target.value;
            if (!val) {
              setPageSize(10);
            } else {
              setPageSize(
                val === "all"
                  ? "all"
                  : (Number(val) as (typeof PAGE_SIZES)[number])
              );
            }
          }}
          className="w-full md:w-44"
        >
          {PAGE_SIZES.map((opt) => (
            <SelectItem key={opt.toString()} data-value={opt.toString()}>
              {opt === "all" ? "Todos" : opt}
            </SelectItem>
          ))}
        </Select>
      </div>

      {/* Listado */}
      {loading ? (
        <Spinner color="danger" label="Cargando testimonios..." />
      ) : error ? (
        <div className="text-center text-danger">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {paginated.length === 0 && (
              <div className="col-span-full text-center text-gray-400">
                No hay registros
              </div>
            )}
            {paginated.map((fb) => (
              <Card
                key={fb._id}
                className="rounded-2xl shadow hover:shadow-xl transition-shadow duration-200 flex flex-col"
              >
                <CardHeader className="bg-gray-100 rounded-t-2xl p-4 flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-primary">
                      {fb.AdvisoryId?.advisorId?.name || "Sin mentor"}
                    </span>
                    <span className="text-xs text-gray-500 ml-auto">
                      {new Date(fb.dateStart).toLocaleDateString("es-CO", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {fb.rating ? (
                      Array.from({ length: fb.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-yellow-400"
                          fill="yellow"
                        />
                      ))
                    ) : (
                      <span className="text-xs text-gray-400">
                        Sin calificación
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardBody className="flex flex-col gap-2 p-4">
                  <div className="italic text-gray-700">
                    {fb.feedback || (
                      <span className="text-gray-400">Sin comentario</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    {fb.studentId?.name} ({fb.studentId?.email})
                  </div>
                  <div className="text-xs text-gray-400">Tema: {fb.topic}</div>
                </CardBody>
              </Card>
            ))}
          </div>
          {/* Paginación */}
          {pageSize !== "all" &&
            filteredFeedbacks.length > computedPageSize && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button
                  isIconOnly
                  size="sm"
                  variant="bordered"
                  color="primary"
                  isDisabled={page === 1}
                  onPress={() => setPage((p) => Math.max(1, p - 1))}
                  aria-label="Anterior"
                >
                  <ChevronLeft />
                </Button>
                <span className="font-medium">
                  Página {page} de {maxPage}
                </span>
                <Button
                  isIconOnly
                  size="sm"
                  variant="bordered"
                  color="primary"
                  isDisabled={page === maxPage}
                  onPress={() => setPage((p) => Math.min(maxPage, p + 1))}
                  aria-label="Siguiente"
                >
                  <ChevronRight />
                </Button>
              </div>
            )}
        </>
      )}
    </div>
  );
};

export default FeedbackList;
