"use client";
import { useEffect, useState, KeyboardEvent } from "react";
import { readStorage, writeStorage } from "@/lib/storage";
import { getSession } from "@/lib/auth";
import { Booking, Car, User } from "@/types";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

// Extend the type to include car and renter names
type EnrichedBooking = Booking & {
  car?: Car;
  renterName: string;
};

export default function OwnerBookings() {
  const [bookings, setBookings] = useState<EnrichedBooking[]>([]);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const loadBookings = () => {
    const user = getSession();
    if (!user) return;

    const allBookings = readStorage<Booking[]>("sw_bookings_v1", []);
    const allCars = readStorage<Car[]>("sw_cars_v1", []);
    const allUsers = readStorage<User[]>("sw_users_v1", []);

    const myBookings = allBookings
      .filter(b => b.ownerId === user.id)
      .map(b => ({
        ...b,
        car: allCars.find(c => c.id === b.carId),
        renterName: allUsers.find(u => u.id === b.renterId)?.name || "Unknown Renter"
      }));

    setBookings(myBookings.reverse());
  };

  useEffect(() => { 
    loadBookings(); 
  }, []);

  // Ensure page resets if bookings are removed
  useEffect(() => {
    const totalPages = Math.ceil(bookings.length / itemsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [bookings, currentPage]);

  const handleAction = (id: string, newStatus: "confirmed" | "cancelled") => {
    const all = readStorage<Booking[]>("sw_bookings_v1", []);
    const updated = all.map(b => b.id === id ? { ...b, status: newStatus } : b);
    writeStorage("sw_bookings_v1", updated);
    loadBookings();
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
      } else {
        const currentIndex = actions.indexOf(document.activeElement as HTMLElement);
        if (currentIndex !== -1 && currentIndex < actions.length - 1) {
          actions[currentIndex + 1].focus();
        }
      }
    } 
    else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const currentIndex = actions.indexOf(document.activeElement as HTMLElement);
      if (currentIndex > 0) {
        actions[currentIndex - 1].focus();
      } else if (currentIndex === 0) {
        row.focus();
      }
    } 
  };
  // ---------------------------------

  // --- PAGINATION CALCULATIONS ---
  const totalPages = Math.ceil(bookings.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = bookings.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Booking requests</h1>
      
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Renter</th>
                <th className="px-6 py-4">Vehicle</th>
                <th className="px-6 py-4">Dates</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    No booking requests found.
                  </td>
                </tr>
              ) : (
                currentBookings.map(b => (
                  <tr 
                    key={b.id} 
                    tabIndex={0}
                    onKeyDown={handleRowKeyDown}
                    className="hover:bg-gray-50 focus:bg-blue-50 focus:outline-none transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">{b.renterName}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {b.car ? `${b.car.make} ${b.car.model}` : "Unknown Car"}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {formatDate(b.startDate)} - {formatDate(b.endDate)}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">ETB {b.total.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize border ${
                        b.status === "requested" ? "bg-orange-50 text-orange-700 border-orange-100" :
                        b.status === "confirmed" ? "bg-blue-50 text-blue-700 border-blue-100" :
                        b.status === "completed" ? "bg-green-50 text-green-700 border-green-100" : 
                        "bg-gray-100 text-gray-600 border-gray-200"
                      }`}>
                        ● {b.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {b.status === "requested" ? (
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => handleAction(b.id, "confirmed")} 
                            className="py-1.5 px-3 text-xs focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          >
                            Approve
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => handleAction(b.id, "cancelled")} 
                            className="py-1.5 px-3 text-xs focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                          >
                            Decline
                          </Button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">No action</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {bookings.length > 0 && (
          <div className="p-4 border-t border-gray-200 flex items-center justify-between bg-white">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
              <span className="font-medium">
                {indexOfLastItem > bookings.length ? bookings.length : indexOfLastItem}
              </span>{" "}
              of <span className="font-medium">{bookings.length}</span> requests
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