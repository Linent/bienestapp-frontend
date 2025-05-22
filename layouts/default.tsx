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
        <span className="text-default-600">
          Desarrollada por estudiantes de Ingeniería de Sistemas
        </span>
        <p className="text-primary font-semibold">Bienestapp</p>
        <span className="mx-2 text-default-400">|</span>
        <Link
          href="/privacyPolicyPage"
          className="text-default-500 hover:text-primary underline transition-colors"
        >
          Política de Privacidad
        </Link>
      </footer>
    </div>
  );
}
