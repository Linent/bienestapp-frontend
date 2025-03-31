import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
  Skeleton,
} from "@heroui/react";
import { fetchCareerById, updateCareer } from "@/services/careerService";
import toast from "react-hot-toast";

interface EditCareerModalProps {
  isOpen: boolean;
  onClose: () => void;
  careerId: string;
  onUpdateSuccess: () => void;
}

const EditCareerModal: React.FC<EditCareerModalProps> = ({
  isOpen,
  onClose,
  careerId,
  onUpdateSuccess,
}) => {
  const [career, setCareer] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const careerData = await fetchCareerById(careerId);
          setCareer(careerData);
        } catch (error) {
          console.error("Error al obtener datos de la carrera:", error);
          toast.error("No se pudo cargar la información de la carrera.");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [isOpen, careerId]);

  const handleUpdate = async () => {
    if (!career) return;
    setUpdating(true);
    try {
      const updatedCareer = Object.keys(career).reduce((acc, key) => {
        if (career[key] !== "") acc[key] = career[key];
        return acc;
      }, {} as any);

      await updateCareer(careerId, updatedCareer);
      toast.success("Carrera actualizada correctamente");
      onUpdateSuccess();
      onClose();
    } catch (error) {
      console.error("Error al actualizar carrera:", error);
      toast.error("Hubo un error al actualizar la carrera");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-lg">
      <ModalContent>
        <ModalHeader>Editar Carrera</ModalHeader>
        <ModalBody>
          {loading ? (
            <Skeleton className="h-10 w-full mb-3" />
          ) : (
            <>
              <Input
                label="Nombre de la Carrera"
                value={career?.name || ""}
                onChange={(e) => setCareer({ ...career, name: e.target.value })}
              />
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onPress={onClose} variant="flat">
            Cancelar
          </Button>
          <Button color="primary" onPress={handleUpdate} isLoading={updating}>
            Guardar Cambios
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditCareerModal;
