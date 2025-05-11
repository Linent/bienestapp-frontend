import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Skeleton,
  Alert,
  addToast,
} from "@heroui/react";
import axios from "axios"; // Importar axios para manejar las respuestas de error

import { fetchCareers } from "@/services/careerService";
import { registerUser } from "@/services/userService"; // Importa la función de registro

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose }) => {
  const [careers, setCareers] = useState<{ _id: string; name: string }[]>([]);
  const [selectedCareer, setSelectedCareer] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [codigo, setCode] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // Estado para mostrar el Skeleton
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores

  useEffect(() => {
    const getCareers = async () => {
      try {
        const data = await fetchCareers();

        if (Array.isArray(data)) {
          setCareers(data);
        } else {
          throw new Error("Formato de datos inválido");
        }
      } catch (err) {
        console.error("Error al obtener las carreras:", err);
      }
    };

    if (isOpen) {
      getCareers();
    }
  }, [isOpen]);

  const handleSave = async () => {
    // Verificar si todos los campos obligatorios están completos
    if (!name || !email || !codigo || !role || !password || !selectedCareer) {
      setError("Por favor, complete todos los campos.");

      return;
    }

    setError(null); // Resetear el error si los campos son válidos
    setLoading(true); // Activar el Skeleton mientras la solicitud está en curso

    const userData = {
      name,
      email,
      codigo,
      role,
      password,
      career: selectedCareer,
    };

    try {
      await registerUser(userData);

      // Limpiar los campos del formulario después de guardar
      setName("");
      setEmail("");
      setCode("");
      setRole("");
      setPassword("");
      setSelectedCareer("");

      // Cerrar el modal inmediatamente después de guardar
      onClose();

      // Mostrar el Toast de éxito
      setTimeout(() => {
        addToast({
          title: "Usuario registrado",
          description: "El usuario se ha registrado exitosamente.",
          color: "success",
        });
      }, 1000); // Añadido un pequeño retraso para asegurarse de que el modal ya está cerrado
    } catch (err: any) {
      setLoading(false); // Desactivar el Skeleton

      // Manejo de errores
      console.error(
        "Error al registrar el usuario:",
        err.toJSON ? err.toJSON() : err
      );

      if (axios.isAxiosError(err) && err.response) {
        const status = err.response.status;

        if (status === 400 || status === 401) {
          setError("Datos inválidos. Verifique el formulario.");
        } else if (status === 500) {
          setError("Error del servidor. Inténtalo más tarde.");
        } else {
          setError(`Error inesperado: ${status}`);
        }
      } else {
        setError("No se pudo conectar con el servidor.");
      }

      // Mostrar el Toast de error
      addToast({
        title: "Error",
        description: error || "Ocurrió un problema al registrar el usuario.",
        color: "danger",
      });
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onClose}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Agregar Usuario
          </ModalHeader>
          <ModalBody>
            {loading ? (
              // Mostrar Skeleton mientras carga los datos
              <div className="space-y-4">
                <Skeleton className="w-full rounded-lg h-10" />
                <Skeleton className="w-full rounded-lg h-10" />
                <Skeleton className="w-full rounded-lg h-10" />
                <Skeleton className="w-full rounded-lg h-10" />
                <Skeleton className="w-full rounded-lg h-10" />
                <Skeleton className="w-full rounded-lg h-10" />
              </div>
            ) : (
              // Mostrar el formulario cuando no está cargando
              <div className="space-y-4">
                <Input
                  isRequired
                  errorMessage="El nombre debe tener al menos 10 caracteres"
                  label="Nombre"
                  minLength={10} // Mínimo 3 caracteres
                  placeholder="Ingrese el nombre"
                  value={name}
                  variant="bordered"
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  isRequired
                  errorMessage="Por favor, ingrese un correo válido"
                  label="Correo"
                  placeholder="Ingrese el correo"
                  type="email"
                  value={email}
                  variant="bordered"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  isRequired
                  errorMessage="Por favor, ingrese un código"
                  label="Código"
                  placeholder="Ingrese el código"
                  value={codigo}
                  variant="bordered"
                  onChange={(e) => setCode(e.target.value)}
                />
                <Select
                  isRequired
                  errorMessage="Por favor, seleccione un rol"
                  label="Rol"
                  placeholder="Seleccione un rol"
                  selectedKeys={new Set([role])}
                  variant="bordered"
                  onSelectionChange={(keys) =>
                    setRole(Array.from(keys)[0] as string)
                  }
                >
                  <SelectItem key="admin" textValue="Administrador">
                    Administrador
                  </SelectItem>
                  <SelectItem key="academic_friend" textValue="Amigo Académico">
                    Amigo Académico
                  </SelectItem>
                  <SelectItem key="student" textValue="Estudiante">
                    Estudiante
                  </SelectItem>
                </Select>
                <Input
                  isRequired
                  errorMessage="Por favor, ingrese una contraseña"
                  label="Contraseña"
                  placeholder="Ingrese la contraseña"
                  type="password"
                  value={password}
                  variant="bordered"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Select
                  isRequired
                  errorMessage="Por favor, seleccione una carrera"
                  label="Carrera"
                  placeholder="Seleccione una carrera"
                  selectedKeys={new Set([selectedCareer])}
                  variant="bordered"
                  onSelectionChange={(keys) =>
                    setSelectedCareer(Array.from(keys)[0] as string)
                  }
                >
                  {careers.map((career) => (
                    <SelectItem key={career._id} textValue={career.name}>
                      {career.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            )}
            {error && (
              <Alert className="mt-4" color="danger" variant="solid">
                {error}
              </Alert>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onPress={onClose}>
              Cancelar
            </Button>
            <Button color="primary" onPress={handleSave}>
              Guardar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddUserModal;
