export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Bienestapp",
  description: "Solicita en tus estudios con tutores especializados.",
  navItems: [
    {
      label: "Inicio",
      href: "/",
      roles: ["admin", "student", "academic_friend"],
    },
    {
      label: "Asesorías",
      href: "/schedules",
      roles: ["admin", "academic_friend"],
      subItems: [
        { label: "Mis asesorías", href: "/schedules/view" },
        { label: "Crear asesoría", href: "/schedules/new" },
      ],
    },
    {
      label: "Asesores",
      href: "/advisors",
      roles: ["admin"],
    },
    {
      label: "Estudiantes",
      href: "/user",
      roles: ["admin"],
    },
    {
      label: "Dashboard",
      href: "/dashboard",
      roles: ["admin"],
    },
    {
      label: "Carreras",
      href: "/career",
      roles: ["admin"],
    },
  ],
  navMenuItems: [
    {
      label: "Perfil",
      href: "/profile",
      roles: ["admin", "student", "academic_friend"],
    },
    {
      label: "Cerrar sesión",
      href: "/logout",
      roles: ["admin", "student", "academic_friend"],
    },
  ],
};
