"use client";

import { useState, useEffect } from "react";
import { Card, Title, Text, Metric, AreaChart, Grid, Col } from "@tremor/react";
import { motion } from "framer-motion";
import useUserStore from "@/store/useUserStore";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  CreditCardIcon,
  BanknotesIcon,
  ArrowsRightLeftIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
  EyeSlashIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Account, Transaction, Statistics } from "@/types";

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

export default function DashboardPage() {
  const { user } = useUserStore();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [statistics, setStatistics] = useState<Statistics>({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlySpending: 0,
    spendingData: []
  });
  const [loading, setLoading] = useState(true);
  const [hideBalances, setHideBalances] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Update statistics whenever accounts or transactions change
  useEffect(() => {
    // Calculate statistics from the fetched data
    const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
    
    // Fix: Properly categorize income and spending
    const monthlyIncome = transactions
      .filter(t => {
        // Only count deposits and incoming transfers as income
        return (t.type === 'deposit' || 
               (t.type === 'transfer' && t.to_account_id && 
                accounts.some(acc => acc.id === t.to_account_id)));
      })
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    
    const monthlySpending = transactions
      .filter(t => {
        // Count withdrawals and outgoing transfers as spending
        return (t.type === 'withdrawal' || 
               (t.type === 'transfer' && t.from_account_id && 
                accounts.some(acc => acc.id === t.from_account_id)));
      })
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    // Generate spending data for the chart
    const spendingData = transactions
      .filter(t => t.type === 'withdrawal' || 
               (t.type === 'transfer' && t.from_account_id && 
                accounts.some(acc => acc.id === t.from_account_id)))
      .reduce((acc, t) => {
        const date = format(new Date(t.created_at), 'MMM dd');
        const existing = acc.find(d => d.date === date);
        if (existing) {
          existing.amount += t.amount || 0;
        } else {
          acc.push({ date, amount: t.amount || 0 });
        }
        return acc;
      }, [] as { date: string; amount: number }[]);

    setStatistics({
      totalBalance,
      monthlyIncome,
      monthlySpending,
      spendingData
    });
  }, [accounts, transactions]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch accounts
      const accountsRes = await fetch('/api/accounts');
      if (!accountsRes.ok) throw new Error('Failed to fetch accounts');
      const accountsData = await accountsRes.json();
      setAccounts(Array.isArray(accountsData) ? accountsData : []);

      // Fetch recent transactions
      const transactionsRes = await fetch('/api/transactions?limit=5');
      if (!transactionsRes.ok) throw new Error('Failed to fetch transactions');
      const transactionsData = await transactionsRes.json();
      setTransactions(Array.isArray(transactionsData) ? transactionsData : []);

    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      toast.error("Failed to load dashboard data");
      setAccounts([]);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionAmount = (transaction: Transaction) => {
    // For transfers, check if the user is sender or receiver
    if (transaction.type === 'transfer') {
      // If user's account is the sender, show negative amount
      if (accounts.some(acc => acc.id === transaction.from_account_id)) {
        return `-$${transaction.amount.toLocaleString()}`;
      }
      // If user's account is the receiver, show positive amount
      if (accounts.some(acc => acc.id === transaction.to_account_id)) {
        return `+$${transaction.amount.toLocaleString()}`;
      }
    }
    
    // For deposits and withdrawals
    return transaction.type === 'deposit' 
      ? `+$${transaction.amount.toLocaleString()}`
      : `-$${transaction.amount.toLocaleString()}`;
  };

  const getTransactionIcon = (transaction: Transaction) => {
    if (transaction.type === 'transfer') {
      // Show down arrow if sending, up arrow if receiving
      return accounts.some(acc => acc.id === transaction.from_account_id) 
        ? <ArrowDownIcon className="w-5 h-5 text-rose-600" />
        : <ArrowUpIcon className="w-5 h-5 text-emerald-600" />;
    }
    
    return transaction.type === 'deposit'
      ? <ArrowUpIcon className="w-5 h-5 text-emerald-600" />
      : <ArrowDownIcon className="w-5 h-5 text-rose-600" />;
  };

  const getTransactionStyle = (transaction: Transaction) => {
    if (transaction.type === 'transfer') {
      return accounts.some(acc => acc.id === transaction.from_account_id)
        ? 'text-rose-600'
        : 'text-emerald-600';
    }
    
    return transaction.type === 'deposit'
      ? 'text-emerald-600'
      : 'text-rose-600';
  };

  if (loading) {
    return (
      <div className="p-8 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        {/* Welcome Section */}
        <motion.div variants={item} className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Welcome back, {user?.first_name}
            </h1>
            <Text className="text-gray-600 dark:text-gray-400">
              Here's your financial overview
            </Text>
          </div>
          <button
            onClick={() => setHideBalances(!hideBalances)}
            className="p-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {hideBalances ? (
              <EyeIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <EyeSlashIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </motion.div>

        {/* Quick Stats */}
        <motion.div variants={item}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-amber-500 to-amber-600">
              <div className="text-white">
                <Text className="text-white/80">Total Balance</Text>
                <Metric className="text-white">
                  {hideBalances ? '••••' : `$${statistics?.totalBalance.toLocaleString()}`}
                </Metric>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600">
              <div className="text-white">
                <Text className="text-white/80">Monthly Income</Text>
                <Metric className="text-white">
                  {hideBalances ? '••••' : `$${statistics?.monthlyIncome.toLocaleString()}`}
                </Metric>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-rose-500 to-rose-600">
              <div className="text-white">
                <Text className="text-white/80">Monthly Spending</Text>
                <Metric className="text-white">
                  {hideBalances ? '••••' : `$${statistics?.monthlySpending.toLocaleString()}`}
                </Metric>
              </div>
            </Card>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={item}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Transfer", icon: ArrowsRightLeftIcon, path: "/dashboard/transfer" },
              { name: "Accounts", icon: CreditCardIcon, path: "/dashboard/accounts" },
              { name: "Analytics", icon: ChartBarIcon, path: "/dashboard/analytics" },
              { name: "Payments", icon: BanknotesIcon, path: "/dashboard/payments" }
            ].map((action, index) => (
              <Link href={action.path} key={index}>
                <Card className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                      <action.icon className="w-6 h-6 text-amber-600" />
                    </div>
                    <Text>{action.name}</Text>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity Card */}
        <motion.div variants={item}>
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div>
                <Title>Recent Activity</Title>
                <Text>Your latest transactions</Text>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setHideBalances(!hideBalances)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                >
                  {hideBalances ? (
                    <EyeIcon className="w-5 h-5" />
                  ) : (
                    <EyeSlashIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {transactions.slice(0, 5).map((transaction) => {
                // Determine if this is an outgoing transfer
                const isOutgoingTransfer = transaction.type === 'transfer' && 
                  accounts.some(acc => acc.id === transaction.from_account_id);
                
                // Determine if this is an incoming transfer
                const isIncomingTransfer = transaction.type === 'transfer' && 
                  accounts.some(acc => acc.id === transaction.to_account_id);

                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        transaction.type === 'deposit' || isIncomingTransfer
                          ? 'bg-emerald-100 dark:bg-emerald-900/30' 
                          : 'bg-rose-100 dark:bg-rose-900/30'
                      }`}>
                        {transaction.type === 'deposit' || isIncomingTransfer ? (
                          <ArrowUpIcon className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <ArrowDownIcon className="w-5 h-5 text-rose-600" />
                        )}
                      </div>
                      <div>
                        <Text>{transaction.description}</Text>
                        <Text className="text-xs text-gray-500">
                          {format(new Date(transaction.created_at), 'MMM d, yyyy')}
                        </Text>
                      </div>
                    </div>
                    <Text className={
                      transaction.type === 'deposit' || isIncomingTransfer
                        ? 'text-emerald-600' 
                        : 'text-rose-600'
                    }>
                      {hideBalances 
                        ? '••••' 
                        : `${transaction.type === 'deposit' || isIncomingTransfer ? '+' : '-'}$${transaction.amount.toLocaleString()}`
                      }
                    </Text>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Charts and Transactions */}
        <motion.div variants={item}>
          <Grid numItemsMd={2} className="gap-6">
            <Col>
              <Card>
                <Title>Spending Overview</Title>
                <Text>Last 30 days</Text>
                {statistics.spendingData.length > 0 && (
                  <AreaChart
                    className="h-72 mt-4"
                    data={statistics.spendingData}
                    index="date"
                    categories={["amount"]}
                    colors={["amber"]}
                    valueFormatter={(value) => `$${value.toLocaleString()}`}
                    showAnimation={true}
                  />
                )}
              </Card>
            </Col>
          </Grid>
        </motion.div>
      </motion.div>
    </div>
  );
} 