"use client";

import { useState, useEffect } from "react";
import { Card, Title, Text, Badge, Button, TextInput, Select, SelectItem } from "@tremor/react";
import { motion } from "framer-motion";
import useUserStore from "@/store/useUserStore";
import { toast } from "sonner";
import { Transaction, Account } from "@/types";
import { format } from "date-fns";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  EyeIcon,
  EyeSlashIcon,
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

export default function TransactionsPage() {
  const { user } = useUserStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [hideAmounts, setHideAmounts] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    account: "all",
    dateRange: "all",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch transactions
      const transRes = await fetch("/api/transactions");
      const transData = await transRes.json();
      setTransactions(transData);
      
      // Fetch accounts for filtering
      const accRes = await fetch("/api/accounts");
      const accData = await accRes.json();
      setAccounts(accData);
    } catch (error) {
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredTransactions = transactions.filter(transaction => {
    // Search filter
    if (filters.search && !transaction.description?.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // Type filter
    if (filters.type !== "all" && transaction.type !== filters.type) {
      return false;
    }
    
    // Account filter
    if (filters.account !== "all") {
      const accountId = filters.account;
      if (transaction.from_account_id !== accountId && transaction.to_account_id !== accountId) {
        return false;
      }
    }
    
    // Date range filter
    if (filters.dateRange !== "all") {
      const date = new Date(transaction.created_at);
      const now = new Date();
      
      if (filters.dateRange === "today") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (date < today) return false;
      } else if (filters.dateRange === "week") {
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        if (date < weekAgo) return false;
      } else if (filters.dateRange === "month") {
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
        if (date < monthAgo) return false;
      }
    }
    
    return true;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={item} className="flex justify-between items-center">
          <div>
            <Title>Transactions</Title>
            <Text>View and search your transaction history</Text>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setHideAmounts(!hideAmounts)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              {hideAmounts ? (
                <EyeSlashIcon className="w-5 h-5 text-gray-500" />
              ) : (
                <EyeIcon className="w-5 h-5 text-gray-500" />
              )}
            </button>
            <Button 
              icon={FunnelIcon}
              color="amber"
              variant="secondary"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters
            </Button>
            <Button 
              icon={ArrowPathIcon}
              color="amber"
              variant="light"
              size="sm"
              onClick={fetchData}
            >
              Refresh
            </Button>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div variants={item}>
          <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg">
            <div className="flex flex-col md:flex-row gap-4">
              <TextInput
                icon={MagnifyingGlassIcon}
                placeholder="Search transactions..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="flex-1"
              />
              
              {showFilters && (
                <>
                  <Select
                    value={filters.type}
                    onValueChange={(value) => handleFilterChange("type", value)}
                    className="md:w-40"
                  >
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="deposit">Deposits</SelectItem>
                    <SelectItem value="withdrawal">Withdrawals</SelectItem>
                    <SelectItem value="transfer">Transfers</SelectItem>
                  </Select>
                  
                  <Select
                    value={filters.account}
                    onValueChange={(value) => handleFilterChange("account", value)}
                    className="md:w-48"
                  >
                    <SelectItem value="all">All Accounts</SelectItem>
                    {accounts.map(account => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.account_type} (•••{account.account_number.slice(-4)})
                      </SelectItem>
                    ))}
                  </Select>
                  
                  <Select
                    value={filters.dateRange}
                    onValueChange={(value) => handleFilterChange("dateRange", value)}
                    className="md:w-40"
                  >
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </Select>
                </>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Transactions List */}
        <motion.div variants={item}>
          <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg">
            <div className="space-y-4">
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-8">
                  <Text>No transactions found</Text>
                </div>
              ) : (
                filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${
                        transaction.type === 'deposit' 
                          ? 'bg-emerald-100 dark:bg-emerald-900/30' 
                          : transaction.type === 'withdrawal'
                          ? 'bg-rose-100 dark:bg-rose-900/30'
                          : 'bg-amber-100 dark:bg-amber-900/30'
                      }`}>
                        {transaction.type === 'deposit' ? 
                          <ArrowUpIcon className="w-5 h-5 text-emerald-600" /> :
                          transaction.type === 'withdrawal' ?
                          <ArrowDownIcon className="w-5 h-5 text-rose-600" /> :
                          <ArrowPathIcon className="w-5 h-5 text-amber-600" />
                        }
                      </div>
                      <div>
                        <Text>{transaction.description || 'Transaction'}</Text>
                        <div className="flex items-center gap-2">
                          <Text className="text-xs text-gray-500">
                            {format(new Date(transaction.created_at), 'MMM d, yyyy • h:mm a')}
                          </Text>
                          <Badge color={
                            transaction.status === 'completed' ? 'emerald' :
                            transaction.status === 'pending' ? 'amber' : 
                            transaction.status === 'failed' ? 'rose' : 'gray'
                          } size="xs">
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Text className={
                        transaction.type === 'deposit' 
                          ? 'text-emerald-600 dark:text-emerald-500' 
                          : transaction.type === 'withdrawal'
                          ? 'text-rose-600 dark:text-rose-500'
                          : 'text-amber-600 dark:text-amber-500'
                      }>
                        {transaction.type === 'deposit' ? '+' : 
                         transaction.type === 'withdrawal' ? '-' : ''}
                        ${hideAmounts ? '••••' : transaction.amount.toLocaleString()}
                      </Text>
                      <Text className="text-xs text-gray-500">
                        {transaction.from_account_number && `From: •••${transaction.from_account_number.slice(-4)}`}
                        {transaction.to_account_number && transaction.from_account_number && ' • '}
                        {transaction.to_account_number && `To: •••${transaction.to_account_number.slice(-4)}`}
                      </Text>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
} 