"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

export default function LandingPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);

  useEffect(() => {
    setMounted(true);
    
    // Auto-rotate features
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 3);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  const features = [
    {
      title: "Secure Banking",
      description: "Your financial security is our priority with state-of-the-art encryption and authentication.",
      icon: "/icons/shield.svg",
      color: "from-emerald-400 to-emerald-600"
    },
    {
      title: "Smart Savings",
      description: "Intelligent tools to help you save more and achieve your financial goals faster.",
      icon: "/icons/piggy-bank.svg",
      color: "from-amber-400 to-amber-600"
    },
    {
      title: "Easy Transfers",
      description: "Send money to friends and family instantly, with just a few taps.",
      icon: "/icons/transfer.svg",
      color: "from-blue-400 to-blue-600"
    }
  ];

  const testimonials = [
    {
      name: "Mei Kusakabe",
      role: "Small Business Owner",
      content: "Siddhartha Bank helped me grow my flower shop with their small business tools. Their personalized service makes me feel valued.",
      avatar: "/avatars/mei.jpg"
    },
    {
      name: "Ashitaka",
      role: "Environmental Consultant",
      content: "I appreciate their commitment to sustainable banking. Their green investment options align perfectly with my values.",
      avatar: "/avatars/ashitaka.jpg"
    },
    {
      name: "Sophie Hatter",
      role: "Boutique Manager",
      content: "The mobile app is so intuitive! I can manage my finances on the go, which is essential for my busy lifestyle.",
      avatar: "/avatars/sophie.jpg"
    }
  ];

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
          className="absolute top-[30%] right-[20%] w-8 h-12 bg-emerald-300 dark:bg-emerald-700 rounded-full opacity-20 origin-bottom"
          animate={{ 
            rotate: [0, 10, -10, 0],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 8,
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute bottom-[40%] left-[15%] w-10 h-14 bg-emerald-300 dark:bg-emerald-700 rounded-full opacity-20 origin-bottom"
          animate={{ 
            rotate: [0, -15, 15, 0],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 10,
            ease: "easeInOut" 
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <span className="text-white font-bold">SB</span>
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent">
              Siddhartha
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            {["Features", "Security", "About", "Support"].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 transition-colors"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              className="px-4 py-2 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-700 transition-colors"
            >
              Sign In
            </Link>
            
            <Link 
              href="/register"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        className="relative z-10 px-6 pt-20 pb-32"
        style={{ opacity, y }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              Banking that feels like <span className="bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent">home</span>
            </h1>
            <p className="mt-6 text-xl text-gray-700 dark:text-gray-300">
              Experience banking with the warmth and comfort of a trusted friend. Secure, simple, and designed with your peace of mind as our priority.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link 
                href="/register"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white text-center font-medium hover:from-amber-600 hover:to-amber-700 transition-colors"
              >
                Open an Account
              </Link>
              <a 
                href="#features"
                className="px-8 py-4 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white text-center font-medium hover:bg-white dark:hover:bg-gray-700 transition-colors"
              >
                Learn More
              </a>
            </div>
          </motion.div>
          
          <motion.div 
            className="mt-20 relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative mx-auto max-w-4xl">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-rose-500/20 rounded-3xl transform rotate-1"></div>
              <div className="absolute inset-0 bg-gradient-to-l from-blue-500/20 to-emerald-500/20 rounded-3xl transform -rotate-1"></div>
              <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden">
                <div className="aspect-[16/9] relative">
                  <Image 
                    src="/dashboard-preview.png" 
                    alt="Siddhartha Bank Dashboard" 
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-12 -left-12 w-24 h-24 bg-amber-400/10 dark:bg-amber-400/5 rounded-full"></div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-emerald-400/10 dark:bg-emerald-400/5 rounded-full"></div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-24 bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Thoughtfully Designed Features
            </h2>
            <p className="mt-4 text-xl text-gray-700 dark:text-gray-300">
              Every feature is crafted with care to make your banking experience delightful
            </p>
          </div>
          
          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="relative">
              <div className="sticky top-24">
                <div className="space-y-8">
                  {features.map((feature, index) => (
                    <div 
                      key={index}
                      className={`p-6 rounded-xl transition-all duration-300 cursor-pointer ${
                        activeFeature === index 
                          ? `bg-gradient-to-r ${feature.color} text-white shadow-lg` 
                          : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700'
                      }`}
                      onClick={() => setActiveFeature(index)}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${
                          activeFeature === index 
                            ? 'bg-white/20' 
                            : `bg-gradient-to-r ${feature.color} bg-opacity-10`
                        }`}>
                          <svg className={`w-6 h-6 ${
                            activeFeature === index ? 'text-white' : `text-${feature.color.split('-')[1]}-600`
                          }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <h3 className={`text-xl font-semibold ${
                            activeFeature !== index && 'text-gray-900 dark:text-white'
                          }`}>
                            {feature.title}
                          </h3>
                          <p className={`mt-2 ${
                            activeFeature !== index && 'text-gray-600 dark:text-gray-400'
                          }`}>
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeFeature}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="aspect-[4/3] relative"
                  >
                    <Image 
                      src={`/feature-${activeFeature + 1}.png`} 
                      alt={features[activeFeature].title}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-amber-400/10 dark:bg-amber-400/5 rounded-full"></div>
              <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-emerald-400/10 dark:bg-emerald-400/5 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="relative z-10 px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Bank with Complete Peace of Mind
              </h2>
              <p className="mt-4 text-xl text-gray-700 dark:text-gray-300">
                Your security is our highest priority. We employ advanced encryption and multi-factor authentication to keep your finances safe.
              </p>
              
              <div className="mt-8 space-y-6">
                {[
                  {
                    title: "End-to-End Encryption",
                    description: "All your data is encrypted using industry-leading protocols"
                  },
                  {
                    title: "Biometric Authentication",
                    description: "Access your account securely with fingerprint or face recognition"
                  },
                  {
                    title: "Real-time Monitoring",
                    description: "Our systems detect and prevent suspicious activities 24/7"
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-gray-600 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-10">
                <Link 
                  href="/security"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium hover:from-emerald-600 hover:to-emerald-700 transition-colors"
                >
                  Learn About Our Security
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative mx-auto max-w-md">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-3xl transform rotate-1"></div>
                <div className="absolute inset-0 bg-gradient-to-l from-emerald-500/20 to-blue-500/20 rounded-3xl transform -rotate-1"></div>
                <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden p-8">
                  <div className="aspect-square relative">
                    <Image 
                      src="/security-illustration.png" 
                      alt="Security Illustration" 
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-emerald-400/10 dark:bg-emerald-400/5 rounded-full"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-400/10 dark:bg-blue-400/5 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 px-6 py-24 bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              What Our Customers Say
            </h2>
            <p className="mt-4 text-xl text-gray-700 dark:text-gray-300">
              Join thousands of satisfied customers who trust Siddhartha Bank
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full overflow-hidden relative">
                    <Image 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  "{testimonial.content}"
                </p>
                <div className="mt-6 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/30 to-rose-500/30 rounded-3xl transform rotate-1"></div>
            <div className="absolute inset-0 bg-gradient-to-l from-amber-500/30 to-rose-500/30 rounded-3xl transform -rotate-1"></div>
            <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Ready to Experience Banking with Heart?
              </h2>
              <p className="mt-4 text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                Join Siddhartha Bank today and discover a banking experience that feels like home.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/register"
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white text-center font-medium hover:from-amber-600 hover:to-amber-700 transition-colors"
                >
                  Open an Account
                </Link>
                <Link 
                  href="/contact"
                  className="px-8 py-4 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center font-medium hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

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
