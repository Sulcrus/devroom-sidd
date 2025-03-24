"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/Navigation";
import useUserStore from "@/store/useUserStore";
import { LoadingProfile, UserProfile, ErrorProfile } from "@/components/dashboard/UserProfile";
import { useTheme } from "next-themes";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { refreshUserData } = useUserStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // After mounting, we can access the theme
  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    // Refresh user data when dashboard loads
    refreshUserData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Navigation />

      {/* Main Content */}
      <div className="pl-64">
        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="min-h-screen"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
} 