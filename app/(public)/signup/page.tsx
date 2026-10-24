"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { readStorage, writeStorage } from "@/lib/storage";
import { User } from "@/types";
import Link from "next/link";
import { Car } from "lucide-react";

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email) {
      setError("Name and email are required.");
      return;
    }

    setLoading(true);

    try {
      const users = readStorage<User[]>("sw_users_v1", []);
      
      if (users.some(u => u.email.toLowerCase() === formData.email.toLowerCase())) {
        setError("Email already exists in demo data.");
        setLoading(false);
        return;
      }

      const newUser: User = {
        id: crypto.randomUUID(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        roles: ["renter"], // Default role for sign up
        status: "Active",
        createdAt: new Date().toISOString()
      };

      writeStorage("sw_users_v1", [...users, newUser]);
      sessionStorage.setItem("sw_session_v1", newUser.id);
      
      // Redirect to renter dashboard after successful signup
      router.push("/dashboard/renter");
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Panel - Image & Branding */}
      <div className="relative hidden lg:flex flex-col justify-between bg-slate-900 p-10 overflow-hidden">
        {/* Background Image */}
        <img 
          src="https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=2072&auto=format&fit=crop" 
          alt="Car driving on mountain road" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
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
          <h1 className="text-4xl font-bold text-white max-w-md leading-tight">
            Rent local. Drive Addis your way.
          </h1>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex items-center justify-center p-8 bg-[#f8f9fc]">
        <div className="w-full max-w-[420px]">
          
          <div className="mb-8">
            <h2 className="text-[32px] font-bold text-gray-900 mb-2 tracking-tight">Create your account</h2>
            <p className="text-gray-500 text-[15px]">Join as a renter. You can request to host later.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm border border-red-100">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
              <input 
                type="text" 
                placeholder="Meron Alemu" 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 text-[15px] placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input 
                type="email" 
                placeholder="you@example.com" 
                onChange={e => setFormData({...formData, email: e.target.value})} 
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 text-[15px] placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone number</label>
              <input 
                type="tel" 
                placeholder="+251 911 000 000" 
                onChange={e => setFormData({...formData, phone: e.target.value})} 
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 text-[15px] placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm" 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 mt-2"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-8 text-center text-[14px] text-gray-500">
            Already have an account? <Link href="/signin" className="text-blue-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}