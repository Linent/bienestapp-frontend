// pages/topics/index.tsx
import { useEffect, useState } from "react";
import { Topic } from "@/types";
import { fetchTopics, deleteTopicById } from "@/services/topicService";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Divider,
  Spinner,
} from "@heroui/react";
import toast from "react-hot-toast";
import TopicCard from "@/components/topics/TopicCard";
import CreateTopicModal from "@/components/topics/CreateTopicModal";
import EditTopicModal from "@/components/topics/EditTopicModal";
import DefaultLayout from "@/layouts/default";
import { title } from "@/components/primitives";

const TopicsPage = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);

  const loadTopics = async () => {
    try {
      setLoading(true);
      const data = await fetchTopics();
      setTopics(data);
    } catch (error) {
      toast.error("Error al cargar los temas");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTopicById(id);
      toast.success("Tema eliminado");
      loadTopics();
    } catch {
      toast.error("Error al eliminar el tema");
    }
  };

  useEffect(() => {
    loadTopics();
  }, []);

  return (
    <DefaultLayout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Card className="shadow-md">
          <CardHeader className="flex justify-between items-center">
            <h1 className={title()}>Gestión de Temas</h1>
            <Button color="primary" onPress={() => setIsCreateOpen(true)}>
              + Nuevo Tema
            </Button>
          </CardHeader>

          <Divider />

          <CardBody>
            {loading ? (
              <div className="flex justify-center py-12">
                <Spinner label="Cargando temas..." color="primary" />
              </div>
            ) : topics.length === 0 ? (
              <p className="text-center text-gray-500">
                No hay temas registrados.
              </p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {topics.map((topic) => (
                  <TopicCard
                    key={topic._id}
                    topic={topic}
                    onEdit={() => setEditingTopic(topic)}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Modales */}
        {isCreateOpen && (
          <CreateTopicModal
            isOpen={isCreateOpen}
            onClose={() => setIsCreateOpen(false)}
            onCreateSuccess={loadTopics}
          />
        )}
        {editingTopic && (
          <EditTopicModal
            topic={editingTopic}
            onClose={() => setEditingTopic(null)}
            onUpdateSuccess={loadTopics}
          />
        )}
      </div>
    </DefaultLayout>
  );
};

export default TopicsPage;
