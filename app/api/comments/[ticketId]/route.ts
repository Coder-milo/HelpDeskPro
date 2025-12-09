import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongo";
import Comment from "@/models/comment";
import { authMiddleware, AuthRequest } from "@/lib/authMiddleware";

// GET /api/comments/:ticketId
const baseGet = async (
  req: AuthRequest,
  ctx: { params: Promise<{ ticketId: string }> }
) => {
  await connectMongo();
  const { ticketId } = await ctx.params; // 👈 IMPORTANTE

  const comments = await Comment.find({ ticketId }).sort({ createdAt: 1 });

  return NextResponse.json(comments, { status: 200 });
};

// POST /api/comments/:ticketId
const basePost = async (
  req: AuthRequest,
  ctx: { params: Promise<{ ticketId: string }> }
) => {
  await connectMongo();
  const { ticketId } = await ctx.params; // 👈 IMPORTANTE

  const userId = req.user?.id;
  if (!userId) {
    return NextResponse.json(
      { message: "No autorizado" },
      { status: 401 }
    );
  }

  const { message } = await req.json();
  if (!message) {
    return NextResponse.json(
      { message: "Mensaje requerido" },
      { status: 400 }
    );
  }

  const comment = await Comment.create({
    ticketId,
    authorId: userId,
    authorName: req.user?.name || req.user?.email || "Usuario",
    authorRole: (req.user?.role as "client" | "agent") || "client",
    message,
  });

  return NextResponse.json(comment, { status: 201 });
};

export const GET = authMiddleware(baseGet);
export const POST = authMiddleware(basePost);
