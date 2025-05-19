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
  Spinner,
  Skeleton,
  Alert,
} from "@heroui/react";
import ReactStars from "react-rating-stars-component";
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

  if (loading) {
    return (
      <div className="flex justify-center mt-12">
        <Card className="w-full max-w-lg space-y-5 p-6" radius="lg">
          <Skeleton className="rounded-lg">
            <div className="h-8 w-2/3 bg-default-200" />
          </Skeleton>
          <div className="space-y-3">
            <Skeleton className="w-4/5 rounded-lg">
              <div className="h-4 w-4/5 rounded-lg bg-default-200" />
            </Skeleton>
            <Skeleton className="w-3/5 rounded-lg">
              <div className="h-4 w-3/5 rounded-lg bg-default-300" />
            </Skeleton>
            <Skeleton className="w-2/5 rounded-lg">
              <div className="h-4 w-2/5 rounded-lg bg-default-200" />
            </Skeleton>
          </div>
          <Skeleton className="w-full h-12 rounded-lg" />
        </Card>
      </div>
    );
  }
  if (error)
    return (
      <div className="flex justify-center items-center mt-20">
        <Alert color="danger" title={error} />
      </div>
    );
  if (!data) return null;

  if (data.rated)
    return (
      <div className="flex justify-center items-center mt-20">
        <Alert
          color="primary"
          title="¡Ya calificaste esta asesoría! Gracias por tu participación."
        />
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

// Formulario HeroUI con calificación por estrellas
function CalificacionForm({ scheduleId }: { scheduleId: string }) {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState<number>(0);
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
      await submitFeedback(scheduleId, feedback, rating);
      setSuccess(true);
    } catch {
      setError("Error al enviar la calificación. Intenta de nuevo.");
    }
    setSending(false);
  };

  if (success) {
    return (
      <Alert
        color="success"
        title="¡Gracias por tu opinión!"
        description="Tu calificación fue enviada correctamente. ¡Apreciamos tu participación!"
        className="my-6"
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-3">
      {error && <Alert color="danger" title={error} className="mb-2" />}
      <div>
        <label className="block font-bold mb-1">Calificación:</label>
        <ReactStars
          count={5}
          value={rating}
          onChange={setRating}
          size={40}
          isHalf={false}
          activeColor="#00c9a7" // Color tipo HeroUI
          color="#cfd8dc" // Gris claro para estrellas vacías
          a11y={true}
        />
      </div>
      <Textarea
        label="Comentarios (opcional)"
        value={feedback}
        onValueChange={setFeedback}
        placeholder="Comparte tus observaciones..."
        rows={3}
      />
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
