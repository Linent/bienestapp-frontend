import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Image,
} from "@heroui/react";
import { Button } from "@heroui/button";
import NextLink from "next/link";
import icons8CerrarSesion from "@/public/icons8-cerrar-sesión-100-(1).png";
import icon8CerrarSesion from "@/public/icons8-logout-96.png";
import { Logo } from "@/components/icons";
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "../theme-switch";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    setIsAuthenticated(!!token);
    setUserRole(role);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <HeroUINavbar
      maxWidth="xl"
      position="sticky"
      onMenuOpenChange={setIsMenuOpen}
    >
      {/* Logo y botón de menú en móviles */}
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <NextLink href="/">
            <Logo src={"/logo-bienestapp.webp"} />
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      {/* Menú principal (Desktop) */}
      {isAuthenticated && (
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          {siteConfig.navItems
            .filter((item) => !userRole || item.roles.includes(userRole))
            .map((item) =>
              item.subItems && item.subItems.length > 0 ? (
                <Dropdown
                  key={item.href}
                  isOpen={openDropdown === item.href}
                  onOpenChange={(isOpen) =>
                    setOpenDropdown(isOpen ? item.href : null)
                  }
                >
                  <DropdownTrigger>
                    <Button
                      variant="light"
                      onMouseEnter={() => setOpenDropdown(item.href)}
                      onPointerDown={() => router.push(item.href)}
                    >
                      {item.label}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label={`Submenú de ${item.label}`}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    {item.subItems.map((subItem) => (
                      <DropdownItem key={subItem.href}>
                        <NextLink className="w-full block" href={subItem.href}>
                          {subItem.label}
                        </NextLink>
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              ) : (
                <NavbarItem key={item.href}>
                  <NextLink className="hover:text-primary" href={item.href}>
                    {item.label}
                  </NextLink>
                </NavbarItem>
              )
            )}
        </NavbarContent>
      )}

      {/* Botón de autenticación */}
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          {isAuthenticated ? (
            <Button variant="flat" onClick={handleLogout}>
              <Image
                src={icon8CerrarSesion.src}
                alt="Cerrar sesión"
                className="w-5 h-5 mr-2"
                width={20}
                height={20}
              />
              Cerrar sesión
            </Button>
          ) : (
            <Button as={NextLink} href="/login" variant="flat">
              Iniciar sesión
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>

      {/* Menú desplegable en móviles */}
      <NavbarMenu>
        {isAuthenticated ? (
          siteConfig.navItems
            .filter((item) => !userRole || item.roles.includes(userRole))
            .map((item) => (
              <NavbarMenuItem key={item.href}>
                <NextLink className="block px-4 py-2" href={item.href}>
                  {item.label}
                </NextLink>
                {item.subItems &&
                  item.subItems.map((subItem) => (
                    <NavbarMenuItem key={subItem.href} className="pl-6 text-sm">
                      <NextLink href={subItem.href}>{subItem.label}</NextLink>
                    </NavbarMenuItem>
                  ))}
              </NavbarMenuItem>
            ))
        ) : (
          <>
            <NavbarMenuItem key="/">
              <NextLink className="block px-4 py-2" href="/">
                Inicio
              </NextLink>
            </NavbarMenuItem>
            <NavbarMenuItem key="/login">
              <NextLink className="block px-4 py-2" href="/login">
                Iniciar sesión
              </NextLink>
            </NavbarMenuItem>
          </>
        )}
        {isAuthenticated && (
            <NavbarMenuItem
            className="mt-auto border-t pt-4 flex items-center gap-2 px-4 cursor-pointer text-danger hover:text-red-600"
            onClick={handleLogout}
            >
            <Image
              src={icons8CerrarSesion.src}
              alt="Cerrar sesión"
              className="w-5 h-5"
              width={20}
              height={20}
            />
            <span>Cerrar sesión</span>
            </NavbarMenuItem>
        )}
        <ThemeSwitch />
      </NavbarMenu>
    </HeroUINavbar>
  );
};
