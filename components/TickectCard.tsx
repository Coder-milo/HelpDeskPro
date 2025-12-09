"use client";

import { Badge } from "./badge";
import { Button } from "./button";

export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high";

export interface TicketCardProps {
  _id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  onView: () => void;
  onChangeStatus?: (nextStatus: TicketStatus) => void;
  canChangeStatus?: boolean;
}

export const TicketCard: React.FC<TicketCardProps> = ({
  _id,
  title,
  description,
  status,
  priority,
  createdAt,
  onView,
  onChangeStatus,
  canChangeStatus = false,
}) => {
  const statusVariant =
    status === "open"
      ? "status-open"
      : status === "in_progress"
      ? "status-in-progress"
      : "status-resolved";

  const priorityVariant =
    priority === "low"
      ? "priority-low"
      : priority === "medium"
      ? "priority-medium"
      : "priority-high";

  const nextStatus: TicketStatus =
    status === "open" ? "in_progress" : status === "in_progress" ? "resolved" : status;

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold text-slate-800 line-clamp-1">{title}</h3>
        <span className="text-[10px] text-slate-400">
          {new Date(createdAt).toLocaleString()}
        </span>
      </div>

      <p className="text-sm text-slate-600 line-clamp-2">{description}</p>

      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant={statusVariant}>{status}</Badge>
        <Badge variant={priorityVariant}>Prioridad: {priority}</Badge>
      </div>

      <div className="flex justify-end gap-2 mt-2">
        <Button variant="secondary" size="sm" onClick={onView}>
          Ver detalle
        </Button>

        {canChangeStatus && onChangeStatus && status !== "resolved" && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onChangeStatus(nextStatus)}
          >
            Cambiar a {nextStatus}
          </Button>
        )}
      </div>
    </div>
  );
};
