import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import {
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableRow,
  Button,
  TableColumn,
  Divider,
  Tooltip,
  Spinner,
} from "@heroui/react";

import {
  PlusIcon,
  CloseIcon,
  EditIcon,
  EyeIcon,
  BackArrowIcon,
} from "@/components/icons/ActionIcons";

import EditObservationModal from "@/components/schedule/EditObservationModal";
import ViewObservationModal from "@/components/schedule/ViewObservationModal";

import {
  fetchStudentsByAdvisory,
  updateAttendance,
} from "@/services/scheduleService";
import { Student } from "@/types";
import DefaultLayout from "@/layouts/default";
import { title } from "@/components/primitives";

const StudentsByAdvisory = () => {
  const router = useRouter();
  const { advisoryId, day, dateStart } = router.query as {
    advisoryId: string;
    day: string;
    dateStart: string;
  };

  const [students, setStudents] = useState<Student[]>([]);
  const [mentorName, setMentorName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingSchedule, setEditingSchedule] = useState<any>(null);
  const [viewingObservation, setViewingObservation] = useState<string | null>(null);

  const canEditAttendance = (start: Date) => {
  const now = new Date();
  const startWindow = new Date(start.getTime() - 10 * 60 * 1000); // 10 min antes
  const endWindow = new Date(start.getTime() + (2 * 60 + 30) * 60 * 1000); // 2 horas 30 min después

  return now >= startWindow && now <= endWindow;
};

  useEffect(() => {
    const loadStudents = async () => {
      if (!router.isReady || !advisoryId || !day || !dateStart) return;

      try {
        const data = await fetchStudentsByAdvisory(advisoryId, day, dateStart);
        if (Array.isArray(data)) {
          setStudents(data);
          setMentorName(data[0]?.AdvisoryId?.advisorId?.name || "");
          setError(null);
        } else {
          throw new Error("Formato de datos inválido");
        }
      } catch (err: any) {
        const apiMessage = err?.response?.data?.message;
        if (err.response?.status === 400 && apiMessage === "schedules.is_empty") {
          setError("No hay estudiantes inscritos para esta asesoría.");
          setStudents([]);
        } else {
          console.error("Error al obtener estudiantes:", err);
          setError("No se pudo cargar la lista de estudiantes.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, [router.isReady, advisoryId, day, dateStart]);

  const handleToggleAttendance = async (
    scheduleId: string,
    currentStatus: boolean
  ) => {
    try {
      const updated = await updateAttendance(scheduleId, !currentStatus);
      setStudents((prev) =>
        prev.map((s) =>
          s._id === scheduleId ? { ...s, attendance: updated.attendance } : s
        )
      );
    } catch (error) {
      console.error("Error al actualizar asistencia:", error);
    }
  };

  return (
    <DefaultLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className={title()}>Estudiantes Agendados</h2>
          <Button color="primary" onPress={() => router.back()} startContent={<BackArrowIcon />}>
            Volver
          </Button>
        </div>

        {mentorName && (
          <p className="text-lg text-gray-600 mt-1 mb-4">
            Mentor: <span className="font-medium">{mentorName}</span>
          </p>
        )}

        <Divider className="my-4" />

        {loading ? (
          <Spinner color="danger" label="Cargando estudiantes..." />
        ) : error ? (
          <div className="text-center text-gray-600 border rounded-lg py-6">
            <p>{error}</p>
          </div>
        ) : (
          <div className="overflow-x-auto border rounded-lg">
            <Table>
              <TableHeader>
                <TableColumn>Nombre</TableColumn>
                <TableColumn>Código</TableColumn>
                <TableColumn>Email</TableColumn>
                <TableColumn>Carrera</TableColumn>
                <TableColumn>Tema</TableColumn>
                <TableColumn>Hora</TableColumn>
                <TableColumn>Acciones</TableColumn>
                <TableColumn>Asistencia</TableColumn>
              </TableHeader>
              <TableBody>
                {students.map((s) => (
                  <TableRow key={s._id}>
                    <TableCell className="capitalize">
                      {s.studentId.name}
                    </TableCell>
                    <TableCell>{s.studentId.codigo}</TableCell>
                    <TableCell>{s.studentId.email}</TableCell>
                    <TableCell>{s.studentId.career.name}</TableCell>
                    <TableCell>{s.topic}</TableCell>
                    <TableCell width={100}>
                      {new Date(s.dateStart).toLocaleTimeString("es-CO", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="flex gap-2 items-center">
                      <Tooltip content="Agregar observación">
                        <button
                          aria-label="Agregar observación"
                          className="cursor-pointer text-default-400 hover:text-warning"
                          onClick={() => setEditingSchedule(s)}
                        >
                          <EditIcon />
                        </button>
                      </Tooltip>
                      {s.observation && s.observation.trim() !== "" && (
                        <Tooltip content="Ver observación">
                          <button
                            aria-label="Ver observación"
                            className="cursor-pointer text-default-400 hover:text-primary"
                            onClick={() => setViewingObservation(s.observation)}
                          >
                            <EyeIcon />
                          </button>
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        color={s.attendance ? "success" : "danger"}
                        onPress={() =>
                          handleToggleAttendance(s._id, s.attendance)
                        }
                        className="flex items-center gap-1"
                        isDisabled={!canEditAttendance(new Date(dateStart))}
                      >
                        {s.attendance ? (
                          <>
                            <PlusIcon /> <span>Presente</span>
                          </>
                        ) : (
                          <>
                            <CloseIcon /> <span>Ausente</span>
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          {editingSchedule && (
            <EditObservationModal
              isOpen={!!editingSchedule}
              scheduleId={editingSchedule._id}
              initialObservation={editingSchedule.observation || ""}
              onClose={() => setEditingSchedule(null)}
              onUpdateSuccess={() => {
                setEditingSchedule(null);
                router.reload(); // Recarga para ver los cambios
              }}
            />
          )}
          {viewingObservation && (
            <ViewObservationModal
              isOpen={!!viewingObservation}
              observation={viewingObservation}
              onClose={() => setViewingObservation(null)}
            />
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default StudentsByAdvisory;
