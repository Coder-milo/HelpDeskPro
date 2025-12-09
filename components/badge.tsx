"use client";

import React from "react";
import clsx from "clsx";

type BadgeVariant =
  | "status-open"
  | "status-in-progress"
  | "status-resolved"
  | "status-closed"
  | "priority-low"
  | "priority-medium"
  | "priority-high";

export interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant, children, className }) => {
  const base = "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold";

  const map: Record<BadgeVariant, string> = {
    "status-open": "bg-green-100 text-green-700",
    "status-in-progress": "bg-yellow-100 text-yellow-700",
    "status-resolved": "bg-slate-100 text-slate-700",
    "status-closed": "bg-slate-200 text-slate-600",
    "priority-low": "bg-sky-100 text-sky-700",
    "priority-medium": "bg-orange-100 text-orange-700",
    "priority-high": "bg-red-100 text-red-700",
  };

  return <span className={clsx(base, map[variant], className)}>{children}</span>;
};
