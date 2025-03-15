"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import useUserStore from "@/store/useUserStore";
import useThemeStore from "@/store/useThemeStore";
import { LoadingProfile, UserProfile, ErrorProfile } from "@/components/dashboard/UserProfile";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: string;
  marital_status: string;
}

interface EasterEgg {
  isVisible: boolean;
  position: { x: number; y: number };
}

const menuItems = [
  {
    title: "Overview",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    href: "/dashboard",
  },
  {
    title: "Accounts",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
    href: "/dashboard/accounts",
  },
  {
    title: "Transfer",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    href: "/dashboard/transfer",
  },
  {
    title: "Payments",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    href: "/dashboard/payments",
  },
  {
    title: "Cards",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    href: "/dashboard/cards",
  },
  {
    title: "Settings",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    href: "/dashboard/settings",
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Zustand state
  const { user, loading, fetchUser, logout } = useUserStore();
  const { theme, toggleTheme } = useThemeStore();

  // Easter egg state
  const [easterEgg, setEasterEgg] = useState<EasterEgg>({
    isVisible: false,
    position: { x: 0, y: 0 },
  });
  const [clickCount, setClickCount] = useState(0);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogoClick = () => {
    setClickCount(prev => {
      if (prev === 2) {
        const randomX = Math.random() * (windowSize.width * 0.8);
        const randomY = Math.random() * (windowSize.height * 0.8);
        setEasterEgg({
          isVisible: true,
          position: { x: randomX, y: randomY }
        });
        return 0;
      }
      return prev + 1;
    });
  };

  useEffect(() => {
    if (easterEgg.isVisible) {
      const timer = setTimeout(() => {
        setEasterEgg(prev => ({ ...prev, isVisible: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [easterEgg.isVisible]);

  // Add this effect to debug state changes
  useEffect(() => {
    console.log('Loading state:', loading);
    console.log('User state:', user);
  }, [loading, user]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Easter Egg Animation */}
      {windowSize.width > 0 && (
        <AnimatePresence>
          {easterEgg.isVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              style={{
                position: 'fixed',
                left: easterEgg.position.x,
                top: easterEgg.position.y,
                zIndex: 100,
              }}
              className="pointer-events-none"
            >
              <div className="relative">
                {/* Blue Box Character */}
                <div className="w-24 h-24 bg-blue-500 rounded-lg relative overflow-hidden">
                  {/* Eyes */}
                  <div className="absolute top-6 left-4 w-4 h-4 bg-white rounded-full">
                    <div className="absolute top-1 left-1 w-2 h-2 bg-black rounded-full animate-pulse" />
                  </div>
                  <div className="absolute top-6 right-4 w-4 h-4 bg-white rounded-full">
                    <div className="absolute top-1 left-1 w-2 h-2 bg-black rounded-full animate-pulse" />
                  </div>
                  {/* Mouth */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-white rounded-full">
                    <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-6 h-2 bg-red-400 rounded-full" />
                  </div>
                  {/* Blush */}
                  <div className="absolute bottom-8 left-3 w-3 h-2 bg-pink-400 rounded-full opacity-50" />
                  <div className="absolute bottom-8 right-3 w-3 h-2 bg-pink-400 rounded-full opacity-50" />
                </div>
                {/* Speech Bubble */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 px-4 py-2 rounded-xl shadow-lg"
                >
                  <p className="text-sm font-medium text-blue-500">
                    こんにちは! (｡◕‿◕｡)
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-200 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full w-64">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b dark:border-gray-700">
            <div 
              onClick={handleLogoClick} 
              className="flex items-center space-x-2 cursor-pointer"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                SiddarthaBank
              </span>
            </div>
          </div>

          {/* User Profile */}
          <div className="p-6 border-b dark:border-gray-700">
            {loading ? (
              <LoadingProfile />
            ) : user ? (
              <UserProfile user={user} />
            ) : (
              <ErrorProfile onRetry={fetchUser} />
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  pathname === item.href
                    ? "bg-amber-50 text-amber-600 dark:bg-amber-900/50 dark:text-amber-500"
                    : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.title}</span>
                {pathname === item.href && (
                  <motion.div
                    layoutId="sidebar-active-indicator"
                    className="absolute right-3 w-1.5 h-5 bg-amber-500 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t dark:border-gray-700">
            <button
              onClick={logout}
              className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="ml-3">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-200 ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
        <main className="min-h-screen p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
} 