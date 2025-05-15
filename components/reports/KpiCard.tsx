// components/KpiCard.tsx
import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/utils/utils";

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: number; // porcentaje de cambio
  color?: "primary" | "success" | "danger" | "warning";
}

const colorMap = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  danger: "bg-danger/10 text-danger",
  warning: "bg-warning/10 text-warning",
};

const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon, change, color = "primary" }) => {
  const formattedChange = change ? `${Math.abs(change)}%` : null;
  const changeIcon = change !== undefined ? (
    change >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />
  ) : null;

  return (
    <div className="flex flex-col justify-between gap-2 rounded-xl border p-4 shadow-sm bg-white">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full text-lg",
            colorMap[color]
          )}
        >
          {icon}
        </div>
        {formattedChange && (
          <div className={cn("flex items-center text-sm font-medium", colorMap[color])}>
            {changeIcon} {formattedChange}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold leading-tight">{value}</div>
      <div className="text-sm text-gray-500">{title}</div>
    </div>
  );
};

export default KpiCard;
