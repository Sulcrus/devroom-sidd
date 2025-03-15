"use client";

import { useState, useEffect } from "react";
import { Card, Title, Text, Badge } from "@tremor/react";
import { Account, User } from "@/types";
import { motion } from "framer-motion";
import { WifiIcon } from "@heroicons/react/24/solid";
import useUserStore from "@/store/useUserStore";

// Custom Chip Icon component
function ChipIcon() {
  return (
    <svg width="50" height="40" viewBox="0 0 50 40">
      <rect x="5" y="10" width="40" height="30" rx="4" fill="#FFD700" />
      <rect x="10" y="15" width="30" height="5" rx="2" fill="#B8860B" />
      <rect x="10" y="25" width="20" height="5" rx="2" fill="#B8860B" />
    </svg>
  );
}

export default function CardsPage() {
  const { user } = useUserStore();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await fetch("/api/accounts");
      if (!res.ok) {
        throw new Error("Failed to fetch accounts");
      }
      const data = await res.json();
      setAccounts(data);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Your Cards
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Manage your debit and credit cards
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <motion.div
            key={account.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="relative overflow-hidden">
              {/* Card Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-600" />
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center" />
              </div>

              {/* Card Content */}
              <div className="relative">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Title>Virtual Card</Title>
                    <Text>Debit Card</Text>
                  </div>
                  <WifiIcon className="w-6 h-6 text-amber-600 transform rotate-90" />
                </div>

                <div className="flex items-center mb-6">
                  <ChipIcon />
                </div>

                <div className="space-y-4">
                  <div>
                    <Text>Card Number</Text>
                    <div className="flex items-center space-x-2">
                      <Title>•••• •••• •••• {account.account_number.slice(-4)}</Title>
                    </div>
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <Text>Card Holder</Text>
                      <Title>{user?.first_name} {user?.last_name}</Title>
                      <Badge color="amber" size="lg">
                        {user?.username || 'User'}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <Text>Expires</Text>
                      <Title>12/25</Title>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 