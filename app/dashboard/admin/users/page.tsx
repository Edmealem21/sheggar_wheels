"use client";
import { useEffect, useState, KeyboardEvent } from "react";
import { readStorage, writeStorage } from "@/lib/storage";
import { User } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  // --- KEYBOARD NAVIGATION LOGIC ---
  const handleRowKeyDown = (e: KeyboardEvent<HTMLTableRowElement>) => {
    const row = e.currentTarget;
    const actions = Array.from(row.querySelectorAll("button")) as HTMLElement[];

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextRow = row.nextElementSibling as HTMLElement;
      if (nextRow) nextRow.focus();
    } 
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevRow = row.previousElementSibling as HTMLElement;
      if (prevRow) prevRow.focus();
    } 
    else if (e.key === "ArrowRight") {
      e.preventDefault();
      if (document.activeElement === row && actions.length > 0) {
        actions[0].focus();
      }
    } 
    else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const currentIndex = actions.indexOf(document.activeElement as HTMLElement);
      if (currentIndex >= 0) {
        row.focus();
      }
    } 
  };
  // ---------------------------------

  // --- PAGINATION CALCULATIONS ---
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Users</h1>
        <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded">DEMO DATA</span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
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
              {currentUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                currentUsers.map(u => (
                  <tr 
                    key={u.id} 
                    tabIndex={0}
                    onKeyDown={handleRowKeyDown}
                    className="hover:bg-gray-50 focus:bg-blue-50 focus:outline-none transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">{u.name}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{u.email}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm capitalize">{u.roles.join(", ")}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${
                        u.status === "Active" 
                          ? "bg-green-50 text-green-700 border-green-100" 
                          : "bg-red-50 text-red-700 border-red-100"
                      }`}>
                        ● {u.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => toggleStatus(u.id, u.status)}
                        className={`text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 py-0.5 transition-colors ${
                          u.status === "Active" ? "text-red-600 hover:text-red-700" : "text-blue-600 hover:text-blue-700"
                        }`}
                      >
                        {u.status === "Active" ? "Suspend" : "Reinstate"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {users.length > 0 && (
          <div className="p-4 border-t border-gray-200 flex items-center justify-between bg-white">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
              <span className="font-medium">
                {indexOfLastItem > users.length ? users.length : indexOfLastItem}
              </span>{" "}
              of <span className="font-medium">{users.length}</span> users
            </p>
            
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      currentPage === page 
                        ? "bg-blue-600 text-white" 
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}