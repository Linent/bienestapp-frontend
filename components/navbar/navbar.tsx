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
  Avatar,
} from "@heroui/react";
import { Button } from "@heroui/button";
import NextLink from "next/link";
import { Logo } from "@/components/icons";
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "../theme-switch";
import { getTokenPayload } from "@/utils/auth";
import { fetchUserById } from "@/services/userService";
import { UserProfileDropdown } from "@/components/user/UserProfileDropdown";
import { LogoutIcon } from "../icons/ActionIcons";

const DEFAULT_AVATAR = "https://res.cloudinary.com/dhaxrwwio/image/upload/v1747070979/Captura-de-pantalla-2025-05-12-122646_zrk4ft.webp";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [advisorId, setAdvisorId] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const [user, setUser] = useState<{ name?: string; profileImage?: string }>({});
  const [loadingUser, setLoadingUser] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const tokenData = getTokenPayload();
    if (tokenData && tokenData.id) {
      setIsAuthenticated(true);
      setUserRole(tokenData.role);
      setAdvisorId(tokenData.id);

      setLoadingUser(true);
      fetchUserById(tokenData.id)
        .then((userData) => {
          setUser({
            name: userData.name,
            profileImage: userData.profileImage,
          });
        })
        .catch(() => setUser({}))
        .finally(() => setLoadingUser(false));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    router.push("/login");
  };

  const resolveHref = (href: string) => {
    if (href.includes(":advisorId") && advisorId) {
      return href.replace(":advisorId", advisorId);
    }
    return href;
  };

  return (
    <HeroUINavbar maxWidth="xl" position="sticky" onMenuOpenChange={setIsMenuOpen}>
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

      {/* Menú principal Desktop */}
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
                    <Button
                      variant="light"
                      onMouseEnter={() => setOpenDropdown(item.href)}
                      onPointerDown={() => router.push(resolveHref(item.href))}
                      className="flex items-center gap-2"
                    >
                      {item.label}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    className="hover:text-primary"
                    aria-label={`Submenú de ${item.label}`}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    {item.subItems.map((subItem) => (
                      <DropdownItem key={subItem.href}>
                        <NextLink className="w-full block hover:text-primary" href={resolveHref(subItem.href)}>
                          {subItem.label}
                        </NextLink>
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              ) : (
                <NavbarItem key={item.href}>
                  <NextLink className="hover:text-primary" href={resolveHref(item.href)}>
                    {item.label}
                  </NextLink>
                </NavbarItem>
              )
            )}
        </NavbarContent>
      )}

      {/* Perfil Desktop */}
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          {isAuthenticated ? (
            <UserProfileDropdown user={user} onLogout={handleLogout} loading={loadingUser} />
          ) : (
            <Button as={NextLink} href="/login" variant="flat">
              Iniciar sesión
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>

      {/* Menú móvil */}
      <NavbarMenu>
        {isAuthenticated ? (
          <>
            {/* Navegación principal móvil */}
            {siteConfig.navItems
              .filter((item) => !userRole || item.roles.includes(userRole))
              .map((item) => (
                <NavbarMenuItem key={item.href}>
                  <NextLink className="block px-4 py-2" href={resolveHref(item.href)}>
                    {item.label}
                  </NextLink>
                  {item.subItems &&
                    item.subItems.map((subItem) => (
                      <NavbarMenuItem key={subItem.href} className="pl-10 text-sm">
                        <NextLink href={resolveHref(subItem.href)}>{subItem.label}</NextLink>
                      </NavbarMenuItem>
                    ))}
                </NavbarMenuItem>
              ))}

            {/* Separador y opciones usuario */}
            <div className="border-t my-4" />

            <NavbarMenuItem
              onClick={() => router.push("/user/profile")}
              className="flex items-center gap-2 px-4 cursor-pointer"
            >
              <Avatar src={user?.profileImage || DEFAULT_AVATAR} size="sm" />
              <span>{user?.name || "Mi perfil"}</span>
            </NavbarMenuItem>
            <NavbarMenuItem
              className="flex items-center gap-2 px-4 cursor-pointer text-danger hover:text-red-600"
              onClick={handleLogout}
            >
              <LogoutIcon />
              <span>Cerrar sesión</span>
            </NavbarMenuItem>
          </>
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
        <ThemeSwitch />
      </NavbarMenu>
    </HeroUINavbar>
  );
};
