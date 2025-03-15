"use client";

import { useState, useEffect } from "react";
import { Card, Title, Text, TextInput, Button, Select, SelectItem, Badge, Metric } from "@tremor/react";
import { motion } from "framer-motion";
import useUserStore from "@/store/useUserStore";
import { toast } from "sonner";
import { Account } from "@/types";
import {
  ArrowRightIcon,
  UserCircleIcon,
  CreditCardIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function TransferPage() {
  const { user } = useUserStore();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fromAccountId: "",
    toUsername: "",
    amount: "",
    description: ""
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await fetch("/api/accounts");
      const data = await res.json();
      setAccounts(data);
    } catch (error) {
      toast.error("Failed to load accounts");
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/transfers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Transfer failed");
      }

      toast.success("Transfer successful!");
      setFormData({ fromAccountId: "", toUsername: "", amount: "", description: "" });
      fetchAccounts(); // Refresh accounts
    } catch (error) {
      toast.error("Transfer failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Transfer Form */}
        <motion.div variants={item}>
          <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg">
            <Title>Make a Transfer</Title>
            <Text>Send money to another user</Text>

            <form onSubmit={handleTransfer} className="mt-6 space-y-6">
              <div className="space-y-2">
                <Text>From Account</Text>
                <Select
                  value={formData.fromAccountId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, fromAccountId: value }))}
                  required
                >
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      <div className="flex justify-between items-center w-full">
                        <span>{account.account_type.toUpperCase()} - {account.account_number}</span>
                        <Badge color="amber">{account.currency} {account.balance}</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <Text>Recipient Username</Text>
                <TextInput
                  icon={UserCircleIcon}
                  placeholder="Enter username"
                  value={formData.toUsername}
                  onChange={(e) => setFormData(prev => ({ ...prev, toUsername: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Text>Amount</Text>
                <TextInput
                  icon={BanknotesIcon}
                  placeholder="Enter amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Text>Description</Text>
                <TextInput
                  placeholder="What's this for?"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <Button
                type="submit"
                color="amber"
                size="lg"
                icon={ArrowRightIcon}
                loading={loading}
                loadingText="Processing..."
                className="w-full"
              >
                Send Money
              </Button>
            </form>
          </Card>
        </motion.div>

        {/* Recent Transfers & Info */}
        <motion.div variants={item} className="space-y-6">
          <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/10 rounded-xl">
                <CreditCardIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <Text className="text-white/80">Available Balance</Text>
                <Metric className="text-white">
                  ${accounts.reduce((sum, acc) => sum + acc.balance, 0).toLocaleString()}
                </Metric>
              </div>
            </div>
          </Card>

          <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg">
            <Title>Transfer Tips</Title>
            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <Text>Double-check the recipient's username before sending</Text>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <Text>Add a description to help you track your transfers</Text>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <Text>Transfers are usually instant between Siddhartha Bank accounts</Text>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
} 