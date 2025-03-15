"use client";

import { useState } from "react";
import { Card, Title, Text, TextInput, Button } from "@tremor/react";
import { motion } from "framer-motion";
import useUserStore from "@/store/useUserStore";
import { useTheme } from "next-themes";
import {
  UserCircleIcon,
  BellIcon,
  ShieldCheckIcon,
  SunIcon,
  MoonIcon,
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { Switch } from "@headlessui/react";

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

export default function SettingsPage() {
  const { user } = useUserStore();
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    marketing: false
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
        <motion.div variants={item}>
          <Title>Settings</Title>
          <Text>Manage your account preferences</Text>
        </motion.div>

        {/* Profile Settings */}
        <motion.div variants={item}>
          <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                <UserCircleIcon className="w-8 h-8 text-amber-600" />
              </div>
              <div>
                <Title>Profile Information</Title>
                <Text>Update your personal details</Text>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Text>First Name</Text>
                <TextInput defaultValue={user?.first_name} />
              </div>
              <div className="space-y-2">
                <Text>Last Name</Text>
                <TextInput defaultValue={user?.last_name} />
              </div>
              <div className="space-y-2">
                <Text>Email</Text>
                <TextInput 
                  icon={EnvelopeIcon}
                  defaultValue={user?.email} 
                />
              </div>
              <div className="space-y-2">
                <Text>Phone</Text>
                <TextInput 
                  icon={PhoneIcon}
                  defaultValue={user?.phone} 
                />
              </div>
            </div>

            <Button color="amber" className="mt-6">
              Save Changes
            </Button>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div variants={item}>
          <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <BellIcon className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <Title>Notifications</Title>
                <Text>Choose what you want to be notified about</Text>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Text>Email Notifications</Text>
                  <Text className="text-gray-500">Get updates via email</Text>
                </div>
                <Switch
                  checked={notifications.email}
                  onChange={(val) => setNotifications(prev => ({ ...prev, email: val }))}
                  className={`${
                    notifications.email ? 'bg-amber-600' : 'bg-gray-300 dark:bg-gray-700'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
                >
                  <span
                    className={`${
                      notifications.email ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Text>Push Notifications</Text>
                  <Text className="text-gray-500">Get updates on your device</Text>
                </div>
                <Switch
                  checked={notifications.push}
                  onChange={(val) => setNotifications(prev => ({ ...prev, push: val }))}
                  className={`${
                    notifications.push ? 'bg-amber-600' : 'bg-gray-300 dark:bg-gray-700'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
                >
                  <span
                    className={`${
                      notifications.push ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Text>Marketing Emails</Text>
                  <Text className="text-gray-500">Receive promotional content</Text>
                </div>
                <Switch
                  checked={notifications.marketing}
                  onChange={(val) => setNotifications(prev => ({ ...prev, marketing: val }))}
                  className={`${
                    notifications.marketing ? 'bg-amber-600' : 'bg-gray-300 dark:bg-gray-700'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
                >
                  <span
                    className={`${
                      notifications.marketing ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Appearance */}
        <motion.div variants={item}>
          <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                  {theme === 'dark' ? (
                    <MoonIcon className="w-8 h-8 text-purple-600" />
                  ) : (
                    <SunIcon className="w-8 h-8 text-purple-600" />
                  )}
                </div>
                <div>
                  <Title>Theme Preference</Title>
                  <Text>Choose your preferred theme</Text>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={theme === 'light' ? 'primary' : 'secondary'}
                  color="amber"
                  onClick={() => setTheme('light')}
                  icon={SunIcon}
                >
                  Light
                </Button>
                <Button 
                  variant={theme === 'dark' ? 'primary' : 'secondary'}
                  color="amber"
                  onClick={() => setTheme('dark')}
                  icon={MoonIcon}
                >
                  Dark
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Security */}
        <motion.div variants={item}>
          <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                <ShieldCheckIcon className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <Title>Security</Title>
                <Text>Manage your security preferences</Text>
              </div>
            </div>

            <div className="space-y-4">
              <Button color="amber" variant="secondary" className="w-full">
                Change Password
              </Button>
              <Button color="amber" variant="secondary" className="w-full">
                Two-Factor Authentication
              </Button>
              <Button color="amber" variant="secondary" className="w-full">
                Login History
              </Button>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
} 