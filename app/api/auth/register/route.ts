import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/lib/mongo";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { name, email, password, role } = await req.json();
  await connectMongo();

  const existingUser = await User.findOne({ email });
  if (existingUser) return NextResponse.json({ message: "Usuario ya existe" }, { status: 400 });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword, role });

  return NextResponse.json({ message: "Usuario registrado", user: { name: user.name, email: user.email, role: user.role } });
}
