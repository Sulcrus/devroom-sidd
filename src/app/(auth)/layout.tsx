"use client";

import React from 'react';
import { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import { GeistSans } from 'geist/font/sans';
import { motion, AnimatePresence } from "framer-motion";

export const metadata: Metadata = {
  title: 'Authentication - Siddhartha Bank',
  description: 'Secure authentication for Siddhartha Bank',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`min-h-screen bg-background ${GeistSans.className}`}>
      <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <img src="/logo.png" alt="Logo" className="h-8 w-8 mr-2" />
            Siddhartha Bank
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;Secure, reliable, and innovative banking solutions for a better financial future.&rdquo;
              </p>
              <footer className="text-sm">Siddhartha Bank</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            {children}
          </div>
        </div>
      </div>
      <Toaster position="top-right" />

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Top-left blob */}
        <div className="absolute -top-48 -left-48 w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        
        {/* Top-right blob */}
        <div className="absolute -top-48 -right-48 w-96 h-96 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        
        {/* Bottom-left blob */}
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        
        {/* Bottom-right blob */}
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-6000" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-[0.02]" />
      </div>
    </div>
  );
} 