import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Solo nos interesa proteger rutas que empiezan por /dashboard
  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  // ❌ Si no hay token → al login
  if (!token) {
    const loginUrl = new URL("/", req.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      role: "client" | "agent";
    };

    const role = decoded.role;

    // 🔒 Rutas solo para agentes
    if (pathname.startsWith("/dashboard/agente") && role !== "agent") {
      const clientUrl = new URL("/dashboard/client", req.url);
      return NextResponse.redirect(clientUrl);
    }

    // 🔒 Rutas solo para clientes
    if (pathname.startsWith("/dashboard/client") && role !== "client") {
      const agentUrl = new URL("/dashboard/agente", req.url);
      return NextResponse.redirect(agentUrl);
    }

    // ✅ Si todo bien, dejamos pasar
    return NextResponse.next();
  } catch (err) {
    console.error("JWT inválido en middleware:", err);
    const loginUrl = new URL("/", req.url);
    return NextResponse.redirect(loginUrl);
  }
}

// Indicamos a qué rutas aplica el middleware
export const config = {
  matcher: ["/dashboard/:path*"],
};
