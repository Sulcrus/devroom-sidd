"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

export default function LandingPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 dark:from-gray-900 dark:to-amber-950 overflow-hidden relative">
      {/* Floating elements - Ghibli-inspired */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-20 left-[10%] w-16 h-16 bg-amber-200 dark:bg-amber-700 rounded-full opacity-30"
          animate={{ 
            y: [0, -15, 0], 
            x: [0, 10, 0],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 8,
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute top-40 right-[15%] w-12 h-12 bg-emerald-200 dark:bg-emerald-700 rounded-full opacity-30"
          animate={{ 
            y: [0, 20, 0], 
            x: [0, -15, 0],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 10,
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute bottom-32 left-[25%] w-20 h-20 bg-rose-200 dark:bg-rose-700 rounded-full opacity-20"
          animate={{ 
            y: [0, -25, 0], 
            x: [0, 20, 0],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 12,
            ease: "easeInOut" 
          }}
        />
        
        {/* Leaf elements */}
        <motion.div 
          className="absolute top-[15%] right-[20%]"
          animate={{ 
            y: [0, 15, 0], 
            rotate: [0, 5, 0],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 6,
            ease: "easeInOut" 
          }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill={theme === 'dark' ? '#4ade80' : '#86efac'} fillOpacity="0.3"/>
            <path d="M12 6C16 6 20 10 20 12C20 14 16 18 12 18C8 18 4 14 4 12C4 10 8 6 12 6Z" fill={theme === 'dark' ? '#4ade80' : '#86efac'} fillOpacity="0.5"/>
          </svg>
        </motion.div>
        
        <motion.div 
          className="absolute bottom-[25%] left-[10%]"
          animate={{ 
            y: [0, -10, 0], 
            rotate: [0, -5, 0],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 7,
            ease: "easeInOut" 
          }}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill={theme === 'dark' ? '#fcd34d' : '#fde68a'} fillOpacity="0.4"/>
            <path d="M12 6C16 6 20 10 20 12C20 14 16 18 12 18C8 18 4 14 4 12C4 10 8 6 12 6Z" fill={theme === 'dark' ? '#fcd34d' : '#fde68a'} fillOpacity="0.6"/>
          </svg>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
            <span className="text-white font-bold">SB</span>
          </div>
          <span className="text-xl font-semibold bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent">
            Siddhartha
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 transition-colors"
          >
            {theme === 'dark' ? (
              <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          <Link 
            href="/login"
            className="px-4 py-2 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-amber-600 dark:text-amber-400 hover:bg-white dark:hover:bg-gray-700 transition-colors"
          >
            Login
          </Link>
          <Link 
            href="/register"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 px-6 py-12 md:py-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              Banking that feels like <span className="text-amber-600 dark:text-amber-400">home</span>
            </h1>
            <p className="mt-6 text-lg text-gray-700 dark:text-gray-300">
              Experience the warmth of personal banking with Siddhartha. We're not just a bank, we're your financial companion on life's journey.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link 
                href="/register"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 transition-colors text-lg font-medium"
              >
                Open an Account
              </Link>
              <Link 
                href="/about"
                className="px-6 py-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-amber-600 dark:text-amber-400 hover:bg-white dark:hover:bg-gray-700 transition-colors text-lg font-medium"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-xl">
              <Image 
                src="/banking-hero.svg" 
                alt="Siddhartha Banking" 
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 to-transparent"></div>
            </div>
            
            {/* Floating cards - Ghibli-inspired */}
            <motion.div 
              className="absolute -top-10 -right-10 w-40 h-24 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 transform rotate-6"
              animate={{ 
                y: [0, -10, 0], 
                rotate: [6, 8, 6],
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 5,
                ease: "easeInOut" 
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="text-xs">
                  <p className="font-medium text-gray-900 dark:text-white">Payment Sent</p>
                  <p className="text-gray-500 dark:text-gray-400">$250.00</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="absolute -bottom-5 -left-5 w-48 h-28 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 transform -rotate-3"
              animate={{ 
                y: [0, 10, 0], 
                rotate: [-3, -5, -3],
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 6,
                ease: "easeInOut" 
              }}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-gray-900 dark:text-white">Savings Goal</p>
                  <p className="text-xs text-emerald-600">75%</p>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">$1,500 / $2,000</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 px-6 py-16 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Banking with a Personal Touch</h2>
            <p className="mt-4 text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              We combine modern technology with the warmth of personal service to create a banking experience that feels like home.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Secure Savings",
                description: "Watch your money grow safely with our competitive interest rates and zero-fee savings accounts.",
                icon: (
                  <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )
              },
              {
                title: "Easy Transfers",
                description: "Send money to friends and family with just a few taps, no matter where they bank.",
                icon: (
                  <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                )
              },
              {
                title: "Smart Budgeting",
                description: "Take control of your finances with our intuitive budgeting tools and spending insights.",
                icon: (
                  <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                )
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl w-fit mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 bg-amber-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                  <span className="text-white font-bold">SB</span>
                </div>
                <span className="text-lg font-semibold bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent">
                  Siddhartha
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Banking that feels like home
              </p>
            </div>
            
            {[
              {
                title: "Company",
                links: ["About", "Careers", "Press", "News"]
              },
              {
                title: "Resources",
                links: ["Blog", "Help Center", "Contact", "Community"]
              },
              {
                title: "Legal",
                links: ["Privacy", "Terms", "Security", "Accessibility"]
              }
            ].map((column, index) => (
              <div key={index}>
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">{column.title}</h4>
                <ul className="space-y-2">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800 text-center text-gray-600 dark:text-gray-400">
            <p>© 2024 Siddhartha Bank. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
