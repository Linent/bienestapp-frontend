import { useEffect, useState } from "react";
import {
  Button,
  Skeleton,
  Alert,
  Card,
  User as UserAvatar,
} from "@heroui/react";
import EditUserModal from "@/components/EditUserModal";
import Link from "next/link";
import { fetchUserById } from "@/services/userService";
import { getTokenPayload } from "@/utils/auth";
import { User } from "@/types/types";
import toast from "react-hot-toast";

const ProfileCard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    const payload = getTokenPayload();
    const userId = payload?.id;

    const fetchData = async () => {
      if (!userId) {
        setErrorMsg("No se encontró el ID del usuario en el token.");
        setLoading(false);
        return;
      }

      try {
        const userData: User = await fetchUserById(userId);
        const careerName: string =
          typeof userData.career === "object" && userData.career !== null && "name" in userData.career
            ? String(userData.career.name)
            : typeof userData.career === "object" && userData.career !== null && "_id" in userData.career
            ? String(userData.career._id)
            : "";

        setUser({
          ...userData,
          career: careerName,
        });
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
        setErrorMsg("No se pudo cargar el perfil del usuario.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Skeleton className="w-full h-64" />;
  if (errorMsg) return <Alert color="danger">{errorMsg}</Alert>;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="w-full p-6 bg-white rounded-2xl shadow-xl">
        <div className="relative rounded-xl mb-20"></div>

        <div className="px-6 -mt-20 flex items-center gap-4">
          <div className="bg-gray-200 rounded-full flex items-center justify-center">
            <UserAvatar
              name=""
              avatarProps={{
                src: "https://avatars.githubusercontent.com/u/30373425?v=4",
              }}
            />
          </div>
          <div>
            <h2 className="text-xl font-bold capitalize leading-tight">
              {user?.name}
            </h2>
            <p className="text-gray-600 text-sm">
              {user?.role === "admin"
                ? "Administrador"
                : user?.role === "student"
                ? "Estudiante"
                : user?.role === "academic_friend"
                ? "Mentor"
                : user?.role}
            </p>
            <p className="text-gray-500 text-sm">
              {typeof user?.career === "object" && user?.career !== null
                ? user.career._id
                : user?.career}
            </p>
          </div>
        </div>

        <div className="px-6 mt-4 text-sm text-gray-700 space-y-1">
          <p>
            <strong>Correo:</strong> {user?.email}
          </p>
          <p>
            <strong>Código:</strong> {user?.codigo}
          </p>
        </div>

        <div className="flex gap-4 mt-6 px-6">
          <Button color="primary" variant="solid" onPress={() => setIsEditOpen(true)}>
            Editar perfil
          </Button>
          {/*<Button variant="bordered">Configuraciones</Button>*/}
        </div>

        {/* Accesos según el rol */}
        <div className="mt-8 px-6 space-y-2">
          <h3 className="text-lg font-semibold mb-2">Accesos Rápidos</h3>
          {user?.role === "admin" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link href="/schedules">
                <div className="p-4 border rounded-xl hover:bg-gray-50 cursor-pointer text-center">Horarios</div>
              </Link>
              <Link href="/dashboard">
                <div className="p-4 border rounded-xl hover:bg-gray-50 cursor-pointer text-center">Estadísticas</div>
              </Link>
              <Link href="/schedules/view">
                <div className="p-4 border rounded-xl hover:bg-gray-50 cursor-pointer text-center">Vista de Horarios</div>
              </Link>
            </div>
          )}
          {user?.role === "academic_friend" && (
            <div className="grid grid-cols-1 gap-4">
              <Link href="/advisor/calendar">
                <div className="p-4 border rounded-xl hover:bg-gray-50 cursor-pointer text-center">Ver calendarios</div>
              </Link>
            </div>
          )}
        </div>
      </Card>

      {/* Modal de edición del perfil */}
      {user && (
        <EditUserModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          userId={user._id}
          onUpdateSuccess={() => {
            toast.success("Perfil actualizado");
            window.location.reload(); // Puedes reemplazar con un nuevo fetch si lo prefieres
          }}
        />
      )}
    </div>
  );
};

export default ProfileCard;
