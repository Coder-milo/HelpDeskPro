import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongo";
import Ticket from "@/models/ticket";
import { authMiddleware, AuthRequest } from "@/lib/authMiddleware";

// GET /api/tickets/:id  (opcional)
const baseGet = async (
  req: AuthRequest,
  ctx: { params: Promise<{ id: string }> }
) => {
  await connectMongo();
  const { id } = await ctx.params;

  const ticket = await Ticket.findById(id);
  if (!ticket) {
    return NextResponse.json(
      { message: "Ticket no encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(ticket, { status: 200 });
};

const basePut = async (
  req: AuthRequest,
  ctx: { params: Promise<{ id: string }> }
) => {
  await connectMongo();
  const { id } = await ctx.params;

  const { status, priority, assignedTo } = await req.json();

  const update: any = {};
  if (status) update.status = status;
  if (priority) update.priority = priority;
  if (assignedTo !== undefined) update.assignedTo = assignedTo;

  const ticket = await Ticket.findByIdAndUpdate(id, update, { new: true });

  if (!ticket) {
    return NextResponse.json(
      { message: "Ticket no encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(ticket, { status: 200 });
};
const baseDelete = async (
  req: AuthRequest,
  ctx: { params: Promise<{ id: string }> }
) => {
  await connectMongo();
  const { id } = await ctx.params;

  const ticket = await Ticket.findByIdAndDelete(id);

  if (!ticket) {
    return NextResponse.json(
      { message: "Ticket no encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "Ticket eliminado" }, { status: 200 });
};

export const GET = authMiddleware(baseGet);
export const PUT = authMiddleware(basePut);
export const DELETE = authMiddleware(baseDelete);
