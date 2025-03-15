import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col bg-gradient-to-b from-amber-50 to-white">
      {/* Navigation - Only on landing page */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-amber-100/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link href="/" className="text-2xl font-bold text-amber-600 hover:text-amber-700 transition-colors">
              Siddhartha Bank
            </Link>
            <nav className="flex items-center space-x-6">
              <Link
                href="/login"
                className="text-gray-600 hover:text-amber-600 transition-colors font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-amber-500 text-white px-6 py-2.5 rounded-xl hover:bg-amber-600 transition-all duration-200 shadow-lg hover:shadow-amber-500/25 hover:-translate-y-0.5 font-medium"
              >
                Open Account
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Add padding to account for fixed header */}
      <div className="pt-20">
        {/* Hero Section with Wave Transition */}
        <section className="relative pt-20 pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              <div className="text-center lg:text-left">
                <div className="inline-block">
                  <span className="px-3 py-1 text-amber-600 text-sm font-semibold bg-amber-100 rounded-full mb-4">
                    Trusted by millions
                  </span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight mt-4">
                  Banking Made{" "}
                  <span className="text-amber-600 inline-block">Simple</span>
                  {" "}and{" "}
                  <span className="text-amber-600 inline-block">Secure</span>
                </h1>
                <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl lg:max-w-none mx-auto">
                  Experience modern banking with Siddhartha Bank. Send money, track expenses, 
                  and manage your finances all in one place.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    href="/register"
                    className="inline-flex justify-center items-center px-8 py-4 rounded-xl font-semibold bg-amber-500 text-white hover:bg-amber-600 transition-all duration-200 shadow-lg hover:shadow-amber-500/25 hover:-translate-y-0.5"
                  >
                    Open Account
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex justify-center items-center px-8 py-4 rounded-xl font-semibold text-amber-600 bg-white border-2 border-amber-200 hover:border-amber-300 hover:bg-amber-50 transition-all duration-200 hover:-translate-y-0.5"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
              <div className="relative h-[400px] lg:h-[500px] w-full order-first lg:order-last">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-amber-500/5 rounded-3xl" />
          <Image
                  src="/banking-hero.svg"
                  alt="Banking Illustration"
                  fill
                  priority
                  className="object-contain p-8"
                />
              </div>
            </div>
          </div>
          {/* Wave Separator */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-amber-600 clip-wave" />
        </section>

        {/* Stats Section */}
        <section className="bg-amber-600 py-16 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 transform hover:scale-105 transition-transform duration-200">
                  <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-amber-100">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Curved Separator */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-white clip-curve" />
        </section>

        {/* Features Section with Connected Design */}
        <section className="py-20 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Why Choose <span className="text-amber-600">Siddhartha Bank</span>
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Experience banking that puts you first with our innovative features and secure platform.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 relative">
              {/* Connection Lines */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-amber-200 hidden lg:block" />
              
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="relative group"
                >
                  <div className="bg-white rounded-2xl p-8 shadow-xl shadow-amber-100/50 hover:shadow-2xl hover:shadow-amber-200/50 transition-all duration-300 hover:-translate-y-1">
                    <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section with Gradient Background */}
        <section className="relative py-20 bg-gradient-to-b from-amber-50/50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900">Our Services</h2>
              <p className="mt-4 text-lg text-gray-600">Comprehensive banking solutions for all your needs</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div 
                  key={index} 
                  className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-amber-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <div className="text-amber-600 mb-6 transform group-hover:scale-110 transition-transform duration-200">
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-4">{service.title}</h3>
                    <p className="text-gray-600">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section with Gradient Overlay */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-amber-600" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">
                    Ready to Start Banking with Us?
                  </h2>
                  <p className="text-amber-100 text-lg mb-8">
                    Open an account in minutes and experience modern banking at its finest.
                  </p>
                  <Link
                    href="/register"
                    className="inline-flex items-center px-8 py-4 rounded-xl bg-white text-amber-600 font-semibold hover:bg-amber-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    Open Account Now
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
                <div className="relative h-64 md:h-96">
          <Image
                    src="/banking-app.svg"
                    alt="Banking App"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer with Gradient Background */}
        <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300 pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
              {footerSections.map((section, index) => (
                <div key={index}>
                  <h3 className="text-white font-semibold mb-4">{section.title}</h3>
                  <ul className="space-y-3">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <Link 
                          href={link.href} 
                          className="text-gray-400 hover:text-amber-500 transition-colors duration-200"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
              <p>© 2024 Siddhartha Bank. All rights reserved.</p>
            </div>
          </div>
      </footer>
      </div>
    </div>
  );
}

const stats = [
  { value: "10M+", label: "Active Users" },
  { value: "99.9%", label: "Uptime" },
  { value: "24/7", label: "Support" },
  { value: "150+", label: "Countries" },
];

const features = [
  {
    title: "Secure Transfers",
    description: "Send money securely to other members with advanced encryption and real-time fraud detection.",
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
  {
    title: "Real-time Balance",
    description: "Track your balance and transaction history in real-time with instant notifications.",
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    title: "Instant Transfers",
    description: "Experience lightning-fast transfers with our advanced banking infrastructure.",
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
];

const services = [
  {
    title: "Personal Banking",
    description: "Manage your personal finances with our comprehensive suite of banking services.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    title: "Business Banking",
    description: "Solutions designed to help your business grow and succeed.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Mobile Banking",
    description: "Bank on the go with our secure and user-friendly mobile app.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
];

const footerSections = [
  {
    title: "About",
    links: [
      { label: "About Us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Personal Banking", href: "#" },
      { label: "Business Banking", href: "#" },
      { label: "Mobile Banking", href: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "#" },
      { label: "FAQs", href: "#" },
      { label: "Security", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
    ],
  },
];
