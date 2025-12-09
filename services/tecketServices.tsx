// services/tecketServices.ts
// OJO: extensión .ts, no es necesario .tsx porque no hay JSX

const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

export const getTicketsByUser = async () => {
  const token = getToken();
  if (!token) {
    console.error("No hay token en localStorage");
    throw new Error("No hay sesión activa");
  }

  const res = await fetch("/api/tickets", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Error al obtener tickets:", res.status, text);
    throw new Error("Error al obtener tickets");
  }

  return res.json();
};

export const createTicket = async (
  title: string,
  description: string,
  priority?: "low" | "medium" | "high"
) => {
  const token = getToken();
  if (!token) {
    throw new Error("No hay sesión activa");
  }

  const res = await fetch("/api/tickets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, description, priority }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Error al crear ticket:", res.status, text);
    throw new Error("Error al crear ticket");
  }

  return res.json();
};

export const getComments = async (ticketId: string) => {
  const token = getToken();
  if (!token) {
    throw new Error("No hay sesión activa");
  }

  const res = await fetch(`/api/comments/${ticketId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Error al obtener comentarios:", res.status, text);
    throw new Error("Error al obtener comentarios");
  }

  return res.json();
};

export const addComment = async (ticketId: string, message: string) => {
  const token = getToken();
  if (!token) {
    throw new Error("No hay sesión activa");
  }

  const res = await fetch(`/api/comments/${ticketId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Error al agregar comentario:", res.status, text);
    throw new Error("Error al agregar comentario");
  }

  return res.json();
};
