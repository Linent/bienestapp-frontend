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
import { fetchCareers } from "@/services/careerService";
import { registerUser } from "@/services/userService"; // Importa la función de registro
import axios from "axios"; // Importar axios para manejar las respuestas de error

const AddUserModal = ({ isOpen, onClose }) => {
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
      const result = await registerUser(userData);


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
    } catch (err) {
      setLoading(false); // Desactivar el Skeleton

      // Manejo de errores
      console.error("Error al registrar el usuario:", err.toJSON ? err.toJSON() : err);
      
      if (axios.isAxiosError(err) && err.response) {


        const status = err.response.status;
        const message = "Error al registrar el usuario";

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
          <ModalHeader className="flex flex-col gap-1">Agregar Usuario</ModalHeader>
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
                  label="Nombre"
                  placeholder="Ingrese el nombre"
                  variant="bordered"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  minLength={10} // Mínimo 3 caracteres
                  errorMessage="El nombre debe tener al menos 10 caracteres"
                  isRequired
                />
                <Input
                  label="Correo"
                  placeholder="Ingrese el correo"
                  variant="bordered"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  isRequired
                  errorMessage="Por favor, ingrese un correo válido"
                />
                <Input
                  label="Código"
                  placeholder="Ingrese el código"
                  variant="bordered"
                  value={codigo}
                  onChange={(e) => setCode(e.target.value)}
                  isRequired
                  errorMessage="Por favor, ingrese un código"
                />
                <Select
                  label="Rol"
                  isRequired
                  errorMessage="Por favor, seleccione un rol"
                  placeholder="Seleccione un rol"
                  variant="bordered"
                  value={role}
                  onSelectionChange={(keys) => setRole(Array.from(keys)[0] as string)}
                >
                  <SelectItem key="admin" textValue="admin">
                    Administrador
                  </SelectItem>
                  <SelectItem key="academic_friend" textValue="academic_friend">
                    Amigo Académico
                  </SelectItem>
                  <SelectItem key="student" textValue="student">
                    Estudiante
                  </SelectItem>
                </Select>
                <Input
                  label="Contraseña"
                  placeholder="Ingrese la contraseña"
                  variant="bordered"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  isRequired
                  errorMessage="Por favor, ingrese una contraseña"
                />
                <Select 
                    isRequired
                    errorMessage="Por favor, seleccione una carrera"
                  label="Carrera"
                  placeholder="Seleccione una carrera"
                  selectedKeys={new Set([selectedCareer])}
                  onSelectionChange={(keys) => setSelectedCareer(Array.from(keys)[0] as string)}
                  variant="bordered"
                >
                  {careers.map((career) => (
                    <SelectItem key={career._id} textValue={career._id}>
                      {career.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            )}
            {error && (
              <Alert color="danger" variant="filled" className="mt-4">
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

