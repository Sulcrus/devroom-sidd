"use client";

import { useState, useEffect } from "react";
import { Card, Title, Text, Metric, Badge, Button } from "@tremor/react";
import { motion } from "framer-motion";
import useUserStore from "@/store/useUserStore";
import { toast } from "sonner";
import { Account } from "@/types";
import {
  CreditCardIcon,
  PlusIcon,
  ArrowPathIcon,
  EyeIcon,
  EyeSlashIcon,
  BanknotesIcon,
  ArrowUpIcon,
  ArrowDownIcon,
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

export default function AccountsPage() {
  const { user } = useUserStore();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [hideBalances, setHideBalances] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/accounts");
      const data = await res.json();
      setAccounts(data);
      if (data.length > 0 && !selectedAccount) {
        setSelectedAccount(data[0].id);
      }
    } catch (error) {
      toast.error("Failed to load accounts");
    } finally {
      setLoading(false);
    }
  };

  const getAccountTransactions = (accountId: string) => {
    // This would normally fetch from API, but we'll mock it for now
    return [
      { id: '1', description: 'Grocery Store', amount: 56.78, type: 'withdrawal', date: new Date() },
      { id: '2', description: 'Salary Deposit', amount: 2500, type: 'deposit', date: new Date(Date.now() - 86400000) },
      { id: '3', description: 'Electric Bill', amount: 89.99, type: 'withdrawal', date: new Date(Date.now() - 172800000) },
    ];
  };

  const getSelectedAccount = () => {
    return accounts.find(account => account.id === selectedAccount);
  };

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
            <Title>Your Accounts</Title>
            <Text>Manage your bank accounts and cards</Text>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setHideBalances(!hideBalances)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              {hideBalances ? (
                <EyeSlashIcon className="w-5 h-5 text-gray-500" />
              ) : (
                <EyeIcon className="w-5 h-5 text-gray-500" />
              )}
            </button>
            <Button
              icon={PlusIcon}
              color="amber"
              size="sm"
            >
              New Account
            </Button>
          </div>
        </motion.div>

        {/* Account List */}
        <motion.div variants={item}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {accounts.map((account) => (
              <Card 
                key={account.id}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedAccount === account.id 
                    ? 'ring-2 ring-amber-500 dark:ring-amber-400' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedAccount(account.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                      <CreditCardIcon className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <Text>{account.account_type}</Text>
                      <Text className="text-xs text-gray-500">•••• {account.account_number.slice(-4)}</Text>
                    </div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    account.status === 'active' ? 'bg-emerald-500' : 
                    account.status === 'frozen' ? 'bg-rose-500' : 'bg-gray-500'
                  }`}></div>
                </div>
                <div className="mt-4">
                  <Text className="text-xs text-gray-500">Available Balance</Text>
                  <Text className="text-xs text-gray-500">
                    Updated {new Date().toLocaleDateString()}
                  </Text>
                </div>
                <div className="mt-1">
                  <Metric>{hideBalances ? '••••••' : `${account.currency} ${account.balance.toLocaleString()}`}</Metric>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Selected Account Details */}
        {selectedAccount && (
          <motion.div variants={item}>
            <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                    <CreditCardIcon className="w-8 h-8 text-amber-600" />
                  </div>
                  <div>
                    <Title>{getSelectedAccount()?.account_type} Details</Title>
                    <Text>Account Number: •••• {getSelectedAccount()?.account_number.slice(-4)}</Text>
                  </div>
                </div>
                <Button 
                  icon={ArrowPathIcon}
                  color="amber"
                  variant="light"
                  onClick={fetchAccounts}
                >
                  Refresh
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
                  <Text className="text-white/80">Current Balance</Text>
                  <Metric className="text-white">
                    {hideBalances ? '••••••' : `${getSelectedAccount()?.currency} ${getSelectedAccount()?.balance.toLocaleString()}`}
                  </Metric>
                </Card>
                
                <Card className="bg-white dark:bg-gray-800">
                  <Text>Account Type</Text>
                  <Metric className="text-amber-600">{getSelectedAccount()?.account_type}</Metric>
                </Card>
                
                <Card className="bg-white dark:bg-gray-800">
                  <Text>Status</Text>
                  <div className="flex items-center gap-2 mt-2">
                    <div className={`w-3 h-3 rounded-full ${
                      getSelectedAccount()?.status === 'active' ? 'bg-emerald-500' : 
                      getSelectedAccount()?.status === 'frozen' ? 'bg-rose-500' : 'bg-gray-500'
                    }`}></div>
                    <Text className="capitalize">{getSelectedAccount()?.status}</Text>
                  </div>
                </Card>
              </div>

              <div className="mt-6">
                <Title>Recent Transactions</Title>
                <div className="mt-4 space-y-4">
                  {getAccountTransactions(selectedAccount).map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${
                          transaction.type === 'deposit' 
                            ? 'bg-emerald-100 dark:bg-emerald-900/30' 
                            : 'bg-rose-100 dark:bg-rose-900/30'
                        }`}>
                          {transaction.type === 'deposit' ? 
                            <ArrowUpIcon className="w-5 h-5 text-emerald-600" /> :
                            <ArrowDownIcon className="w-5 h-5 text-rose-600" />
                          }
                        </div>
                        <div>
                          <Text>{transaction.description}</Text>
                          <Text className="text-xs text-gray-500">
                            {transaction.date.toLocaleDateString()}
                          </Text>
                        </div>
                      </div>
                      <Text className={
                        transaction.type === 'deposit' 
                          ? 'text-emerald-600 dark:text-emerald-500' 
                          : 'text-rose-600 dark:text-rose-500'
                      }>
                        {transaction.type === 'deposit' ? '+' : '-'}
                        ${hideBalances ? '••••' : transaction.amount.toLocaleString()}
                      </Text>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Button 
                    variant="light"
                    color="amber"
                    className="w-full"
                    onClick={() => window.location.href = '/dashboard/transactions'}
                  >
                    View All Transactions
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
} 