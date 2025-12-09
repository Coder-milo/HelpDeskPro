import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/lib/mongo";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  await connectMongo();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json(
      { message: "Usuario no encontrado" },
      { status: 401 }
    );
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json(
      { message: "Contraseña incorrecta" },
      { status: 401 }
    );
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );

  // 👇 Creamos la respuesta
  const res = NextResponse.json({
    token, // lo sigues usando para axios si quieres
    role: user.role,
    name: user.name,
  });

  // 👇 Guardamos token en cookie (para middleware)
  res.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 día
  });

  return res;
}
