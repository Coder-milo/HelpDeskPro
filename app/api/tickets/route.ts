import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongo";
import Ticket from "@/models/ticket";
import { authMiddleware, AuthRequest } from "@/lib/authMiddleware";

const baseGet = async (req: AuthRequest) => {
  await connectMongo();

  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const priority = url.searchParams.get("priority");

  const role = req.user?.role;
  const userId = req.user?.id;

  const query: any = {};

  // Cliente → solo sus tickets
  if (!role || role === "client") {
    if (!userId) {
      return NextResponse.json(
        { message: "Usuario no encontrado en el token" },
        { status: 401 }
      );
    }
    query.userId = userId;
  }
  // Agent / admin → ven todos (query vacío)

  if (status) query.status = status;
  if (priority) query.priority = priority;

  const tickets = await Ticket.find(query).sort({ createdAt: -1 });

  return NextResponse.json(tickets, { status: 200 });
};

const basePost = async (req: AuthRequest) => {
  await connectMongo();

  // Leer y loguear el body para depuración
  const body = await req.json();
  console.log("POST /api/tickets body:", body);
  const { title, description, priority } = body;

  if (!title || !description) {
    return NextResponse.json(
      { message: "title y description son obligatorios" },
      { status: 400 }
    );
  }

  const userId = req.user?.id;

  if (!userId) {
    return NextResponse.json(
      { message: "Usuario no encontrado en el token" },
      { status: 401 }
    );
  }

  const ticket = await Ticket.create({
    title,
    description,
    priority: priority || "medium",
    userId,
  });

  return NextResponse.json(ticket, { status: 201 });
};

// GET y POST /api/tickets
export const GET = authMiddleware(baseGet);
export const POST = authMiddleware(basePost);
