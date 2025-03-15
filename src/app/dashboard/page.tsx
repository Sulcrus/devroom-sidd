"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format, parseISO, subDays } from 'date-fns';
import { Card, Metric, Text, Flex, ProgressBar, Title, TextInput, Button, Select, SelectItem, Badge, Grid, Col } from "@tremor/react";
import { useTheme } from "next-themes";
import { AreaChart, DonutChart } from "@tremor/react";
import { User, Account, Transaction } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import useUserStore from "@/store/useUserStore";
import { toast } from "sonner";
import { ArrowUpIcon, ArrowDownIcon, CreditCardIcon, BanknotesIcon, ArrowTrendingUpIcon, EyeIcon, EyeSlashIcon, ArrowsRightLeftIcon, BellIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  Tooltip,
  Legend,
  Filler
);

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

// Define types for our custom data structures
interface SpendingDataItem {
  date: string;
  total: number;
  Groceries: number;
  Dining: number;
  Shopping: number;
  Transport: number;
  Utilities: number;
  Entertainment: number;
  [key: string]: number | string; // Index signature to allow dynamic category access
}

interface CustomTransaction {
  id: string;
  merchant: string;
  category: string;
  icon: string;
  amount: number;
  date: Date;
  type: 'debit' | 'credit';
}

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'alert' | 'info' | 'security';
}

// Generate realistic spending data
const generateSpendingData = (): SpendingDataItem[] => {
  const data: SpendingDataItem[] = [];
  const categories = ["Groceries", "Dining", "Shopping", "Transport", "Utilities", "Entertainment"];
  const now = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = subDays(now, i);
    const dayData: SpendingDataItem = {
      date: format(date, 'MMM dd'),
      total: 0,
      Groceries: 0,
      Dining: 0,
      Shopping: 0,
      Transport: 0,
      Utilities: 0,
      Entertainment: 0
    };
    
    // Add random spending for each category
    categories.forEach(category => {
      // Weekend spending is higher
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const baseAmount = isWeekend ? 30 : 15;
      const amount = Math.round(Math.random() * baseAmount) + (isWeekend ? 20 : 5);
      
      dayData[category] = amount;
      dayData.total += amount;
    });
    
    data.push(dayData);
  }
  
  return data;
};

// Generate realistic transaction data
const generateTransactions = (): CustomTransaction[] => {
  const merchants = [
    { name: "Whole Foods Market", category: "Groceries", icon: "🛒" },
    { name: "Starbucks", category: "Dining", icon: "☕" },
    { name: "Amazon", category: "Shopping", icon: "📦" },
    { name: "Uber", category: "Transport", icon: "🚗" },
    { name: "Netflix", category: "Entertainment", icon: "🎬" },
    { name: "Electric Company", category: "Utilities", icon: "💡" },
    { name: "Target", category: "Shopping", icon: "🎯" },
    { name: "Chipotle", category: "Dining", icon: "🌮" }
  ];
  
  return Array(5).fill(0).map((_, i) => {
    const merchant = merchants[Math.floor(Math.random() * merchants.length)];
    const amount = Math.round(Math.random() * 100) + 5;
    const daysAgo = i === 0 ? 0 : Math.floor(Math.random() * 3) + 1;
    
    return {
      id: `trans-${i}`,
      merchant: merchant.name,
      category: merchant.category,
      icon: merchant.icon,
      amount: amount,
      date: subDays(new Date(), daysAgo),
      type: Math.random() > 0.2 ? "debit" : "credit" as 'debit' | 'credit'
    };
  });
};

