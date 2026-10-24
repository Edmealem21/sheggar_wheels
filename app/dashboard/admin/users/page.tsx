"use client";
import { useEffect, useState } from "react";
import { readStorage, writeStorage } from "@/lib/storage";
import { User } from "@/types";
import { Button } from "@/components/ui/Button";

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    setUsers(readStorage<User[]>("sw_users_v1", []));
  }, []);

  const toggleStatus = (id: string, currentStatus: string) => {
    const allUsers = readStorage<User[]>("sw_users_v1", []);
    const newStatus = currentStatus === "Active" ? "Suspended" : "Active";
    const updated = allUsers.map(u => u.id === id ? { ...u, status: newStatus as "Active" | "Suspended" } : u);
    writeStorage("sw_users_v1", updated);
    setUsers(updated);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Users</h1>
        <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded">DEMO DATA</span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-semibold border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{u.name}</td>
                <td className="px-6 py-4 text-gray-500 text-sm">{u.email}</td>
                <td className="px-6 py-4 text-gray-500 text-sm capitalize">{u.roles.join(", ")}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    u.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    ● {u.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => toggleStatus(u.id, u.status)}
                    className={`text-sm font-medium ${u.status === "Active" ? "text-red-600 hover:text-red-700" : "text-blue-600 hover:text-blue-700"}`}
                  >
                    {u.status === "Active" ? "Suspend" : "Reinstate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}