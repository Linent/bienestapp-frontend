export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Next.js + HeroUI",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Home",
      href: "/",
      roles: ["admin", "student", "academic_friend", ''], // Todos los roles pueden ver esta página
    },
    {
      label: "Agenda",
      href: "/schedules",
      roles: ["admin", "academic_friend"], // Solo admin y amigos académicos pueden acceder
    },
    {
      label: "Usuarios",
      href: "/user",
      roles: ["admin"], // Solo administradores pueden acceder
    },
    {
      label: "Dashboard",
      href: "/dashboard",
      roles: ["admin"], // Admin y estudiantes pueden ver el dashboard
    },
    {
      label: "Carreras",
      href: "/career",
      roles: ["admin", "academic_friend"],
    }
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
      roles: ["admin", "student", "academic_friend"],
    },
    {
      label: "Projects",
      href: "/projects",
      roles: ["admin"],
    },
    {
      label: "Settings",
      href: "/settings",
      roles: ["admin"],
    },
    {
      label: "Logout",
      href: "/logout",
      roles: ["admin", "student", "academic_friend"],
    },
  ],
  links: {},
};