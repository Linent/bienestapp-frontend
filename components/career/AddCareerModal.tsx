import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Alert,
  Skeleton,
  addToast,
} from "@heroui/react";
import { createCareer } from "@/services/careerService";

interface AddCareerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddCareerModal: React.FC<AddCareerModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [enable, setEnable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSave = async () => {
    if (!name || !code) {
      setError("Por favor, complete todos los campos.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      await createCareer({ name, code, enable });
      setName("");
      setCode("");
      setEnable(true);
      onClose();
      onSuccess();
      addToast({
        title: "Carrera creada",
        description: "La carrera se ha creado exitosamente.",
        color: "success",
      });
    } catch (err) {
      setError("Error al registrar la carrera. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} placement="top-center" onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Agregar Carrera</ModalHeader>
        <ModalBody>
          {loading ? (
            <>
              <Skeleton className="h-10 w-full mb-4" />
              <Skeleton className="h-10 w-full" />
            </>
          ) : (
            <>
              <Input
                label="Código"
                placeholder="Ingrese el código de la carrera"
                variant="bordered"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                isRequired
              />
              <Input
                label="Nombre"
                placeholder="Ingrese el nombre de la carrera"
                variant="bordered"
                value={name}
                onChange={(e) => setName(e.target.value)}
                isRequired
              />
            </>
          )}
          {error && (
            <Alert color="warning" variant="solid" className="mt-4">
              {error}
            </Alert>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="flat" onPress={onClose}>
            Cancelar
          </Button>
          <Button color="primary" onPress={handleSave} isLoading={loading}>
            Guardar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddCareerModal;
