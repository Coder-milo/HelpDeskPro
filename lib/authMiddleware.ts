import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export interface AuthRequest extends NextRequest {
  user?: {
    id: string;
    email?: string;
    role?: string;
    name?: string;
  };
}

// ctx es "any" porque en rutas dinámicas trae params como Promise
type Handler = (req: AuthRequest, ctx?: any) => Promise<NextResponse> | NextResponse;

export function authMiddleware(handler: Handler): Handler {
  return async (req: NextRequest, ctx?: any) => {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "No autorizado" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

      const authReq = req as AuthRequest;
      authReq.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        name: decoded.name,
      };

      // Pasamos ctx tal cual (puede contener params como Promise)
      return handler(authReq, ctx);
    } catch (error) {
      console.error("Error verificando token", error);
      return NextResponse.json(
        { message: "Token inválido" },
        { status: 401 }
      );
    }
  };
}
