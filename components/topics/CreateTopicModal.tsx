// components/topics/CreateTopicModal.tsx
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Input,
  Textarea,
  Button,
} from "@heroui/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { createTopic } from "@/services/topicService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreateSuccess: () => void;
}

const CreateTopicModal: React.FC<Props> = ({ isOpen, onClose, onCreateSuccess }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async () => {
    if (!name || !description || !keywords || !file) {
      toast.error("Todos los campos son obligatorios, incluyendo el PDF.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("keywords", keywords); // puede ser string, el backend lo parsea
    formData.append("file", file);

    try {
      setIsSubmitting(true);
      await createTopic(formData);
      toast.success("Tema creado correctamente");
      onCreateSuccess();
      onClose();
      setName("");
      setDescription("");
      setKeywords("");
      setFile(null);
    } catch (error) {
      console.error(error);
      toast.error("Error al crear el tema");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader>Crear nuevo Tema</ModalHeader>
        <ModalBody>
          <Input
            label="Nombre del tema"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Textarea
            label="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Textarea
            label="Palabras clave (separadas por coma)"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
          <Input
            type="file"
            accept=".pdf"
            label="Subir archivo PDF"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={onClose}>
            Cancelar
          </Button>
          <Button
            color="primary"
            onPress={handleCreate}
            isLoading={isSubmitting}
          >
            Crear Tema
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateTopicModal;
