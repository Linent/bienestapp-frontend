import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";

interface User {
  name: string;
  email: string;
  codigo: string;
  role: string;
  enable: boolean;
}

// Mapeo de roles para mostrar los nombres correctos
const roleMap: Record<string, string> = {
  admin: "Administrador",
  academic_friend: "Amigo Académico",
  student: "Estudiante",
};

interface ViewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const ViewUserModal: React.FC<ViewUserModalProps> = ({ isOpen, onClose, user }) => {
  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-lg">
      <ModalContent>
        <ModalHeader>Detalles del Usuario</ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Nombre:</p>
              <p>{user.name}</p>
            </div>
            <div>
              <p className="font-semibold">Email:</p>
              <p>{user.email}</p>
            </div>
            <div>
              <p className="font-semibold">Código:</p>
              <p>{user.codigo}</p>
            </div>
            <div>
              <p className="font-semibold">Rol:</p>
              <p>{roleMap[user.role] ?? "Desconocido"}</p>
            </div>
            <div>
              <p className="font-semibold">Estado:</p>
              <p className={user.enable ? "text-green-500" : "text-red-500"}>
                {user.enable ? "Activo" : "Inactivo"}
              </p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onPress={onClose} color="primary">Cerrar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ViewUserModal;
