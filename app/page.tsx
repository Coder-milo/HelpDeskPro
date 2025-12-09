"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function HomePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("/api/auth/login", { email, password });
      const { token, role } = res.data;
      localStorage.setItem("token", token);

      if (role === "client") router.push("/dashboard/client");
      else if (role === "agent") router.push("/dashboard/agente");
      else router.push("/"); // fallback por si acaso
    } catch (err: any) {
      setError(err.response?.data?.message || "Error de login");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-sky-50 via-indigo-50 to-emerald-50">
      {/* Orbes decorativos “otro mundo” */}
      <div className="pointer-events-none absolute -top-32 -right-16 h-72 w-72 rounded-full bg-sky-300/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-10 h-80 w-80 rounded-full bg-indigo-300/40 blur-3xl" />

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-800">
            HelpDesk
            <span className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
              Pro
            </span>
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Gestiona tus tickets con una experiencia limpia, moderna y luminosa.
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-6 rounded-2xl border border-white/60 bg-white/80 p-8 shadow-[0_18px_60px_rgba(15,23,42,0.18)] backdrop-blur-xl"
        >
          <h2 className="text-center text-sm font-semibold text-slate-700 mb-2">
            Iniciar sesión
          </h2>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 border border-red-100">
              {error}
            </p>
          )}

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="tucorreo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2.5 text-sm text-slate-900 outline-none ring-offset-2 ring-offset-transparent placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-300"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2.5 text-sm text-slate-900 outline-none ring-offset-2 ring-offset-transparent placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-400 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:brightness-110 hover:shadow-xl hover:shadow-indigo-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Entrar al sistema
          </button>
        </form>

        <p className="mt-6 text-center text-[10px] uppercase tracking-[0.2em] text-slate-400">
          Soporte en otra dimensión
        </p>
      </div>
    </div>
  );
}
