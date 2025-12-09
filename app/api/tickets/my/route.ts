import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongo";
import Ticket from "@/models/ticket";
import { authMiddleware, AuthRequest } from "@/lib/authMiddleware";

const baseGet = async (req: AuthRequest) => {
  await connectMongo();

  const userId = req.user?.id;

  if (!userId) {
    return NextResponse.json(
      { message: "Usuario no encontrado en el token" },
      { status: 401 }
    );
  }

  const tickets = await Ticket.find({ userId }).sort({ createdAt: -1 });

  return NextResponse.json(tickets, { status: 200 });
};

// GET /api/tickets/my
export const GET = authMiddleware(baseGet);
