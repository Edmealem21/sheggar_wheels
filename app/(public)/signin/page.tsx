"use client";
import { useEffect } from "react";
import Link from "next/link";
import { seedData } from "@/lib/seed";
import { signInAsDemo } from "@/lib/auth";
import { Car } from "lucide-react";

export default function SignIn() {
  // Ensure demo data is available if user lands here directly
  useEffect(() => {
    seedData();
  }, []);

  return (
    <div className="min-h-screen grid lg:grid-cols-2 font-sans">
      {/* Left Panel - Image & Branding */}
      <div className="relative hidden lg:flex flex-col justify-between bg-slate-900 p-10 overflow-hidden">
        {/* Background Image - Night Road / Mountain */}
        <img 
          src="https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=2072&auto=format&fit=crop" 
          alt="Car driving on mountain road" 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        
        {/* Logo - Top Left */}
        <Link href="/" className="relative z-10 flex items-center gap-2 w-fit">
          <div className="bg-blue-600 p-1.5 rounded-md">
            <Car className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-white text-lg tracking-wide">Sheggar Wheels</span>
        </Link>

        {/* Bottom Text */}
        <div className="relative z-10 mb-6">
          <div className="w-12 h-1 bg-orange-400 mb-6"></div>
          <h1 className="text-[32px] font-bold text-white max-w-md leading-tight">
            Rent local. Drive Addis your way.
          </h1>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex items-center justify-center p-8 bg-[#f8f9fc]">
        <div className="w-full max-w-[400px]">
          
          <div className="mb-8">
            <h2 className="text-[32px] font-bold text-gray-900 mb-2 tracking-tight">Welcome back</h2>
            <p className="text-gray-500 text-[15px]">Sign in to manage your trips, cars and requests.</p>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Email</label>
              <input 
                type="email" 
                placeholder="you@example.com" 
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 text-[15px] placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm" 
              />
            </div>
            
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 text-[15px] placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm" 
              />
              <p className="text-[12px] text-gray-400 mt-1.5">
                Visual demo only — no password is collected or stored.
              </p>
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm mt-4"
            >
              Sign in
            </button>
          </form>

          {/* Divider */}
          <div className="relative mt-8 mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-[13px]">
              <span className="px-4 bg-[#f8f9fc] text-gray-400">or use a demo account</span>
            </div>
          </div>

          {/* Demo Account Buttons */}
          <div className="flex gap-3">
            <button
              type="button" 
              onClick={() => signInAsDemo("renter-1")}
              className="flex-1 bg-white border border-gray-200 text-gray-700 py-2 rounded-lg text-[13px] font-medium hover:bg-gray-50 transition-colors shadow-sm"
            >
              Demo Renter
            </button>
            <button
              type="button" // <-- ADD THIS
              onClick={() => signInAsDemo("owner-1")}
              className="flex-1 bg-white border border-gray-200 text-gray-700 py-2 rounded-lg text-[13px] font-medium hover:bg-gray-50 transition-colors shadow-sm"
            >
              Demo Owner
            </button>
            <button 
              type="button"
              onClick={() => signInAsDemo("admin-1")}
              className="flex-1 bg-white border border-gray-200 text-gray-700 py-2 rounded-lg text-[13px] font-medium hover:bg-gray-50 transition-colors shadow-sm"
            >
              Demo Admin
            </button>
          </div>

          <p className="mt-8 text-center text-[13px] text-gray-500">
            New here? <Link href="/signup" className="text-blue-600 font-medium hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}