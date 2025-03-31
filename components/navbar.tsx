import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import NextLink from "next/link";
import { Logo } from "@/components/icons";
import { siteConfig } from "@/config/site";

export const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role"); // Obtener el rol del usuario
    setIsAuthenticated(!!token);
    setUserRole(role);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role"); // Eliminar el rol al cerrar sesión
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand>
          <NextLink href="/">
          
            <Logo src={'logo-bienestapp.webp'} />
          </NextLink>
        </NavbarBrand>

        {/* Mostrar menú solo si el usuario está autenticado */}
        {isAuthenticated && (
          <div className="hidden lg:flex gap-4 justify-start ml-2">
            {siteConfig.navItems
              .filter((item) => !userRole || item.roles.includes(userRole)) // Filtrar según el rol
              .map((item) => (
                <NavbarItem key={item.href}>
                  <NextLink href={item.href}>{item.label}</NextLink>
                </NavbarItem>
              ))}
          </div>
        )}
      </NavbarContent>

      <NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full" justify="end">
        {/* Botón de inicio de sesión o cerrar sesión */}
        <NavbarItem className="hidden md:flex">
          {isAuthenticated ? (
            <Button onClick={handleLogout} variant="flat">
              Cerrar sesión
            </Button>
          ) : (
            <Button as={NextLink} href="/login" variant="flat">
              Iniciar sesión
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>
    </HeroUINavbar>
  );
};

