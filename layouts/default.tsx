"use client";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Link } from "@heroui/link";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Head } from "./head";
import { Navbar } from "@/components/navbar/navbar";
import { isTokenExpired } from "@/utils/auth";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && isTokenExpired()) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="relative flex flex-col h-screen">
      <Head />
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
        {children}
      </main>
      <footer className="w-full flex flex-col sm:flex-row items-center justify-center gap-1 px-4 py-3 text-center text-sm">
        <Link
          isExternal
          href="#"
          title="Bienestapp"
          className="flex flex-col sm:flex-row items-center gap-1 text-current"
        >
          <span className="text-default-600">
            Desarrollada por estudiantes de Ingeniería de Sistemas
          </span>
          <p className="text-primary font-semibold">Bienestapp</p>
        </Link>
      </footer>
    </div>
  );
}
