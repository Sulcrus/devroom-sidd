"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, Title, Text, TextInput, Button, Select, SelectItem, Badge, Metric } from "@tremor/react";
import { Account, User, Transaction } from "@/types";
import { motion } from "framer-motion";
import { ArrowRightIcon, UserCircleIcon, CreditCardIcon, BanknotesIcon, ArrowUpIcon, ArrowDownIcon, ClockIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";

export default function TransferPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);

  const [formData, setFormData] = useState({
    fromAccountId: "",
    toUsername: "",
    amount: "",
    description: "",
  });

  useEffect(() => {
    Promise.all([fetchUser(), fetchAccounts(), fetchRecentTransactions()]).finally(() => setLoading(false));
  }, []);

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

  const fetchRecentTransactions = async () => {
    try {
      const res = await fetch("/api/transactions?limit=5");
      if (res.ok) {
        const data = await res.json();
        setRecentTransactions(data);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    const account = accounts.find(a => a.id === formData.fromAccountId);
    setSelectedAccount(account || null);
  }, [formData.fromAccountId, accounts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/transfers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Transfer failed");
      }

      setSuccess(`Transfer successful! Money sent to ${data.recipientName}. Reference: ${data.referenceNumber}`);
      setFormData({
        fromAccountId: "",
        toUsername: "",
        amount: "",
        description: "",
      });

      // Refresh accounts to show updated balances
      fetchAccounts();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate net change from recent transactions
  const netChange = recentTransactions.reduce((sum, t) => {
    if (t.to_account_id === selectedAccount?.id) {
      return sum + t.amount;
    } else if (t.from_account_id === selectedAccount?.id) {
      return sum - t.amount;
    }
    return sum;
  }, 0);

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
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Transfer Money
          </h1>
          <div className="mt-4 flex items-center gap-3">
            <UserCircleIcon className="h-6 w-6 text-amber-500" />
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm">
              <Text>Your username:</Text>
              <Badge color="amber" size="lg">
                @{user?.username || "loading..."}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Left Column - Transfer Form */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="p-8 shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* From Account Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CreditCardIcon className="h-5 w-5 text-amber-500" />
                    <Title>From Account</Title>
                  </div>
                  <Select
                    value={formData.fromAccountId}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, fromAccountId: value }))}
                    required
                    className="mt-2"
                  >
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        <div className="flex justify-between items-center w-full">
                          <span>{account.account_type.toUpperCase()} - {account.account_number}</span>
                          <span className="text-amber-500 font-medium">
                            {account.currency} {account.balance.toLocaleString()}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                {/* Recipient Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <UserCircleIcon className="h-5 w-5 text-amber-500" />
                    <Title>To User</Title>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">@</span>
                    </div>
                    <TextInput
                      placeholder="Enter recipient's username"
                      value={formData.toUsername}
                      onChange={(e) => setFormData(prev => ({ ...prev, toUsername: e.target.value }))}
                      required
                      className="pl-8"
                    />
                  </div>
                </div>

                {/* Amount Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <BanknotesIcon className="h-5 w-5 text-amber-500" />
                    <Title>Amount</Title>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">{selectedAccount?.currency || '$'}</span>
                    </div>
                    <TextInput
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                      required
                      className="pl-8 text-lg"
                    />
                  </div>
                </div>

                {/* Description Section */}
                <div className="space-y-4">
                  <Title>Description</Title>
                  <TextInput
                    placeholder="What's this payment for? (Optional)"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <Button
                  type="submit"
                  loading={submitting}
                  disabled={submitting}
                  size="lg"
                  className="w-full bg-amber-500 hover:bg-amber-600 h-14 mt-6 text-lg"
                >
                  {submitting ? (
                    "Processing..."
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Send Money
                      <ArrowRightIcon className="h-5 w-5" />
                    </span>
                  )}
                </Button>
              </form>
            </Card>
          </div>

          {/* Right Column - Account Details & Recent Transactions */}
          <div className="lg:col-span-5 space-y-6">
            {selectedAccount && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-8 shadow-lg bg-gradient-to-br from-amber-50 to-white dark:from-gray-800 dark:to-gray-900">
                  <div className="space-y-8">
                    <div className="flex justify-between items-start">
                      <div>
                        <Text className="text-gray-600 dark:text-gray-400">Selected Account</Text>
                        <Title className="mt-1">{selectedAccount.account_type.toUpperCase()}</Title>
                      </div>
                      <Badge 
                        color={selectedAccount.status === 'active' ? 'green' : 'red'}
                        size="lg"
                      >
                        {selectedAccount.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div>
                      <Text className="text-gray-600 dark:text-gray-400">Account Number</Text>
                      <Text className="text-lg font-medium mt-1">
                        {selectedAccount.account_number}
                      </Text>
                    </div>

                    <div>
                      <Text className="text-gray-600 dark:text-gray-400">Available Balance</Text>
                      <Metric className="mt-2 text-amber-500">
                        {selectedAccount.currency} {selectedAccount.balance.toLocaleString()}
                      </Metric>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Recent Transactions */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <Title>Recent Transactions</Title>
                  <Text className="text-gray-500">Last 5 transactions</Text>
                </div>
                <Button 
                  size="sm" 
                  variant="light"
                  icon={ClockIcon}
                  onClick={() => router.push('/dashboard/transactions')}
                >
                  View All
                </Button>
              </div>
              
              <div className="space-y-4">
                {recentTransactions.length === 0 ? (
                  <div className="text-center py-8">
                    <Text className="text-gray-500">No recent transactions</Text>
                  </div>
                ) : (
                  recentTransactions.map((transaction) => {
                    const isReceiver = transaction.to_account_id === selectedAccount?.id;
                    const amount = transaction.amount.toLocaleString();
                    const date = new Date(transaction.created_at);
                    
                    return (
                      <div 
                        key={transaction.id} 
                        className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className={`
                              mt-1 w-10 h-10 rounded-full flex items-center justify-center
                              ${isReceiver ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}
                            `}>
                              {isReceiver ? (
                                <ArrowDownIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                              ) : (
                                <ArrowUpIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                              )}
                            </div>
                            <div className="space-y-1">
                              <Text className="font-medium">
                                {isReceiver ? 'Received from' : 'Sent to'}{' '}
                                <span className="font-semibold">
                                  {isReceiver ? transaction.from_account_number : transaction.to_account_number}
                                </span>
                              </Text>
                              <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <span>{format(date, 'MMM d, yyyy • h:mm a')}</span>
                                <span>•</span>
                                <span className="font-mono">{transaction.reference_number}</span>
                              </div>
                              {transaction.description && (
                                <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  {transaction.description}
                                </Text>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <Text className={`text-lg font-semibold ${
                              isReceiver ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                            }`}>
                              {isReceiver ? '+' : '-'}{selectedAccount?.currency} {amount}
                            </Text>
                            <Badge 
                              size="sm"
                              color={transaction.category_color || 'gray'}
                              className="mt-1"
                            >
                              {transaction.category_name}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {recentTransactions.length > 0 && (
                <div className="mt-6 pt-4 border-t dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <Text className="text-gray-500">Total Transactions</Text>
                    <Text className="font-medium">{recentTransactions.length}</Text>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <Text className="text-gray-500">Net Change</Text>
                    <Text className={`font-medium ${
                      netChange > 0 ? 'text-green-600' : netChange < 0 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {selectedAccount?.currency} {Math.abs(netChange).toLocaleString()}
                      {netChange !== 0 && (netChange > 0 ? ' (+)' : ' (-)')}
                    </Text>
                  </div>
                </div>
              )}
            </Card>

            {/* Status Messages */}
            <div className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-red-50 border border-red-200 rounded-xl shadow-sm"
                >
                  <div className="flex items-center text-red-600">
                    <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
                    </svg>
                    <Text className="font-medium text-lg">{error}</Text>
                  </div>
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-green-50 border border-green-200 rounded-xl shadow-sm"
                >
                  <div className="flex items-center text-green-600">
                    <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                    </svg>
                    <Text className="font-medium text-lg">{success}</Text>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 