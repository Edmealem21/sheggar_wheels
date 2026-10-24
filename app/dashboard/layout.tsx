"use client";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { getSession } from "@/lib/auth";
import { User } from "@/types";
import { Bell } from "lucide-react";
import { seedData } from "@/lib/seed";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Ensure data exists
    seedData();
    
    // 2. Check session
    const session = getSession();
    
    if (!session) {
      // Force a hard redirect to sign-in
      window.location.href = "/signin";
    } else {
      setUser(session);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500 font-medium animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  if (!user) return null;

  const role = user.roles.includes("admin") ? "admin" : user.roles.includes("owner") ? "owner" : "renter";

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar role={role} />
      <div className="flex-1 ml-64 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
             <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded">DEMO DATA</span>
          </div>
          <div className="flex items-center gap-4">
            <Bell className="w-5 h-5 text-gray-400" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">
                {user.name.charAt(0)}
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-900 leading-tight">{user.name}</p>
                <p className="text-gray-500 text-xs capitalize">{role}</p>
              </div>
            </div>
          </div>
        </header>
        <main className="p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}