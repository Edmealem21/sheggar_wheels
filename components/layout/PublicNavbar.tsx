"use client";
import { useState } from "react";
import Link from "next/link";
import { Car, Menu, X } from "lucide-react";

export const PublicNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 px-6 md:px-8 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 z-50">
          <div className="bg-blue-600 p-1.5 rounded-md">
            <Car className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-gray-900 text-lg">Sheggar Wheels</span>
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link href="/cars" className="hover:text-blue-600 transition-colors">Explore cars</Link>
          <Link href="/#how-it-works" className="hover:text-blue-600 transition-colors">How it works</Link>
          <Link href="/#become-a-host" className="hover:text-blue-600 transition-colors">Become a host</Link>
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/signin" className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors">
            Sign in
          </Link>
          <Link href="/signup" className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            Get started
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          className="md:hidden z-50 p-2 text-gray-600 hover:text-gray-900"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-lg py-4 px-6 flex flex-col gap-4 animate-in slide-in-from-top-2">
          <Link href="/cars" onClick={() => setIsOpen(false)} className="text-sm font-medium text-gray-900 hover:text-blue-600">Explore cars</Link>
          <Link href="/#how-it-works" onClick={() => setIsOpen(false)} className="text-sm font-medium text-gray-900 hover:text-blue-600">How it works</Link>
          <Link href="/#become-a-host" onClick={() => setIsOpen(false)} className="text-sm font-medium text-gray-900 hover:text-blue-600">Become a host</Link>
          <div className="h-px bg-gray-100 my-2"></div>
          <Link href="/signin" onClick={() => setIsOpen(false)} className="text-sm font-medium text-gray-900 hover:text-blue-600">Sign in</Link>
          <Link href="/signup" onClick={() => setIsOpen(false)} className="bg-blue-600 text-white text-center px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700">
            Get started
          </Link>
        </div>
      )}
    </nav>
  );
};