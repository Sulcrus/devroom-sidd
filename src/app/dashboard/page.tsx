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

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch accounts
      const accountsRes = await fetch('/api/accounts');
      const accountsData = await accountsRes.json();
      setAccounts(accountsData);

      // Fetch recent transactions
      const transactionsRes = await fetch('/api/transactions?limit=5');
      const transactionsData = await transactionsRes.json();
      setTransactions(transactionsData);

    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics from the fetched data
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const monthlyIncome = transactions
    .filter(t => t.type === 'deposit' || t.type === 'transfer')
    .reduce((sum, t) => sum + t.amount, 0);
  const monthlySpending = transactions
    .filter(t => t.type === 'withdrawal')
    .reduce((sum, t) => sum + t.amount, 0);

  // Generate spending data for the chart
  const spendingData = transactions
    .filter(t => t.type === 'withdrawal')
    .reduce((acc, t) => {
      const date = format(new Date(t.created_at), 'MMM dd');
      const existing = acc.find(d => d.date === date);
      if (existing) {
        existing.amount += t.amount;
      } else {
        acc.push({ date, amount: t.amount });
      }
      return acc;
    }, [] as { date: string; amount: number }[])
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Update statistics
  setStatistics({
    totalBalance,
    monthlyIncome,
    monthlySpending,
    spendingData
  });

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
    <div className="p-8">
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
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

        {/* Charts and Transactions */}
        <motion.div variants={item}>
          <Grid numItemsMd={2} className="gap-6">
            <Col>
              <Card>
                <Title>Recent Activity</Title>
                <div className="mt-6 space-y-4">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          transaction.type === 'deposit' || transaction.type === 'transfer'
                            ? 'bg-emerald-100 dark:bg-emerald-900/30' 
                            : 'bg-rose-100 dark:bg-rose-900/30'
                        }`}>
                          {transaction.type === 'deposit' || transaction.type === 'transfer' ? 
                            <ArrowUpIcon className="w-5 h-5 text-emerald-600" /> :
                            <ArrowDownIcon className="w-5 h-5 text-rose-600" />
                          }
                        </div>
                        <div>
                          <Text>{transaction.description}</Text>
                          <Text className="text-xs text-gray-500">
                            {format(new Date(transaction.created_at), 'MMM d, yyyy')}
                          </Text>
                        </div>
                      </div>
                      <Text className={
                        transaction.type === 'deposit' || transaction.type === 'transfer'
                          ? 'text-emerald-600' 
                          : 'text-rose-600'
                      }>
                        {transaction.type === 'deposit' || transaction.type === 'transfer' ? '+' : '-'}
                        {hideBalances ? '••••' : `$${transaction.amount.toLocaleString()}`}
                      </Text>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>

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