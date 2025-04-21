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
  Link,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { Button } from "@heroui/button";
import NextLink from "next/link";
import { Logo } from "@/components/icons";
import { siteConfig } from "@/config/site";

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
    <HeroUINavbar maxWidth="xl" position="sticky" onMenuOpenChange={setIsMenuOpen}>
      {/* Logo y botón de menú en móviles */}
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <NextLink href="/">
            <Logo src={'/logo-bienestapp.webp'} />
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
                  onOpenChange={(isOpen) => setOpenDropdown(isOpen ? item.href : null)}
                >
                  <DropdownTrigger>
                    <Button onPointerDown={() => router.push(item.href)} variant="light" onMouseEnter={() => setOpenDropdown(item.href)}>
                      {item.label}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu  aria-label={`Submenú de ${item.label}`} onMouseLeave={() => setOpenDropdown(null)}>
                    {item.subItems.map((subItem) => (
                      <DropdownItem key={subItem.href}>
                        <NextLink href={subItem.href} className="w-full block">
                          {subItem.label}
                        </NextLink>
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              ) : (
                <NavbarItem key={item.href}>
                  <NextLink href={item.href} className="hover:text-primary">
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

      {/* Menú desplegable en móviles */}
      <NavbarMenu>
        {isAuthenticated ? (
          siteConfig.navItems
            .filter((item) => !userRole || item.roles.includes(userRole))
            .map((item) => (
              <NavbarMenuItem key={item.href}>
                <NextLink href={item.href} className="block px-4 py-2">
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
              <NextLink href="/" className="block px-4 py-2">
                Inicio
              </NextLink>
            </NavbarMenuItem>
            <NavbarMenuItem key="/login">
              <NextLink href="/login" className="block px-4 py-2">
                Iniciar sesión
              </NextLink>
            </NavbarMenuItem>
          </>
        )}
      </NavbarMenu>
    </HeroUINavbar>
  );
};
