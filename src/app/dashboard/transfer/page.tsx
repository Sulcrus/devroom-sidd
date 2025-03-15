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
  CheckCircleIcon,
  ExclamationCircleIcon,
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
  const [recipientInfo, setRecipientInfo] = useState<{
    username: string;
    first_name: string;
    last_name: string;
  } | null>(null);
  const [lookupStatus, setLookupStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (formData.toUsername.length > 3) {
      lookupUser();
    } else {
      setRecipientInfo(null);
      setLookupStatus('idle');
    }
  }, [formData.toUsername]);

  const fetchAccounts = async () => {
    try {
      const res = await fetch("/api/accounts");
      const data = await res.json();
      setAccounts(data);
      if (data.length > 0) {
        setFormData(prev => ({ ...prev, fromAccountId: data[0].id }));
      }
    } catch (error) {
      toast.error("Failed to load accounts");
    }
  };

  const lookupUser = async () => {
    try {
      setLookupStatus('loading');
      // In a real app, this would be an API call
      // const res = await fetch(`/api/users/lookup?username=${formData.toUsername}`);
      // const data = await res.json();
      
      // For demo purposes, we'll simulate a lookup
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulate finding a user (in a real app, this would come from the API)
      if (formData.toUsername.toLowerCase() === 'johndoe') {
        setRecipientInfo({
          username: 'johndoe',
          first_name: 'John',
          last_name: 'Doe'
        });
        setLookupStatus('success');
      } else if (formData.toUsername.toLowerCase() === 'janedoe') {
        setRecipientInfo({
          username: 'janedoe',
          first_name: 'Jane',
          last_name: 'Doe'
        });
        setLookupStatus('success');
      } else if (formData.toUsername.length > 5) {
        setLookupStatus('error');
        setRecipientInfo(null);
      }
    } catch (error) {
      setLookupStatus('error');
      setRecipientInfo(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fromAccountId || !formData.toUsername || !formData.amount) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (lookupStatus !== 'success') {
      toast.error("Please enter a valid recipient username");
      return;
    }
    
    try {
      setLoading(true);
      
      // In a real app, this would be an API call
      // const res = await fetch("/api/transfers", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(formData)
      // });
      // const data = await res.json();
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Successfully transferred $${formData.amount} to ${recipientInfo?.first_name} ${recipientInfo?.last_name}`);
      
      // Reset form
      setFormData({
        fromAccountId: accounts[0]?.id || "",
        toUsername: "",
        amount: "",
        description: ""
      });
      setRecipientInfo(null);
      setLookupStatus('idle');
    } catch (error) {
      toast.error("Transfer failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getSelectedAccount = () => {
    return accounts.find(account => account.id === formData.fromAccountId);
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
        <motion.div variants={item}>
          <Title>Transfer Money</Title>
          <Text>Send money to other users securely</Text>
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Transfer Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Text>From Account</Text>
                  <Select
                    value={formData.fromAccountId}
                    onValueChange={(value) => handleSelectChange("fromAccountId", value)}
                    className="mt-2"
                  >
                    {accounts.map(account => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.account_type} (•••{account.account_number.slice(-4)}) - ${account.balance.toLocaleString()}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                
                <div>
                  <Text>To Username</Text>
                  <div className="mt-2">
                    <TextInput
                      name="toUsername"
                      value={formData.toUsername}
                      onChange={handleChange}
                      placeholder="Enter recipient's username"
                      icon={UserCircleIcon}
                      error={lookupStatus === 'error'}
                      errorMessage="User not found"
                      disabled={loading}
                    />
                    
                    {lookupStatus === 'success' && recipientInfo && (
                      <div className="mt-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg flex items-center gap-3">
                        <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
                        <div>
                          <Text>Recipient found:</Text>
                          <Text className="font-medium">
                            {recipientInfo.first_name} {recipientInfo.last_name} (@{recipientInfo.username})
                          </Text>
                        </div>
                      </div>
                    )}
                    
                    {lookupStatus === 'error' && (
                      <div className="mt-2 p-3 bg-rose-50 dark:bg-rose-900/20 rounded-lg flex items-center gap-3">
                        <ExclamationCircleIcon className="w-5 h-5 text-rose-600" />
                        <Text>User not found. Please check the username.</Text>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <Text>Amount</Text>
                  <TextInput
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="Enter amount"
                    icon={BanknotesIcon}
                    type="number"
                    min="0.01"
                    step="0.01"
                    disabled={loading}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Text>Description (Optional)</Text>
                  <TextInput
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="What's this for?"
                    disabled={loading}
                    className="mt-2"
                  />
                </div>
                
                <Button
                  type="submit"
                  color="amber"
                  icon={ArrowRightIcon}
                  loading={loading}
                  disabled={loading || !formData.fromAccountId || !formData.toUsername || !formData.amount || lookupStatus !== 'success'}
                  className="w-full"
                >
                  Transfer Money
                </Button>
              </form>
            </Card>
          </div>

          {/* Account Info */}
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
      </motion.div>
    </div>
  );
} 