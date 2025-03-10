"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "male",
    maritalStatus: "single",
    
    // Address Information
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Nepal",
    
    // Identity Documents
    citizenshipNumber: "",
    citizenshipIssuedDistrict: "",
    citizenshipIssuedDate: "",
    panNumber: "",
    
    // Employment Information
    occupation: "",
    employerName: "",
    monthlyIncome: "",
    
    // Account Information
    accountType: "savings",
    password: "",
    confirmPassword: "",
    
    // Document Upload
    citizenshipFront: null as File | null,
    citizenshipBack: null as File | null,
    photo: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        [e.target.name]: e.target.files![0]
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step < 4) {
      setStep(step + 1);
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Automatically log in after registration
      const loginResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!loginResponse.ok) {
        throw new Error("Login failed after registration");
      }

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Section - Progress & Info */}
      <div className="hidden lg:flex flex-col bg-gradient-to-br from-amber-500 to-amber-600 text-white p-12 justify-between relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-amber-100 bg-clip-text text-transparent">
            Create Your Account
          </h1>
          <p className="text-amber-100 text-lg mb-12">
            Follow the steps to open your bank account online.
          </p>

          <div className="space-y-8">
            {steps.map((s, index) => (
              <div
                key={index}
                className={`flex items-start space-x-4 ${
                  step > index + 1 ? "text-amber-100" : step === index + 1 ? "text-white" : "text-amber-200/60"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 flex-shrink-0 ${
                    step > index + 1
                      ? "bg-white text-amber-600 border-white"
                      : step === index + 1
                      ? "border-white"
                      : "border-amber-200/60"
                  }`}
                >
                  {step > index + 1 ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-lg">{index + 1}</span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{s.title}</h3>
                  <p className={`text-sm mt-1 ${step === index + 1 ? "text-amber-100" : "text-amber-200/60"}`}>
                    {s.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat bg-center transform rotate-12 scale-150" />
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="relative flex flex-col min-h-screen">
        {/* Add padding-top to account for the back button */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-12 pt-24">
          <div className="w-full max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm">
                  {error}
                </div>
              )}

              {step === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Personal Information</h2>
                    <p className="mt-2 text-gray-600">Please provide your basic details</p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        required
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Identity Verification</h2>
                    <p className="mt-2 text-gray-600">Provide your citizenship details</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Citizenship Number
                    </label>
                    <input
                      type="text"
                      name="citizenshipNumber"
                      required
                      value={formData.citizenshipNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Issued District
                    </label>
                    <input
                      type="text"
                      name="citizenshipIssuedDistrict"
                      required
                      value={formData.citizenshipIssuedDistrict}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Issue Date
                    </label>
                    <input
                      type="date"
                      name="citizenshipIssuedDate"
                      required
                      value={formData.citizenshipIssuedDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Document Upload</h2>
                    <p className="mt-2 text-gray-600">Upload required documents</p>
                  </div>

                  <div className="space-y-6">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Citizenship Front
                      </label>
                      <input
                        type="file"
                        name="citizenshipFront"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full"
                      />
                      <p className="mt-2 text-sm text-gray-500">
                        Upload a clear photo of your citizenship card (front)
                      </p>
                    </div>

                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Citizenship Back
                      </label>
                      <input
                        type="file"
                        name="citizenshipBack"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full"
                      />
                      <p className="mt-2 text-sm text-gray-500">
                        Upload a clear photo of your citizenship card (back)
                      </p>
                    </div>

                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Recent Photo
                      </label>
                      <input
                        type="file"
                        name="photo"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full"
                      />
                      <p className="mt-2 text-sm text-gray-500">
                        Upload a recent passport-size photo
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Account Setup</h2>
                    <p className="mt-2 text-gray-600">Choose your account type and set password</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Type
                    </label>
                    <select
                      name="accountType"
                      value={formData.accountType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    >
                      <option value="savings">Savings Account</option>
                      <option value="current">Current Account</option>
                      <option value="fixed">Fixed Deposit Account</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-6">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50"
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-8 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 ml-auto flex items-center gap-2 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </>
                  ) : step === 4 ? (
                    "Create Account"
                  ) : (
                    "Continue"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

const steps = [
  {
    title: "Personal Information",
    description: "Basic details and contact information",
  },
  {
    title: "Identity Verification",
    description: "Citizenship and identity details",
  },
  {
    title: "Document Upload",
    description: "Upload required documents",
  },
  {
    title: "Account Setup",
    description: "Choose account type and set password",
  },
]; 