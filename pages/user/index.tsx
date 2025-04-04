import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import UserTable from "@/components/UserTable";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const UsersPage = () => {
      const router = useRouter();
      const [isAuthenticated, setIsAuthenticated] = useState(false);
    
      useEffect(() => {
        const token = localStorage.getItem("token");
    
        if (!token) {
          router.replace("/login"); // Redirige automáticamente
        } else {
          setIsAuthenticated(true);
        }
      }, []);
    
      if (!isAuthenticated) {
        return null; // No renderiza la página mientras redirige
      }
  return (
    <DefaultLayout>
      <div className="p-6">
        <h1 className={title()}>Lista de Usuarios</h1>
        <UserTable  />
      </div>
    </DefaultLayout>
  );
};

export default UsersPage;
