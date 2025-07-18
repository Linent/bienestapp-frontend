// components/user/EditUserModal.tsx
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
import toast from "react-hot-toast";

import { fetchUserById, updateUser } from "@/services/userService";
import { fetchCareers } from "@/services/careerService";
import { getTokenPayload } from "@/utils/auth";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onUpdateSuccess: () => void;
  fromProfile?: boolean;
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
  fromProfile,
}) => {
  const [user, setUser] = useState<any>(null);
  const [careers, setCareers] = useState<{ _id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const role = getTokenPayload()?.role;
    setIsAdmin(role === "admin");
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const userData = await fetchUserById(userId);
        setUser(userData);
        setPassword("");

        if (isAdmin) {
          const careerData = await fetchCareers();
          setCareers(careerData);
        }
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
        toast.error("No se pudo cargar la información del usuario.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen, userId, isAdmin]);

  const handleUpdate = async () => {
    if (!user) return;
    if (password && password.length < 6) {
      toast.error("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setUpdating(true);
    try {
      const updatedUser = Object.keys(user).reduce((acc, key) => {
        if (user[key] !== "") acc[key] = user[key];
        return acc;
      }, {} as any);

      if (password.trim()) {
        updatedUser.password = password.trim();
      }

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
    <Modal className="w-full max-w-lg" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>
          <div>
            <h1>Editar Usuario</h1>
            <p>Edita solo los campos que quieras modificar</p>
          </div>
        </ModalHeader>
        <ModalBody>
          {loading ? (
            <Skeleton className="h-10 w-full mb-3" />
          ) : (
            <>
              <Input
                label="Nombre"
                value={user?.name || ""}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                isDisabled={!isAdmin && !fromProfile}
              />

              {isAdmin && !fromProfile && (
                <>
                  <Input
                    label="Email"
                    type="email"
                    value={user?.email || ""}
                    onChange={(e) =>
                      setUser({ ...user, email: e.target.value })
                    }
                  />
                  <Input
                    label="Código"
                    value={user?.codigo || ""}
                    onChange={(e) =>
                      setUser({ ...user, codigo: e.target.value })
                    }
                  />
                  <Input
                    label="Cédula"
                    value={user?.dni || ""}
                    onChange={(e) => setUser({ ...user, dni: e.target.value })}
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

              <Input
                label="Nueva contraseña (opcional)"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Deja en blanco para no cambiarla"
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

export default EditUserModal;
