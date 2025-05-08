export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Bienestapp",
  description: "Solicita en tus estudios con mentores especializados.",
  navItems: [
    {
      label: "Inicio",
      href: "/",
      roles: ["admin", "student", "academic_friend"],
    },
    {
      label: "Calendario",
      href: "/schedules",
      roles: ["admin", "academic_friend"],
      subItems: [
        { label: "Historial reciente de asesorías", href: "/schedules/view"}
      ],
    },
    {
      label: "Mentores",
      href: "/advisors",
      roles: ["admin"],
    },
    {
      label: "Estudiantes",
      href: "/user",
      roles: ["admin"],
    },
    {
      label: "Estadisticas",
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
