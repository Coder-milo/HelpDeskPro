"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // Si no hay token, lo mando al login
      router.replace("/");
      setIsAuth(false);
    } else {
      setIsAuth(true);
    }
  }, [router]);

  // Mientras revisa el token (o mientras redirige) no pintes nada
  if (isAuth === null) {
    return null; // o un spinner si quieres
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-emerald-50">
      {children}
    </div>
  );
}
