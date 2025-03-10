"use client";

import { useState, useEffect } from "react";
import { Card, Title, Text, Badge, Metric, Button } from "@tremor/react";
import { PlusIcon, CreditCardIcon } from "@heroicons/react/24/outline";
import { Account } from "@/types";
import { motion } from "framer-motion";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccounts();
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
    } finally {
      setLoading(false);
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Your Accounts
            </h1>
            <Text className="mt-2 text-gray-600 dark:text-gray-400">
              Manage your bank accounts and view balances
            </Text>
          </div>
          <Button 
            icon={PlusIcon}
            color="amber"
          >
            New Account
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => (
            <motion.div
              key={account.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <Badge 
                      color={account.status === 'active' ? 'green' : 'red'}
                      size="lg"
                    >
                      {account.status.toUpperCase()}
                    </Badge>
                    <Title className="mt-2">
                      {account.account_type.toUpperCase()}
                    </Title>
                  </div>
                  <Button 
                    variant="light" 
                    icon={CreditCardIcon}
                    size="xs"
                  >
                    View Card
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <Text className="text-gray-600 dark:text-gray-400">Account Number</Text>
                    <Text className="text-lg font-mono">{account.account_number}</Text>
                  </div>

                  <div>
                    <Text className="text-gray-600 dark:text-gray-400">Available Balance</Text>
                    <Metric className="text-amber-500">
                      {account.currency} {account.balance.toLocaleString()}
                    </Metric>
                  </div>

                  <div className="pt-4 border-t dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <Text className="text-gray-600 dark:text-gray-400">Created</Text>
                      <Text>{new Date(account.created_at).toLocaleDateString()}</Text>
                    </div>
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