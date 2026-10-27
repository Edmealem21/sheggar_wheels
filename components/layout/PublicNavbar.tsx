"use client";
import { useState, useEffect, useRef, KeyboardEvent } from "react";
import Link from "next/link";
import { Car, Menu, X } from "lucide-react";

export const PublicNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleEscape = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  // --- KEYBOARD NAVIGATION LOGIC ---
  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    // We only care about arrow keys here. 
    // Enter natively works on <a> and <button> tags.
    if (!["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(e.key)) return;

    e.preventDefault(); // Stop page scrolling

    const nav = navRef.current;
    if (!nav) return;

    // Get all focusable elements inside the navbar
    const focusableElements = Array.from(
      nav.querySelectorAll("a[href], button:not([disabled])")
    ) as HTMLElement[];

    // Find the currently focused element
    const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);
    if (currentIndex === -1) return; // If focus is not in the navbar, do nothing

    let nextIndex = currentIndex;

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      nextIndex = currentIndex + 1;
      // Loop back to the first element
      if (nextIndex >= focusableElements.length) nextIndex = 0; 
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      nextIndex = currentIndex - 1;
      // Loop to the last element
      if (nextIndex < 0) nextIndex = focusableElements.length - 1; 
    }

    // Focus the next/previous element
    focusableElements[nextIndex].focus();
  };
  // ---------------------------------

  return (
    <nav 
      ref={navRef}
      onKeyDown={handleKeyDown}
      className="bg-white border-b border-gray-200 px-6 md:px-8 py-4 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 z-50 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1">
          <div className="bg-blue-600 p-1.5 rounded-md">
            <Car className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-gray-900 text-lg">Sheggar Wheels</span>
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link href="/cars" className="hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1">Explore cars</Link>
          <Link href="/#how-it-works" className="hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1">How it works</Link>
          <Link href="/#become-a-host" className="hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1">Become a host</Link>
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/signin" className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1">
            Sign in
          </Link>
          <Link href="/signup" className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Get started
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          className="md:hidden z-50 p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-lg py-4 px-6 flex flex-col gap-2 animate-in slide-in-from-top-2">
          <Link href="/cars" onClick={() => setIsOpen(false)} className="text-sm font-medium text-gray-900 hover:text-blue-600 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2">
            Explore cars
          </Link>
          <Link href="/#how-it-works" onClick={() => setIsOpen(false)} className="text-sm font-medium text-gray-900 hover:text-blue-600 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2">
            How it works
          </Link>
          <Link href="/#become-a-host" onClick={() => setIsOpen(false)} className="text-sm font-medium text-gray-900 hover:text-blue-600 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2">
            Become a host
          </Link>
          <div className="h-px bg-gray-100 my-2"></div>
          <Link href="/signin" onClick={() => setIsOpen(false)} className="text-sm font-medium text-gray-900 hover:text-blue-600 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2">
            Sign in
          </Link>
          <Link href="/signup" onClick={() => setIsOpen(false)} className="bg-blue-600 text-white text-center px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Get started
          </Link>
        </div>
      )}
    </nav>
  );
};