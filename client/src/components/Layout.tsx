import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Full-width navbar */}
      <header className="w-full bg-slate-900 text-white">
        <Navbar />
      </header>

      {/* Centered main content */}
      <main className="flex-grow px-4 py-6 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <Outlet />
      </main>

      {/* Full-width footer */}
      <footer className="w-full bg-gray-200 text-center py-4 text-sm text-gray-500">
        © 2025 Trackside Ops — All Rights Reserved
      </footer>
    </div>
  );
}
