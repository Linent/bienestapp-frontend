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
import toast from "react-hot-toast";

import { fetchCareerById, updateCareer } from "@/services/careerService";

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

      const result = await updateCareer(careerId, updatedCareer);
      if (result.success) {
        toast.success("Carrera actualizada correctamente");
        onUpdateSuccess();
        onClose();
      } else {
        toast.error(result.message || "No se pudo actualizar la carrera");
      }
    } catch (error) {
      console.error("Error al actualizar carrera:", error);
      toast.error("Hubo un error al actualizar la carrera");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Modal className="w-full max-w-lg" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Editar Carrera</ModalHeader>
        <ModalBody>
          {loading ? (
            <Skeleton className="h-10 w-full mb-3" />
          ) : (
            <>
              <Input
                label="Carrera"
                placeholder="Ingrese el nombre de la carrera"
                value={career?.name || ""}
                onChange={(e) => setCareer({ ...career, name: e.target.value })}
              />
              
              <Input
                label="Código"
                placeholder="Ingrese el código de la Carrera"
                value={career?.code || ""}
                onChange={(e) => setCareer({ ...career, code: e.target.value })}
                className="mt-4"
              />
              
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="flat" onPress={onClose}>
            Cancelar
          </Button>
          <Button color="primary" isLoading={updating} onPress={handleUpdate}>
            Guardar Cambios
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditCareerModal;
