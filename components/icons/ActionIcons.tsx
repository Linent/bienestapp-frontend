import { IconSvgProps } from "@/types";
import React from "react";

export const EyeIcon = (props: any) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 20 20"
    width="1em"
    {...props}
  >
    <path
      d="M12.9833 10C12.9833 11.65 11.65 12.9833 10 12.9833C8.35 12.9833 7.01666 11.65 7.01666 10C7.01666 8.35 8.35 7.01666 10 7.01666C11.65 7.01666 12.9833 8.35 12.9833 10Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
    <path
      d="M9.99999 16.8916C12.9417 16.8916 15.6833 15.1583 17.5917 12.1583C18.3417 10.9833 18.3417 9.00831 17.5917 7.83331C15.6833 4.83331 12.9417 3.09998 9.99999 3.09998C7.05833 3.09998 4.31666 4.83331 2.40833 7.83331C1.65833 9.00831 1.65833 10.9833 2.40833 12.1583C4.31666 15.1583 7.05833 16.8916 9.99999 16.8916Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
  </svg>
);
export const FacebookIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em" {...props}>
    <path d="M22 12a10 10 0 10-11.6 9.9v-7H8v-2.9h2.4V9.4c0-2.4 1.4-3.8 3.5-3.8.7 0 1.4.1 2.1.2v2.3h-1.2c-1.2 0-1.6.8-1.6 1.6v1.9H17l-.4 2.9h-2.2v7A10 10 0 0022 12z" />
  </svg>
);
export const CalendarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    height="1.2em"
    width="1.2em"
    stroke="currentColor"
    strokeWidth="1.5"
    {...props}
  >
    <rect
      x="3"
      y="4"
      width="18"
      height="18"
      rx="2"
      ry="2"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
export const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    height="1.2em"
    width="1.2em"
    stroke="currentColor"
    strokeWidth="1.5"
    {...props}
  >
    <circle cx="12" cy="8" r="4" stroke="currentColor" />
    <path
      d="M4 20c0-4 4-6 8-6s8 2 8 6"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const UploadIcon: React.FC<IconSvgProps> = ({
  size = 24,
  width,
  height,
  ...props
}) => {
  return (
    <svg
      height={size || height}
      width={size || width}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path
        d="M12 16V4M8 8l4-4 4 4M4 20h16"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export const TwitterIcon = (props: any) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    width="1em"
    height="1em"
    aria-hidden="true"
    {...props}
  >
    <path d="M3 3h3.6L12 10.2 17.4 3H21l-7.2 9.6L21 21h-3.6L12 13.8 6.6 21H3l7.2-9.6L3 3z" />
  </svg>
);
export const DocumentIcon = (props: any) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    {/* Contorno del documento */}
    <path
      d="M6 2H14L20 8V22H6V2Z"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Pestaña doblada */}
    <polyline
      points="14 2 14 8 20 8"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Líneas de texto */}
    <line
      x1="8"
      y1="12"
      x2="16"
      y2="12"
      stroke="currentColor"
      strokeWidth={1}
      strokeLinecap="round"
    />
    <line
      x1="8"
      y1="16"
      x2="16"
      y2="16"
      stroke="currentColor"
      strokeWidth={1}
      strokeLinecap="round"
    />
  </svg>
);
export const CameraIcon = (props: any) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    width="1em"
    viewBox="0 0 24 24"
    role="presentation"
    {...props}
  >
    <path
      d="M20 7h-2.586l-1.707-1.707A1 1 0 0015 5h-6a1 1 0 00-.707.293L6.586 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx={12}
      cy={13}
      r={4}
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export const EditIcon = (props: any) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 20 20"
    width="1em"
    {...props}
  >
    <path
      d="M11.05 3.00002L4.20835 10.2417C3.95002 10.5167 3.70002 11.0584 3.65002 11.4334L3.34169 14.1334C3.23335 15.1084 3.93335 15.775 4.90002 15.6084L7.58335 15.15C7.95835 15.0834 8.48335 14.8084 8.74168 14.525L15.5834 7.28335C16.7667 6.03335 17.3 4.60835 15.4583 2.86668C13.625 1.14168 12.2334 1.75002 11.05 3.00002Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
    />
  </svg>
);

