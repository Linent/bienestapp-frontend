// components/topics/EditTopicModal.tsx
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Input,
  Button,
  Textarea,
} from "@heroui/react";
import { useState } from "react";
import { updateTopicById } from "@/services/topicService";
import { Topic } from "@/types";
import toast from "react-hot-toast";

interface Props {
  topic: Topic;
  onClose: () => void;
  onUpdateSuccess: () => void;
}

const EditTopicModal: React.FC<Props> = ({ topic, onClose, onUpdateSuccess }) => {
  const [name, setName] = useState(topic.name);
  const [description, setDescription] = useState(topic.description);
  const [keywords, setKeywords] = useState(topic.keywords.join(", "));
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async () => {
    if (!name || !description || !keywords) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("keywords", keywords);
    if (file) {
      formData.append("file", file);
    }

    setIsLoading(true);
    try {
      await updateTopicById(topic._id, formData);
      toast.success("Tema actualizado correctamente");
      onUpdateSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar el tema");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader>
            <h1>Editar Tema</h1>
            </ModalHeader>
        <ModalBody>
            <h2>edita los campos que sean necesario modificar</h2>
          <Input
            label="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Textarea
            label="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <Textarea
            label="Palabras clave (separadas por coma)"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            required
          />
          <Input
            type="file"
            accept=".pdf"
            label="Reemplazar archivo PDF"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={onClose}>
            Cancelar
          </Button>
          <Button color="primary" onPress={handleUpdate} isLoading={isLoading}>
            Guardar cambios
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditTopicModal;
