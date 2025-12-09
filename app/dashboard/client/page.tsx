"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { TicketCard } from "@/components/TickectCard";
import { CommentList } from "@/components/commenList";
import { CommentForm } from "@/components/commentForm";
import {
  getTicketsByUser,
  createTicket,
  getComments,
  addComment,
} from "@/services/tecketServices";

type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
type TicketPriority = "low" | "medium" | "high";

interface Ticket {
  _id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
}

interface Comment {
  _id: string;
  authorName: string;
  authorRole: "client" | "agent";
  message: string;
  createdAt: string;
}

export default function ClientDashboard() {
  const router = useRouter();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState<TicketPriority>("medium"); // 👈 prioridad por defecto

  const fetchTickets = async () => {
    try {
      const data = await getTicketsByUser();
      setTickets(data);
    } catch (err) {
      console.error("Error al obtener tickets:", err);
    }
  };

  const fetchComments = async (ticketId: string) => {
    try {
      const data = await getComments(ticketId);
      setComments(data);
    } catch (err) {
      console.error("Error al obtener comentarios:", err);
    }
  };

  useEffect(() => {
    // No llamar al backend hasta tener token en localStorage (evita el error en consola)
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;
    fetchTickets();
  }, []);

  const handleView = async (ticket: Ticket) => {
    setSelectedTicket(ticket);
    fetchComments(ticket._id);
  };

  const handleAddComment = async (message: string) => {
    if (!selectedTicket) return;
    try {
      await addComment(selectedTicket._id, message);
      fetchComments(selectedTicket._id);
    } catch (err) {
      console.error("Error al agregar comentario:", err);
    }
  };

  const handleCreateTicket = async () => {
    if (!newTitle.trim() || !newDescription.trim()) return;
    try {
      // 👇 ahora también enviamos la prioridad
      await createTicket(newTitle.trim(), newDescription.trim(), newPriority);
      setNewTitle("");
      setNewDescription("");
      setNewPriority("medium");
      fetchTickets();
    } catch (err) {
      console.error("Error al crear ticket:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout").catch(() => {});
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
      }
      router.push("/");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-indigo-50 to-emerald-50">
      {/* Orbes decorativos “otro mundo” */}
      <div className="pointer-events-none absolute -top-32 -right-10 h-72 w-72 rounded-full bg-sky-300/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-16 h-80 w-80 rounded-full bg-indigo-300/40 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-200/30 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-800">
              Mis tickets de soporte
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Crea nuevos tickets, revisa el estado de tus solicitudes y sigue
              la conversación con el equipo de soporte.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-medium text-slate-500 shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-sky-400" />
              <span>Cliente conectado</span>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-[11px] font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:shadow"
            >
              Cerrar sesión
            </button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* Columna izquierda: crear ticket + listado */}
          <div className="space-y-4">
            {/* Crear ticket */}
            <div className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-[0_14px_40px_rgba(15,23,42,0.12)] backdrop-blur-xl">
              <h2 className="text-sm font-semibold text-slate-800">
                Crear nuevo ticket
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Describe tu problema o solicitud para que el equipo pueda
                ayudarte lo más rápido posible.
              </p>

              <div className="mt-4 space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">
                    Título
                  </label>
                  <input
                    placeholder="Ej. No puedo ingresar a mi cuenta"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none ring-offset-2 ring-offset-transparent placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">
                    Descripción
                  </label>
                  <textarea
                    placeholder="Cuéntanos qué está pasando, qué esperabas que ocurriera y cualquier detalle relevante (errores, capturas, etc.)"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    rows={4}
                    className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none ring-offset-2 ring-offset-transparent placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-300"
                  />
                </div>

                {/* Prioridad */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">
                    Prioridad
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) =>
                      setNewPriority(e.target.value as TicketPriority)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none ring-offset-2 ring-offset-transparent focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300"
                  >
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleCreateTicket}
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-400 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:brightness-110 hover:shadow-indigo-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  Crear ticket
                </button>
              </div>
            </div>

            {/* Listado de tickets */}
            <div className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.10)] backdrop-blur-xl">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-800">
                  Historial de tickets
                </h2>
                <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                  {tickets.length} registro(s)
                </span>
              </div>

              {tickets.length === 0 ? (
                <p className="text-xs text-slate-400">
                  Aún no has creado tickets. Usa el formulario de arriba para
                  iniciar una nueva solicitud.
                </p>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {tickets.map((t) => (
                    <div key={t._id} className={`rounded-2xl border border-white/60 bg-white/90 p-3 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md ${
                      selectedTicket?._id === t._id ? "ring-2 ring-indigo-300" : ""
                    }`}>
                      {/* Usar div role="button" para evitar button dentro de button (hydration error) */}
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => handleView(t)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleView(t);
                          }
                        }}
                        className="group flex h-full w-full flex-col p-2 text-left outline-none"
                      >
                        <TicketCard {...t} onView={() => handleView(t)} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Columna derecha: detalle del ticket */}
          <div className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-[0_14px_40px_rgba(15,23,42,0.12)] backdrop-blur-xl">
            {selectedTicket ? (
              <>
                <div className="mb-3">
                  <h2 className="text-sm font-semibold text-slate-800">
                    {selectedTicket.title}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Creado el{" "}
                    <span className="font-medium text-slate-700">
                      {new Date(selectedTicket.createdAt).toLocaleString()}
                    </span>
                  </p>
                  <p className="mt-2 text-xs text-slate-600">
                    {selectedTicket.description}
                  </p>
                  <p className="mt-2 text-[11px] text-slate-500">
                    Prioridad:{" "}
                    <span className="font-semibold">
                      {selectedTicket.priority === "high"
                        ? "Alta"
                        : selectedTicket.priority === "medium"
                        ? "Media"
                        : "Baja"}
                    </span>
                  </p>
                </div>

                <div className="mt-4 border-t border-slate-100 pt-3">
                  <h3 className="mb-2 text-xs font-semibold text-slate-700">
                    Conversación con soporte
                  </h3>
                  <div className="max-h-64 overflow-y-auto pr-1">
                    <CommentList comments={comments} />
                  </div>

                  <div className="mt-3">
                    <CommentForm onSubmit={handleAddComment} />
                  </div>
                </div>
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                <p className="text-sm font-medium text-slate-700">
                  Selecciona un ticket para ver los detalles
                </p>
                <p className="text-xs text-slate-500">
                  Aquí aparecerá la descripción completa y la conversación con
                  el equipo de soporte.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
