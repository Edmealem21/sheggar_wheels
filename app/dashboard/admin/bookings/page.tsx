"use client";
import { useEffect, useState, KeyboardEvent, useRef } from "react";
import { readStorage } from "@/lib/storage";
import { Booking, User } from "@/types";
import { formatDate } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

type EnrichedBooking = Booking & {
  renterName: string;
  ownerName: string;
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState<EnrichedBooking[]>([]);
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  const tableRef = useRef<HTMLTableSectionElement>(null);

  useEffect(() => {
    const allBookings = readStorage<Booking[]>("sw_bookings_v1", []);
    const allUsers = readStorage<User[]>("sw_users_v1", []);

    // Merge renter and owner names into the booking data
    const enriched = allBookings.map(b => ({
      ...b,
      renterName: allUsers.find(u => u.id === b.renterId)?.name || "Unknown Renter",
      ownerName: allUsers.find(u => u.id === b.ownerId)?.name || "Unknown Owner",
    }));

    // Sort by newest first
    setBookings(enriched.reverse());
  }, []);

  const handleFilterChange = (f: string) => {
    setFilter(f);
    setCurrentPage(1); // Reset to page 1 when filter changes
  };

  // 1. Filter the data
  const filtered = filter === "All" ? bookings : bookings.filter(b => b.status === filter.toLowerCase());

  // 2. Pagination Logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);

  // --- KEYBOARD NAVIGATION LOGIC ---
  const handleRowKeyDown = (e: KeyboardEvent<HTMLTableRowElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextRow = e.currentTarget.nextElementSibling as HTMLElement;
      if (nextRow) nextRow.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevRow = e.currentTarget.previousElementSibling as HTMLElement;
      if (prevRow) prevRow.focus();
    }
  };
  // ---------------------------------

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Bookings</h1>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        
        {/* Filters */}
        <div className="p-4 border-b border-gray-200 flex gap-2 overflow-x-auto">
          {["All", "Requested", "Confirmed", "Completed", "Disputed"].map(f => (
            <button 
              key={f}
              onClick={() => handleFilterChange(f)}
              className={`text-sm font-medium px-4 py-2 rounded-lg whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                filter === f 
                  ? "bg-blue-50 text-blue-600 border border-blue-100" 
                  : "text-gray-500 hover:bg-gray-50 border border-transparent"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Reference</th>
                <th className="px-6 py-4">Renter</th>
                <th className="px-6 py-4">Owner</th>
                <th className="px-6 py-4">Dates</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody ref={tableRef} className="divide-y divide-gray-100">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    No bookings found for this filter.
                  </td>
                </tr>
              ) : (
                currentItems.map(b => (
                  <tr 
                    key={b.id} 
                    tabIndex={0}
                    onKeyDown={handleRowKeyDown}
                    className="hover:bg-gray-50 focus:bg-blue-50 focus:outline-none transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{b.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{b.renterName}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{b.ownerName}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(b.startDate)} - {formatDate(b.endDate)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">ETB {b.total.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize border ${
                        b.status === "requested" ? "bg-orange-50 text-orange-700 border-orange-100" :
                        b.status === "confirmed" ? "bg-blue-50 text-blue-700 border-blue-100" :
                        b.status === "completed" ? "bg-green-50 text-green-700 border-green-100" : 
                        b.status === "disputed" ? "bg-red-50 text-red-700 border-red-100" : 
                        "bg-gray-100 text-gray-600 border-gray-200"
                      }`}>
                        ● {b.status.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-between bg-white">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium">{filtered.length === 0 ? 0 : indexOfFirstItem + 1}</span> to{" "}
            <span className="font-medium">
              {indexOfLastItem > filtered.length ? filtered.length : indexOfLastItem}
            </span>{" "}
            of <span className="font-medium">{filtered.length}</span> results
          </p>
          
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            
            {/* Page Numbers */}
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
      </div>
    </div>
  );
}