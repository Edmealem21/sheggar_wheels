"use client";
import { useEffect, useState } from "react";
import { readStorage, writeStorage } from "@/lib/storage";
import { getSession } from "@/lib/auth";
import { User } from "@/types";

export default function RenterProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (session) {
      setUser(session);
      setFormData({ name: session.name, email: session.email, phone: session.phone || "" });
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Update user in localStorage
    const allUsers = readStorage<User[]>("sw_users_v1", []);
    const updatedUsers = allUsers.map(u => 
      u.id === user.id ? { ...u, name: formData.name, email: formData.email, phone: formData.phone } : u
    );
    
    writeStorage("sw_users_v1", updatedUsers);
    
    // Show success message
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  if (!user) return null;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile</h1>
      
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm max-w-2xl">
        <form onSubmit={handleSave} className="p-6 space-y-5">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
            <input 
              type="tel" 
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+251 911 000 000"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
            />
          </div>

          <div className="pt-2 flex items-center gap-4">
            <button 
              type="submit" 
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Save changes
            </button>
            
            {isSaved && (
              <span className="text-sm text-green-600 font-medium animate-pulse">
                ✓ Profile updated successfully
              </span>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}