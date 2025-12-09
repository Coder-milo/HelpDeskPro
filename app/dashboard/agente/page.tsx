"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; 
import { Button } from "@/components/button";
import { Badge } from "@/components/badge";
import { Card } from "@/components/card";

type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
type TicketPriority = "low" | "medium" | "high";

type Ticket = {
  _id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  userId?: string;
  createdBy?: {
    name: string;
    email: string;
  };
};

type Comment = {
  _id: string;
  authorName: string;
  authorRole: "client" | "agent";
  message: string;
  createdAt: string;
};

export default function AgentDashboard() {
  const router = useRouter(); 

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterPriority, setFilterPriority] = useState<string>("");
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isErrorMessage, setIsErrorMessage] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) return;
    fetchTickets();
  }, [filterStatus, filterPriority, token]);

  const fetchTickets = async () => {
    try {
      const res = await axios.get("/api/tickets", {
        headers: { Authorization: `Bearer ${token}` },
        params: { status: filterStatus, priority: filterPriority },
      });
      setTickets(res.data);
    } catch (err) {
      console.error("Error al obtener tickets:", err);
    }
  };

  const fetchComments = async (ticketId: string) => {
    try {
      const res = await axios.get(`/api/comments/${ticketId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(res.data);
    } catch (err) {
      console.error("Error al obtener comentarios:", err);
    }
  };

  const handleSelectTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    fetchComments(ticket._id);
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !selectedTicket) return;
    try {
      await axios.post(
        `/api/comments/${selectedTicket._id}`,
        { message: newComment.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment("");
      fetchComments(selectedTicket._id);
    } catch (err) {
      console.error("Error al agregar comentario:", err);
    }
  };

  const handleUpdateTicket = async (status: TicketStatus) => {
    if (!selectedTicket) return;
    try {
      await axios.put(
        `/api/tickets/${selectedTicket._id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTickets();
      setSelectedTicket({ ...selectedTicket, status });
    } catch (err) {
      console.error("Error al actualizar ticket:", err);
    }
  };

  const handleCreateClient = async () => {
    if (!newClient.name || !newClient.email || !newClient.password) return;
    try {
      await axios.post(
        "/api/auth/register",
        { ...newClient, role: "client" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsErrorMessage(false);
      setMessage("Cliente creado con éxito ✨");
      setNewClient({ name: "", email: "", password: "" });
    } catch (err: any) {
      console.error("Error al crear cliente:", err);
      setIsErrorMessage(true);
      setMessage(err.response?.data?.message || "Error al crear cliente");
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
      {/* Orbes decorativos */}
      <div className="pointer-events-none absolute -top-32 -right-10 h-72 w-72 rounded-full bg-sky-300/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-16 h-80 w-80 rounded-full bg-indigo-300/40 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-200/30 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-800">
              Panel de agente
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Gestiona tickets, acompaña a los clientes y mantén todo bajo
              control en una interfaz limpia y luminosa.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-medium text-slate-500 shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>Sesión activa</span>
              <span className="hidden sm:inline">· HelpDeskPro</span>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-[11px] font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:shadow"
            >
              Cerrar sesión
            </button>
          </div>
        </header>



        <div className="grid gap-6 lg:grid-cols-[1.5fr_1.1fr]">
          {}
          <div className="space-y-4">
            {}
            <Card>
              <div className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-[0_14px_40px_rgba(15,23,42,0.12)] backdrop-blur-xl">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold text-slate-700">
                    Filtros de tickets
                  </h2>
                  <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                    {tickets.length} registro(s)
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600">
                      Estado
                    </label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none ring-offset-2 ring-offset-transparent focus:border-sky-400 focus:ring-2 focus:ring-sky-300"
                    >
                      <option value="">Todos</option>
                      <option value="open">Abierto</option>
                      <option value="in_progress">En progreso</option>
                      <option value="resolved">Resuelto</option>
                      <option value="closed">Cerrado</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600">
                      Prioridad
                    </label>
                    <select
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none ring-offset-2 ring-offset-transparent focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300"
                    >
                      <option value="">Todas</option>
                      <option value="low">Baja</option>
                      <option value="medium">Media</option>
                      <option value="high">Alta</option>
                    </select>
                  </div>
                </div>
              </div>
            </Card>

            {/* Listado de tickets */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {tickets.map((ticket) => (
                <Card key={ticket._id}>
                  <button
                    type="button"
                    onClick={() => handleSelectTicket(ticket)}
                    className={`group flex h-full w-full flex-col rounded-2xl border border-white/60 bg-white/80 p-4 text-left shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-100 ${
                      selectedTicket?._id === ticket._id
                        ? "ring-2 ring-indigo-300"
                        : ""
                    }`}
                  >
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <h3 className="line-clamp-2 text-sm font-semibold text-slate-800">
                        {ticket.title}
                      </h3>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                        #{ticket._id.slice(-4)}
                      </span>
                    </div>

                    <p className="line-clamp-3 text-xs text-slate-500">
                      {ticket.description}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="text-[11px] text-slate-500">
                        {ticket.createdBy?.name ?? "Cliente"}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        · {ticket.createdBy?.email ?? "Sin correo"}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex flex-wrap gap-2 text-[11px]">
                        <Badge
                          variant={
                            ticket.status === "open"
                              ? "status-open"
                              : ticket.status === "in_progress"
                              ? "status-in-progress"
                              : ticket.status === "resolved"
                              ? "status-resolved"
                              : "status-closed"
                          }
                          className="rounded-full px-2 py-1 text-[11px] font-medium capitalize"
                        >
                          {ticket.status === "open"
                            ? "Abierto"
                            : ticket.status === "in_progress"
                            ? "En progreso"
                            : ticket.status === "resolved"
                            ? "Resuelto"
                            : "Cerrado"}
                        </Badge>
                        <Badge
                          variant={
                            ticket.priority === "high"
                              ? "priority-high"
                              : ticket.priority === "medium"
                              ? "priority-medium"
                              : "priority-low"
                          }
                          className="rounded-full px-2 py-1 text-[11px] font-medium capitalize"
                        >
                          {ticket.priority === "high"
                            ? "Alta"
                            : ticket.priority === "medium"
                            ? "Media"
                            : "Baja"}
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-3 flex justify-end">
                      <Button className="rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition group-hover:shadow-md">
                        Ver detalles
                      </Button>
                    </div>
                  </button>
                </Card>
              ))}

              {tickets.length === 0 && (
                <div className="col-span-full rounded-2xl border border-dashed border-slate-200/80 bg-white/60 p-6 text-center text-sm text-slate-400 backdrop-blur">
                  No hay tickets que coincidan con los filtros.
                </div>
              )}
            </div>
          </div>

          {}
          <div className="space-y-4">
            {/* Crear cliente */}
            <Card>
              <div className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-[0_14px_40px_rgba(15,23,42,0.12)] backdrop-blur-xl">
                <h2 className="text-sm font-semibold text-slate-800">
                  Crear nuevo cliente
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Registra rápidamente una cuenta de cliente para asignarle
                  tickets.
                </p>

                <div className="mt-4 space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Ana Martínez"
                      value={newClient.name}
                      onChange={(e) =>
                        setNewClient({ ...newClient, name: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none ring-offset-2 ring-offset-transparent placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-300"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      placeholder="cliente@ejemplo.com"
                      value={newClient.email}
                      onChange={(e) =>
                        setNewClient({ ...newClient, email: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none ring-offset-2 ring-offset-transparent placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-300"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={newClient.password}
                      onChange={(e) =>
                        setNewClient({
                          ...newClient,
                          password: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none ring-offset-2 ring-offset-transparent placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300"
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <Button
                    onClick={handleCreateClient}
                    className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:brightness-110 hover:shadow-indigo-500/40"
                  >
                    Crear cliente
                  </Button>
                </div>

                {message && (
                  <p
                    className={`mt-3 rounded-lg px-3 py-2 text-xs font-medium ${
                      isErrorMessage
                        ? "border border-rose-100 bg-rose-50 text-rose-600"
                        : "border border-emerald-100 bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    {message}
                  </p>
                )}
              </div>
            </Card>

            
            <Card>
              <div className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-[0_14px_40px_rgba(15,23,42,0.12)] backdrop-blur-xl">
                {selectedTicket ? (
                  <>
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <div>
                        <h2 className="text-sm font-semibold text-slate-800">
                          {selectedTicket.title}
                        </h2>
                        <p className="mt-1 text-xs text-slate-500">
                          {selectedTicket.createdBy?.name ?? "Cliente"} ·{" "}
                          <span className="text-slate-400">
                            {selectedTicket.createdBy?.email ?? "Sin correo"}
                          </span>
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge
                          variant={
                            selectedTicket.status === "open"
                              ? "status-open"
                              : selectedTicket.status === "in_progress"
                              ? "status-in-progress"
                              : selectedTicket.status === "resolved"
                              ? "status-resolved"
                              : "status-closed"
                          }
                          className="rounded-full px-2 py-1 text-[11px] font-medium capitalize"
                        >
                          {selectedTicket.status === "open"
                            ? "Abierto"
                            : selectedTicket.status === "in_progress"
                            ? "En progreso"
                            : selectedTicket.status === "resolved"
                            ? "Resuelto"
                            : "Cerrado"}
                        </Badge>
                        <Badge
                          variant={
                            selectedTicket.priority === "high"
                              ? "priority-high"
                              : selectedTicket.priority === "medium"
                              ? "priority-medium"
                              : "priority-low"
                          }
                          className="rounded-full px-2 py-1 text-[11px] font-medium capitalize"
                        >
                          {selectedTicket.priority === "high"
                            ? "Alta"
                            : selectedTicket.priority === "medium"
                            ? "Media"
                            : "Baja"}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600">
                      {selectedTicket.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        onClick={() => handleUpdateTicket("in_progress")}
                        className="rounded-xl bg-slate-900/90 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-900"
                      >
                        Marcar en progreso
                      </Button>
                      <Button
                        onClick={() => handleUpdateTicket("resolved")}
                        className="rounded-xl bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-600"
                      >
                        Marcar resuelto
                      </Button>
                      <Button
                        onClick={() => handleUpdateTicket("closed")}
                        className="rounded-xl bg-rose-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-rose-600"
                      >
                        Cerrar
                      </Button>
                    </div>

                    {/* Comentarios */}
                    <div className="mt-5">
                      <h3 className="text-xs font-semibold text-slate-700">
                        Comentarios
                      </h3>
                      <div className="mt-2 max-h-60 space-y-2 overflow-y-auto pr-1">
                        {comments.length === 0 && (
                          <p className="text-[11px] text-slate-400">
                            Aún no hay comentarios en este ticket.
                          </p>
                        )}
                        {comments.map((c) => (
                          <div
                            key={c._id}
                            className="rounded-xl bg-slate-50/80 px-3 py-2 text-xs text-slate-700"
                          >
                            <p className="font-medium text-slate-800">
                              {c.authorName}{" "}
                              <span className="text-[10px] text-slate-400">
                                ({c.authorRole === "agent"
                                  ? "Agente"
                                  : "Cliente"}
                                )
                              </span>
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {new Date(c.createdAt).toLocaleString()}
                            </p>
                            <p className="mt-1 text-xs text-slate-600">
                              {c.message}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 flex gap-2">
                        <input
                          type="text"
                          placeholder="Agregar comentario..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="flex-1 rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-xs text-slate-900 outline-none ring-offset-2 ring-offset-transparent placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-300"
                        />
                        <Button
                          onClick={handleCommentSubmit}
                          className="rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:shadow-md"
                        >
                          Enviar
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                    <p className="text-sm font-medium text-slate-700">
                      Selecciona un ticket
                    </p>
                    <p className="text-xs text-slate-500">
                      El panel de detalles aparecerá aquí cuando elijas un
                      ticket del listado.
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