export const DeleteIcon = (props: any) => (
  <svg
    height="1em"
    viewBox="0 0 48 48"
    width="1em"
    x="0px"
    xmlns="http://www.w3.org/2000/svg"
    y="0px"
  >
    <path d="M 24 4 C 20.491685 4 17.570396 6.6214322 17.080078 10 L 10.238281 10 A 1.50015 1.50015 0 0 0 9.9804688 9.9785156 A 1.50015 1.50015 0 0 0 9.7578125 10 L 6.5 10 A 1.50015 1.50015 0 1 0 6.5 13 L 8.6386719 13 L 11.15625 39.029297 C 11.427329 41.835926 13.811782 44 16.630859 44 L 31.367188 44 C 34.186411 44 36.570826 41.836168 36.841797 39.029297 L 39.361328 13 L 41.5 13 A 1.50015 1.50015 0 1 0 41.5 10 L 38.244141 10 A 1.50015 1.50015 0 0 0 37.763672 10 L 30.919922 10 C 30.429604 6.6214322 27.508315 4 24 4 z M 24 7 C 25.879156 7 27.420767 8.2681608 27.861328 10 L 20.138672 10 C 20.579233 8.2681608 22.120844 7 24 7 z M 11.650391 13 L 36.347656 13 L 33.855469 38.740234 C 33.730439 40.035363 32.667963 41 31.367188 41 L 16.630859 41 C 15.331937 41 14.267499 40.033606 14.142578 38.740234 L 11.650391 13 z M 20.476562 17.978516 A 1.50015 1.50015 0 0 0 19 19.5 L 19 34.5 A 1.50015 1.50015 0 1 0 22 34.5 L 22 19.5 A 1.50015 1.50015 0 0 0 20.476562 17.978516 z M 27.476562 17.978516 A 1.50015 1.50015 0 0 0 26 19.5 L 26 34.5 A 1.50015 1.50015 0 1 0 29 34.5 L 29 19.5 A 1.50015 1.50015 0 0 0 27.476562 17.978516 z" />
  </svg>
);

export const LogoutIcon = (props: any) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    {...props}
  >
    {/* Flecha hacia la izquierda */}
    <path
      d="M8 17l-5-5 5-5"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Línea horizontal */}
    <path
      d="M3 12h12"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    />
    {/* Puerta / caja */}
    <rect
      x="15"
      y="4"
      width="6"
      height="16"
      rx="2"
      stroke="currentColor"
      strokeWidth={2}
    />
  </svg>
);

export const ClipboardIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    fill="none"
    height="1.2em"
    width="1.2em"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden="true"
    {...props}
  >
    <path
      d="M16 4H18C19.1046 4 20 4.89543 20 6V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V6C4 4.89543 4.89543 4 6 4H8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 2H15C15.5523 2 16 2.44772 16 3V5C16 5.55228 15.5523 6 15 6H9C8.44772 6 8 5.55228 8 5V3C8 2.44772 8.44772 2 9 2Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    fill="none"
    height="1.2em"
    width="1.2em"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.5"
    {...props}
  >
    <path
      d="M3 6H5H21"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19 6L18.3333 19.3333C18.2982 20.0579 17.6875 20.6667 16.9629 20.6667H7.03712C6.31252 20.6667 5.70182 20.0579 5.66675 19.3333L5 6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 11V17"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 11V17"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    fill="none"
    viewBox="0 0 24 24"
    height="1.2em"
    width="1.2em"
    stroke="currentColor"
    strokeWidth={1.5}
    {...props}
  >
    <path
      d="M5 13L9 17L19 7"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const BlockIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    fill="none"
    viewBox="0 0 24 24"
    height="1.2em"
    width="1.2em"
    stroke="currentColor"
    strokeWidth={1.5}
    {...props}
  >
    <circle
      cx="12"
      cy="12"
      r="9"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <line
      x1="7.5"
      y1="16.5"
      x2="16.5"
      y2="7.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const BackArrowIcon = (props: any) => (
  <svg
    width="1.25em"
    height="1.25em"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M15 18L9 12L15 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <path
      d="M12 5v14m7-7H5"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export const CloseIcon = (props: any) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width="1.2em"
    height="1.2em"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const DownloadPdfIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    height="1.2em"
    width="1.2em"
    stroke="currentColor"
    strokeWidth={1.5}
    {...props}
  >
    <path
      d="M12 3v12m0 0l-4-4m4 4l4-4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
