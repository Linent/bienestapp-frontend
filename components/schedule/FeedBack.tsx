import { Star } from "lucide-react";
import { Card, CardBody, CardHeader, Spinner } from "@heroui/react";
import { FeedbackListProps } from "@/types/types";
import { useFeedbacks } from "@/components/schedule/hooks/useFeedbacks";

const FeedbackList: React.FC<FeedbackListProps> = ({ mentorId }) => {
  const { feedbacks, loading, error } = useFeedbacks(mentorId);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        {mentorId ? "Feedbacks del mentor" : "Feedbacks de todas las asesorías"}
      </h2>
      {loading ? (
        <Spinner color="danger" label="cargando testimonios"/>
      ) : error ? (
        <div className="text-center text-danger">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {feedbacks.length === 0 && (
            <div className="col-span-full text-center text-gray-400">
              No hay registros
            </div>
          )}
          {feedbacks.map((fb) => (
            <Card key={fb._id} className="rounded-2xl shadow hover:shadow-xl transition-shadow duration-200 flex flex-col">
              <CardHeader className="bg-gray-100 rounded-t-2xl p-4 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-primary">
                    {fb.AdvisoryId?.advisorId?.name || "Sin mentor"}
                  </span>
                  <span className="text-xs text-gray-500 ml-auto">
                    {new Date(fb.dateStart).toLocaleDateString("es-CO", {
                      year: "numeric", month: "short", day: "2-digit",
                      hour: "2-digit", minute: "2-digit"
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {fb.rating
                    ? Array.from({ length: fb.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400" fill="yellow" />
                      ))
                    : <span className="text-xs text-gray-400">Sin calificación</span>}
                </div>
              </CardHeader>
              <CardBody className="flex flex-col gap-2 p-4">
                <div className="italic text-gray-700">{fb.feedback || <span className="text-gray-400">Sin comentario</span>}</div>
                <div className="text-xs text-gray-500 font-medium">
                  {fb.studentId?.name} ({fb.studentId?.email})
                </div>
                <div className="text-xs text-gray-400">Tema: {fb.topic}</div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackList;
