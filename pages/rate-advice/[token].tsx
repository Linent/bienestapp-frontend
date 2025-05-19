import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  validateFeedbackToken,
  submitFeedback,
} from "@/services/scheduleService";
import {
  Card,
  CardBody,
  CardHeader,
  Textarea,
  Button,
  Select,
  SelectItem,
  Spinner,
} from "@heroui/react";
import { ValidationResult } from "@/types";

export default function CalificarAsesoriaPage() {
  const router = useRouter();
  const { token } = router.query;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    validateFeedbackToken(token as string)
      .then((res) => {
        setData(res);
        setError(null);
      })
      .catch(() =>
        setError("El enlace ha expirado, es inválido o ya calificaste.")
      )
      .finally(() => setLoading(false));
  }, [token]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-60">
        <Spinner color="primary" size="lg" />
      </div>
    );
  if (error)
    return <div className="p-10 text-center text-red-500">{error}</div>;
  if (!data) return null;

  if (data.rated)
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold mb-2">
          ¡Ya calificaste esta asesoría!
        </h2>
        <p>Gracias por tu participación.</p>
      </div>
    );

  return (
    <div className="flex justify-center mt-10">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <h2 className="text-2xl font-bold">Califica tu asesoría</h2>
        </CardHeader>
        <CardBody>
          <div className="mb-2">
            <div>
              <b>Estudiante:</b> {data.studentName}
            </div>
            <div>
              <b>Asesor:</b> {data.advisorName}
            </div>
            <div>
              <b>Fecha:</b> {new Date(data.date).toLocaleString("es-CO")}
            </div>
            <div>
              <b>Tema:</b> {data.topic}
            </div>
          </div>
          <CalificacionForm scheduleId={data.scheduleId} />
        </CardBody>
      </Card>
    </div>
  );
}

// Formulario HeroUI
function CalificacionForm({ scheduleId }: { scheduleId: string }) {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState<number | "">("");
  const [success, setSuccess] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!rating) {
      setError("Selecciona una calificación.");
      return;
    }
    setSending(true);
    try {
      await submitFeedback(scheduleId, feedback, Number(rating));
      setSuccess(true);
    } catch {
      setError("Error al enviar la calificación. Intenta de nuevo.");
    }
    setSending(false);
  };

  if (success) {
    return (
      <div className="mt-6 text-green-700 font-bold">
        ¡Gracias por calificar tu asesoría!
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-3">
      <Select
        label="Calificación"
        selectedKeys={new Set([rating === "" ? "" : String(rating)])}
        onSelectionChange={(keys) => {
          const val = Array.from(keys)[0];
          setRating(val ? Number(val) : "");
        }}
        isRequired
        className="w-full"
      >
        {["", 5, 4, 3, 2, 1].map((n) => (
          <SelectItem key={String(n)}>
            {n === "" ? "Selecciona..." : `${n} ⭐`}
          </SelectItem>
        ))}
      </Select>
      <Textarea
        label="Comentarios (opcional)"
        value={feedback}
        onValueChange={setFeedback}
        placeholder="Comparte tus observaciones..."
        rows={3}
      />
      {error && <div className="text-red-500 mb-3">{error}</div>}
      <Button
        type="submit"
        color="primary"
        className="w-full"
        isLoading={sending}
      >
        {sending ? "Enviando..." : "Enviar calificación"}
      </Button>
    </form>
  );
}
