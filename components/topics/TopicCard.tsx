import { Card, CardBody, Button } from "@heroui/react";
import { Topic } from "@/types";
import { BACKEND_URL } from "@/config";

interface Props {
  topic: Topic;
  onEdit: () => void;
  onDelete: (id: string) => void;
}

const TopicCard: React.FC<Props> = ({ topic, onEdit, onDelete }) => {
  const pdfUrl = `${BACKEND_URL}/${topic.filePath}`;

  return (
    <Card className="shadow-md">
      <CardBody>
        <h3 className="text-lg font-bold mb-2">{topic.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{topic.description}</p>
        <p className="text-sm text-gray-500 mb-4">
          Palabras clave:{" "}
          <span className="italic">{topic.keywords.join(", ")}</span>
        </p>
        <div className="flex flex-wrap gap-2 justify-end">
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="light" color="primary">
              Ver documento
            </Button>
          </a>
          <Button variant="ghost" color="warning" onPress={onEdit}>
            Editar
          </Button>
          <Button
            variant="ghost"
            color="danger"
            onPress={() => onDelete(topic._id)}
          >
            Eliminar
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default TopicCard;
