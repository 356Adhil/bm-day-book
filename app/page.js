// bm-day-book/app/page.js
"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard"); // Redirect to dashboard if logged in
    }
  }, [router]);
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to BM Day Book</h1>
      <p className="text-lg mb-6">
        Manage daily sales, expenses, and track everything effortlessly.
      </p>
      <div className="flex space-x-4">
        <Link href="/login">Login</Link>
        <Link href="/dashboard">Dashboard</Link>
      </div>
    </div>
  );
}
