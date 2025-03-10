"use client";

import { useState, useEffect } from "react";
import { Card, Title, Text, Badge } from "@tremor/react";
import { Account, User } from "@/types";
import { motion } from "framer-motion";
import { WifiIcon } from "@heroicons/react/24/solid";

// Custom Chip Icon component
const ChipIcon = () => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className="h-8 w-8"
  >
    <path d="M4 10h16v4H4z" />
    <path d="M2 7v10h20V7H2zm18 8H4v-6h16v6z" />
    <path d="M9 9h6v6H9z" />
  </svg>
);

export default function CardsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchAccounts(), fetchUser()]).finally(() => setLoading(false));
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await fetch("/api/accounts");
      if (res.ok) {
        const data = await res.json();
        setAccounts(data);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/user");
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Virtual Cards
          </h1>
          <Text className="mt-2 text-gray-600 dark:text-gray-400">
            View your virtual cards for each account
          </Text>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => (
            <motion.div
              key={account.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Virtual Card */}
              <div className="relative h-56 w-full perspective-1000">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl shadow-xl p-6 overflow-hidden transform-gpu hover:scale-105 transition-transform duration-300">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 transform rotate-45 scale-150">
                      {[...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute h-48 w-48 border border-white/20"
                          style={{
                            top: `${i * 40}px`,
                            left: `${i * 40}px`,
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="relative h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <Text className="text-white/80 text-sm">
                          {account.account_type.toUpperCase()}
                        </Text>
                        <Title className="text-white">
                          Siddhartha Bank
                        </Title>
                      </div>
                      <WifiIcon className="h-6 w-6 text-white transform rotate-90" />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-12 bg-yellow-200/90 rounded-md" />
                        <div className="text-yellow-200/90">
                          <ChipIcon />
                        </div>
                      </div>

                      <div>
                        <Text className="text-white/80 text-sm">Card Number</Text>
                        <Text className="text-white font-mono text-lg tracking-wider">
                          {account.account_number.replace(/(\d{4})/g, '$1 ').trim()}
                        </Text>
                      </div>

                      <div className="flex justify-between items-end">
                        <div>
                          <Text className="text-white/80 text-xs">CARDHOLDER</Text>
                          <Text className="text-white">
                            {user?.first_name} {user?.last_name}
                          </Text>
                        </div>
                        <Badge color="amber" size="lg">
                          @{user?.username}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Details */}
              <Card className="mt-4 p-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Text className="text-gray-600 dark:text-gray-400">Status</Text>
                    <Badge 
                      color={account.status === 'active' ? 'green' : 'red'}
                    >
                      {account.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <Text className="text-gray-600 dark:text-gray-400">Balance</Text>
                    <Text className="font-semibold">
                      {account.currency} {account.balance.toLocaleString()}
                    </Text>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 