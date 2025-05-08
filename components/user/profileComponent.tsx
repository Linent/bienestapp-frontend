import { useEffect, useState } from "react";
import { fetchUserById } from "@/services/userService"; // Ajusta según tu path real
import { getTokenPayload } from "@/utils/auth"; // Asegúrate que la ruta sea correcta

interface Career {
  name: string;
}

interface User {
  name: string;
  email: string;
  password: string;
  role: string;
  career: Career | string;
  codigo: string;
}

interface ProfileComponentProps {
  user: User;
}

const ProfileComponent: React.FC<ProfileComponentProps> = ({ user }) => {
  const [formData, setFormData] = useState<User>({
    name: '',
    email: '',
    password: '',
    role: '',
    career: '',
    codigo: ''
  });

  useEffect(() => {
    const payload = getTokenPayload();
    const userId = payload?.id;

    const fetchData = async () => {
      if (!userId) {
        console.warn("No se encontró el ID del usuario en el token.");
        return;
      }

      try {
        const userData = await fetchUserById(userId);

        // Extraer el nombre de la carrera si es un objeto
        const careerName = userData.career && typeof userData.career !== 'string' ? userData.career.name : userData.career;

        // Asignar un valor legible al rol
        let roleDisplay = '';
        switch (userData.role) {
          case 'admin':
            roleDisplay = 'Admin';
            break;
          case 'student':
            roleDisplay = 'Estudiante';
            break;
          case 'academic_friend':
            roleDisplay = 'Amigo Académico';
            break;
          default:
            roleDisplay = userData.role; // En caso de un rol no esperado
        }

        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          password: '',
          role: roleDisplay, // Aquí asignamos el valor legible del rol
          career: careerName || '', // Asignamos el nombre de la carrera
          codigo: userData.codigo || '',
        });

        console.log("Datos del usuario desde la API:", userData);
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos antes de actualizar:", formData);
    console.log("Datos actualizados:", formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-4xl p-4 bg-white shadow-lg rounded-lg"
    >
      <div className="grid grid-cols-2 gap-6">
        {/* Columna izquierda */}
        <div>
          <div className="mb-4">
            <label htmlFor="name" className="block text-lg font-medium mb-2">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              disabled
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-lg font-medium mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              disabled
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-lg font-medium mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              placeholder="Deja en blanco si no quieres cambiarla"
            />
          </div>
        </div>

        {/* Columna derecha */}
        <div>
          <div className="mb-4">
            <label htmlFor="role" className="block text-lg font-medium mb-2">
              Rol
            </label>
            <input
              type="text"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              disabled
            />
          </div>

          <div className="mb-4">
            <label htmlFor="career" className="block text-lg font-medium mb-2">
              Carrera
            </label>
            <input
              type="text"
              id="career"
              name="career"
              value={formData.career}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              disabled
            />
          </div>

          <div className="mb-4">
            <label htmlFor="codigo" className="block text-lg font-medium mb-2">
              Código
            </label>
            <input
              type="text"
              id="codigo"
              name="codigo"
              value={formData.codigo}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              disabled
            />
          </div>
        </div>
      </div>

      {/* Botón de actualización centrado */}
      <div className="mb-4 flex justify-center col-span-2">
        <button
          type="submit"
          className="w-1/2 p-2 bg-blue-500 text-white font-bold rounded-md"
        >
          Actualizar Perfil
        </button>
      </div>
    </form>
  );
};

export default ProfileComponent;
