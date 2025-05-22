import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@heroui/react";
import { useRouter } from "next/router";
import { LogoutIcon, ProfileIcon } from "../icons/ActionIcons";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dhaxrwwio/image/upload/v1747070979/Captura-de-pantalla-2025-05-12-122646_zrk4ft.webp";

export function UserProfileDropdown({
  user,
  onLogout,
  loading = false,
}: {
  user: { name?: string; profileImage?: string };
  onLogout: () => void;
  loading?: boolean;
}) {
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex items-center gap-2 animate-pulse">
        <div className="bg-gray-300 rounded-full w-10 h-10" />
        <div className="h-4 w-20 bg-gray-300 rounded" />
      </div>
    );
  }

  return (
    <Dropdown>
      <DropdownTrigger>
        <div className="flex items-center gap-2 cursor-pointer">
          <Avatar
            src={user?.profileImage || DEFAULT_AVATAR}
            alt={user?.name || "Usuario"}
            size="md"
            className="border border-gray-300 shadow"
          />
          <span className="font-semibold text-sm text-gray-700 hidden md:inline">
            {user?.name || "Usuario"}
          </span>
        </div>
      </DropdownTrigger>
      <DropdownMenu
      
        aria-label="Opciones de usuario"
        onAction={(key) => {
          if (key === "profile") router.push("/user/profile");
          if (key === "logout") onLogout();
        }}
        className="py-1 w-full"
      >
        <DropdownItem startContent={<ProfileIcon className="w-5 h-5" />} key="profile" className="px-3 py-2 text-sm">
          Mi perfil
        </DropdownItem>
        <DropdownItem
        startContent={<LogoutIcon className="w-5 h-5 text-red-700" />}
          key="logout"
          className={`
    flex items-center px-3 py-1.5 text-base font-medium
    rounded-md cursor-pointer text-danger
    hover:bg-red-50 hover:text-red-700
    focus:bg-red-50 focus:text-red-700
    transition-colors
    gap-2
  `}
          style={{
            outline: "none",
            boxShadow: "none",
            minHeight: "auto",
            height: "auto",
          }}
        >

          <span>Cerrar sesión</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
