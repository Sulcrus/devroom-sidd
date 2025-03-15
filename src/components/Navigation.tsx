"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  HomeIcon,
  CreditCardIcon,
  ArrowsRightLeftIcon,
  BanknotesIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import useUserStore from "@/store/useUserStore";

const menuItems = [
  { path: '/dashboard', label: 'Overview', icon: HomeIcon },
  { path: '/dashboard/accounts', label: 'Accounts', icon: CreditCardIcon },
  { path: '/dashboard/transfer', label: 'Transfer', icon: ArrowsRightLeftIcon },
  { path: '/dashboard/payments', label: 'Payments', icon: BanknotesIcon },
  { path: '/dashboard/analytics', label: 'Analytics', icon: ChartBarIcon },
  { path: '/dashboard/settings', label: 'Settings', icon: Cog6ToothIcon },
];

export default function Navigation() {
  const pathname = usePathname();
  const { user, logout } = useUserStore();

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <span className="text-white font-bold">SB</span>
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent">
              Siddhartha
            </span>
          </Link>
        </div>

        {/* User Profile Section */}
        <div className="px-4 py-3 mx-4 mt-2 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <UserCircleIcon className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                @{user?.username}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 mt-6 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 w-1 h-6 bg-amber-600 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={`w-5 h-5 ${isActive ? 'text-amber-600' : 'text-gray-500 dark:text-gray-400'}`} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Section */}
        <div className="p-4 mt-auto">
          <button
            onClick={logout}
            className="w-full px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-500 bg-red-50 dark:bg-red-900/20 
              rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200"
          >
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
} 