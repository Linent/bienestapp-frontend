import { useRef, useState } from "react";
import { Card, CardBody, Button } from "@heroui/react";
import { EyeIcon, EditIcon } from "@/components/icons/ActionIcons";
import toast from "react-hot-toast";
import { uploadUserFiles } from "@/services/userService";
import { User } from "@/types";

interface Props {
  user: User;
  onRefresh: () => void;
}

const ResumeCard: React.FC<Props> = ({ user, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = async (file: File | undefined) => {
    if (!file || !user?._id) return;
    const formData = new FormData();
    formData.append("resume", file);
    setLoading(true);
    try {
      await uploadUserFiles(user._id, formData);
      toast.success("Hoja de vida actualizada");
      onRefresh();
    } catch (error) {
      console.error("Error al subir hoja de vida:", error);
      toast.error("Error al actualizar hoja de vida");
    } finally {
      setLoading(false);
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click(); // Abrir selector de archivos
  };

  return (

        <div className="flex flex-wrap gap-3 items-center">
          {user?.resume ? (
            <a href={user.resume} target="_blank" rel="noopener noreferrer">
              <Button variant="light" color="primary">
                <EyeIcon />
                Ver hoja de vida
              </Button>
            </a>
          ) : (
            <p className="text-gray-500">No has subido una hoja de vida aún.</p>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            hidden
            onChange={(e) => handleUpload(e.target.files?.[0])}
          />
          <Button
            variant="flat"
            color="warning"
            onPress={handleClickUpload}
            isLoading={loading}
          >
            <EditIcon />
            {user.resume ? "Actualizar hoja de vida" : "Subir hoja de vida"}
          </Button>
        </div>

  );
};

export default ResumeCard;

