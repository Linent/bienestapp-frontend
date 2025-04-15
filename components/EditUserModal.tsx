import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
  Select,
  SelectItem,
  Skeleton,
} from "@heroui/react";
import { fetchUserById, updateUser } from "@/services/userService";
import { fetchCareers } from "@/services/careerService";
import toast from "react-hot-toast";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onUpdateSuccess: () => void;
}

const roleOptions = [
  { value: "admin", label: "Administrador" },
  { value: "student", label: "Estudiante" },
  { value: "academic_friend", label: "Amigo Académico" },
];

const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  userId,
  onUpdateSuccess,
}) => {
  const [user, setUser] = useState<any>(null);
  const [careers, setCareers] = useState<{ _id: string; name: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {

      const fetchData = async () => {
        setLoading(true);
        try {
          const userData = await fetchUserById(userId);

          const careerData = await fetchCareers();
          setUser(userData);
          setCareers(careerData);
        } catch (error) {
          console.error("Error al obtener datos del usuario:", error);
          toast.error("No se pudo cargar la información del usuario.");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [isOpen, userId]);

  const handleUpdate = async () => {
    if (!user) return;
    setUpdating(true);
    try {
      const updatedUser = Object.keys(user).reduce((acc, key) => {
        if (user[key] !== "") acc[key] = user[key];
        return acc;
      }, {} as any);

      await updateUser(userId, updatedUser);
      toast.success("Usuario actualizado correctamente");
      onUpdateSuccess();
      onClose();
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      toast.error("Hubo un error al actualizar el usuario");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-lg">
      <ModalContent>
        <ModalHeader>Editar Usuario</ModalHeader>
        <ModalBody>
          {loading ? (
            <Skeleton className="h-10 w-full mb-3" />
          ) : (
            <>
              <Input
                label="Nombre"
                value={user?.name || ""}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
              />
              <Input
                label="Email"
                type="email"
                value={user?.email || ""}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
              <Input
                label="Código"
                value={user?.codigo || ""}
                onChange={(e) => setUser({ ...user, codigo: e.target.value })}
              />
<Select
  label="Rol"
  selectedKeys={new Set([user?.role || "student"])}
  onSelectionChange={(value) =>
    setUser({ ...user, role: Array.from(value)[0] })
  }
>
  {roleOptions.map((role) => (
    <SelectItem key={role.value} id={role.value}>
      {role.label}
    </SelectItem>
  ))}
</Select>

<Select
  label="Carrera"
  selectedKeys={new Set([user?.career || ""])}
  onSelectionChange={(value) =>
    setUser({ ...user, career: Array.from(value)[0] })
  }
>
  {careers.map((career) => (
    <SelectItem key={career._id} id={career._id}> 
      {career.name}
    </SelectItem>
  ))}
</Select>
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

export default EditUserModal;