// Generate notifications
const generateNotifications = (): Notification[] => {
  return [
    {
      id: "notif-1",
      title: "Large Transaction Alert",
      description: "A transaction of $350.00 was made from your account",
      time: "10 minutes ago",
      read: false,
      type: "alert" as 'alert'
    },
    {
      id: "notif-2",
      title: "New Statement Available",
      description: "Your April statement is ready to view",
      time: "2 hours ago",
      read: true,
      type: "info" as 'info'
    },
    {
      id: "notif-3",
      title: "Security Update",
      description: "We've enhanced our security measures",
      time: "Yesterday",
      read: true,
      type: "security" as 'security'
    }
  ];
};

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useUserStore();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [spendingData, setSpendingData] = useState<SpendingDataItem[]>([]);
  const [transactions, setTransactions] = useState<CustomTransaction[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hideBalances, setHideBalances] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Calculate category totals for the donut chart
  const categoryData = spendingData.length > 0 
    ? [
        { name: "Groceries", amount: spendingData.reduce((sum, day) => sum + (day.Groceries || 0), 0) },
        { name: "Dining", amount: spendingData.reduce((sum, day) => sum + (day.Dining || 0), 0) },
        { name: "Shopping", amount: spendingData.reduce((sum, day) => sum + (day.Shopping || 0), 0) },
        { name: "Transport", amount: spendingData.reduce((sum, day) => sum + (day.Transport || 0), 0) },
        { name: "Utilities", amount: spendingData.reduce((sum, day) => sum + (day.Utilities || 0), 0) },
        { name: "Entertainment", amount: spendingData.reduce((sum, day) => sum + (day.Entertainment || 0), 0) }
      ]
    : [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch accounts
        const accountsRes = await fetch("/api/accounts");
        const accountsData = await accountsRes.json();
        setAccounts(accountsData);
        
        // Fetch recent transactions
        const transactionsRes = await fetch("/api/transactions?limit=5");
        const transactionsData = await transactionsRes.json();
        setTransactions(transactionsData);

        // Fetch spending analytics
        const analyticsRes = await fetch("/api/analytics/spending");
        const analyticsData = await analyticsRes.json();
        setSpendingData(analyticsData);
      } catch (error) {
        toast.error("Failed to load dashboard data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalIncome = transactions
    .filter(t => t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalSpending = transactions
    .filter(t => t.type === 'withdrawal')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="p-8 max-w-7xl mx-auto"
      >
        <div className="space-y-8">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            {/* Header */}
            <motion.div variants={item} className="flex justify-between items-center">
              <div>
                <Title>Welcome back, {user?.first_name || 'User'}</Title>
                <Text>Here's an overview of your finances</Text>
              </div>
              <Button
                icon={hideBalances ? EyeIcon : EyeSlashIcon}
                variant="light"
                onClick={() => setHideBalances(!hideBalances)}
              >
                {hideBalances ? "Show" : "Hide"} Balances
              </Button>
            </motion.div>

            {/* Account Summary */}
            <motion.div variants={item}>
              <Card className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-xl">
                      <CreditCardIcon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <Text className="text-white/80">Total Balance</Text>
                      <Metric className="text-white">
                        {hideBalances ? '••••••' : `$${totalBalance.toLocaleString()}`}
                      </Metric>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 p-4 rounded-xl">
                      <div className="flex items-center gap-2">
                        <ArrowUpIcon className="w-5 h-5 text-emerald-300" />
                        <Text className="text-white/80">Income</Text>
                      </div>
                      <Metric className="text-white text-xl">
                        {hideBalances ? '••••' : `$${totalIncome.toLocaleString()}`}
                      </Metric>
                    </div>
                    
                    <div className="bg-white/10 p-4 rounded-xl">
                      <div className="flex items-center gap-2">
                        <ArrowDownIcon className="w-5 h-5 text-rose-300" />
                        <Text className="text-white/80">Spending</Text>
                      </div>
                      <Metric className="text-white text-xl">
                        {hideBalances ? '••••' : `$${totalSpending.toLocaleString()}`}
                      </Metric>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={item}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: "Transfer", icon: ArrowsRightLeftIcon, color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600", path: "/dashboard/transfer" },
                  { name: "Pay Bills", icon: BanknotesIcon, color: "bg-rose-100 dark:bg-rose-900/30 text-rose-600", path: "/dashboard/payments" },
                  { name: "Accounts", icon: CreditCardIcon, color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600", path: "/dashboard/accounts" },
                  { name: "Analytics", icon: ArrowTrendingUpIcon, color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600", path: "/dashboard/analytics" }
                ].map((action, index) => (
                  <Link href={action.path} key={index}>
                    <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg hover:shadow-md transition-all duration-200">
                      <div className="flex flex-col items-center text-center">
                        <div className={`p-3 rounded-xl ${action.color.split(' ')[0]} ${action.color.split(' ')[1]}`}>
                          <action.icon className={`w-6 h-6 ${action.color.split(' ')[2]}`} />
                        </div>
                        <Text className="mt-2">{action.name}</Text>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Spending Overview & Recent Transactions */}
            <motion.div variants={item}>
              <Grid numItemsMd={2} className="gap-6">
                <Col>
                  <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg">
                    <Title>Spending Overview</Title>
                    <Text>Your spending patterns for the past 30 days</Text>
                    <AreaChart
                      className="h-72 mt-4"
                      data={spendingData}
                      index="date"
                      categories={["amount"]}
                      colors={["amber"]}
                      valueFormatter={(value) => `$${value.toLocaleString()}`}
                      showAnimation={true}
                    />
                  </Card>
                </Col>
                
                <Col>
                  <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg">
                    <div className="flex justify-between items-center mb-6">
                      <Title>Recent Transactions</Title>
                      <button className="text-sm text-amber-600 dark:text-amber-400 hover:underline">
                        View All
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {transactions.map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg text-xl">
                              {transaction.icon}
                            </div>
                            <div>
                              <Text>{transaction.merchant}</Text>
                              <Text className="text-xs text-gray-500">
                                {format(transaction.date, 'MMM d, yyyy')}
                              </Text>
                            </div>
                          </div>
                          <Text className={transaction.type === 'credit' ? 'text-emerald-600' : 'text-gray-900 dark:text-gray-100'}>
                            {transaction.type === 'credit' ? '+' : '-'}
                            {hideBalances ? '••••' : `$${transaction.amount.toFixed(2)}`}
                          </Text>
                        </div>
                      ))}
                    </div>
                  </Card>
                </Col>
              </Grid>
            </motion.div>

            {/* Spending Categories & Notifications */}
            <motion.div variants={item}>
              <Grid numItemsMd={2} className="gap-6">
                <Col>
                  <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg">
                    <Title>Spending by Category</Title>
                    <Text>How you've spent your money this month</Text>
                    <DonutChart
                      className="h-60 mt-4"
                      data={categoryData}
                      category="amount"
                      index="name"
                      valueFormatter={(value) => `$${value.toLocaleString()}`}
                      colors={["emerald", "amber", "rose", "blue", "purple", "indigo"]}
                      showAnimation={true}
                    />
                  </Card>
                </Col>
                
                <Col>
                  <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                        <BellIcon className="w-6 h-6 text-amber-600" />
                      </div>
                      <Title>Notifications</Title>
                    </div>
                    
                    <div className="space-y-4">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 rounded-lg ${
                            notification.read 
                              ? 'bg-gray-50 dark:bg-gray-900/50' 
                              : 'bg-amber-50 dark:bg-amber-900/20'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${
                              notification.type === 'alert' 
                                ? 'bg-rose-100 dark:bg-rose-900/30' 
                                : notification.type === 'security'
                                ? 'bg-emerald-100 dark:bg-emerald-900/30'
                                : 'bg-blue-100 dark:bg-blue-900/30'
                            }`}>
                              {notification.type === 'alert' ? (
                                <svg className="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                              ) : notification.type === 'security' ? (
                                <ShieldCheckIcon className="w-5 h-5 text-emerald-600" />
                              ) : (
                                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <Text className="font-medium">{notification.title}</Text>
                                {!notification.read && (
                                  <Badge color="amber" size="xs">New</Badge>
                                )}
                              </div>
                              <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {notification.description}
                              </Text>
                              <Text className="text-xs text-gray-500 mt-2">
                                {notification.time}
                              </Text>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </Col>
              </Grid>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
} 