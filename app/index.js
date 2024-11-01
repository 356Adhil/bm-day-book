// bm-day-book/app/pages/index.js
import Link from "next/link";
import Header from "./components/Header";

export default function Home() {
  return (
    <div>
      <Header />
      <main className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold mb-4">Welcome to BM Day Book</h1>
        <p className="mb-6">
          Track sales, expenses, and close the day efficiently.
        </p>
        <div className="flex space-x-4">
          <Link href="/login">
            <a className="px-4 py-2 bg-blue-600 text-white rounded">Login</a>
          </Link>
          <Link href="/dashboard">
            <a className="px-4 py-2 bg-green-600 text-white rounded">
              Dashboard
            </a>
          </Link>
        </div>
      </main>
    </div>
  );
}
