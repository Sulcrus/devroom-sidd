"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();
  const isLoggedIn = false; // We'll update this with auth state later

  return (
    <nav className="bg-white border-b border-amber-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-amber-600">
              Siddhartha Bank
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {!isLoggedIn ? (
              <>
                <Link
                  href="/login"
                  className={`text-gray-600 hover:text-amber-600 transition-colors ${
                    pathname === "/login" ? "text-amber-600 font-semibold" : ""
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className={`text-gray-600 hover:text-amber-600 transition-colors ${
                    pathname === "/dashboard" ? "text-amber-600 font-semibold" : ""
                  }`}
                >
                  Dashboard
                </Link>
                <button className="text-red-600 hover:text-red-700 transition-colors">
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 