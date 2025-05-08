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
} from "@heroui/react";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStudents = async () => {
      if (!router.isReady || !advisoryId || !day || !dateStart) return;

      try {
        const data = await fetchStudentsByAdvisory(advisoryId, day, dateStart);

        if (Array.isArray(data)) {
          setStudents(data);
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
        <h2 className={title()}>Estudiantes Agendados</h2>
        <Divider className="my-4" />
        {loading ? (
          <p>Cargando estudiantes...</p>
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
                    <TableCell>
                      <Button
                        size="sm"
                        color={s.attendance ? "success" : "danger"}
                        onPress={() =>
                          handleToggleAttendance(s._id, s.attendance)
                        }
                        className="flex items-center gap-1"
                      >
                        {s.attendance ? (
                          <>
                            ✅ <span>Presente</span>
                          </>
                        ) : (
                          <>
                            ❌ <span>Ausente</span>
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
          <Button color="primary" onPress={() => router.back()}>
            Volver
          </Button>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default StudentsByAdvisory;
