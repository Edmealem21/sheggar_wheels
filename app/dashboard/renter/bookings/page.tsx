"use client";
import { useEffect, useState, KeyboardEvent } from "react";
import { readStorage, writeStorage } from "@/lib/storage";
import { getSession } from "@/lib/auth";
import { Booking, Car } from "@/types";
import Link from "next/link";
import { MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

type EnrichedBooking = Booking & { car?: Car };

export default function RenterBookings() {
  const [bookings, setBookings] = useState<EnrichedBooking[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const loadBookings = () => {
    const user = getSession();
    if (user) {
      const allBookings = readStorage<Booking[]>("sw_bookings_v1", []);
      const allCars = readStorage<Car[]>("sw_cars_v1", []);
      
      const myBookings = allBookings
        .filter(b => b.renterId === user.id)
        .map(b => ({ ...b, car: allCars.find(c => c.id === b.carId) }));

      setBookings(myBookings.reverse());
    }
    setLoading(false);
  };

  useEffect(() => {
    loadBookings();
  }, []);

  // Ensure current page doesn't become invalid if a booking is cancelled
  useEffect(() => {
    const totalPages = Math.ceil(bookings.length / itemsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [bookings, currentPage]);

  const handleCancel = (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    const allBookings = readStorage<Booking[]>("sw_bookings_v1", []);
    const updated = allBookings.map(b => 
      b.id === bookingId ? { ...b, status: "cancelled" as const } : b
    );
    
    writeStorage("sw_bookings_v1", updated);
    loadBookings();
  };

  // --- KEYBOARD NAVIGATION LOGIC ---
  const handleRowKeyDown = (e: KeyboardEvent<HTMLTableRowElement>) => {
    const row = e.currentTarget;
    const actions = Array.from(row.querySelectorAll("a, button")) as HTMLElement[];

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
    else if (e.key === "Enter") {
      if (document.activeElement === row && actions.length > 0) {
        e.preventDefault();
        actions[0].click();
      }
    }
  };
  // ---------------------------------

  if (loading) return <div className="p-10 text-center text-gray-500">Loading bookings...</div>;

  // --- PAGINATION CALCULATIONS ---
  const totalPages = Math.ceil(bookings.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = bookings.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My bookings</h1>
      
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        {bookings.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 mb-4">You have no bookings yet.</p>
            <Link href="/cars" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700">
              Explore cars
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-semibold border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4">Vehicle</th>
                    <th className="px-6 py-4">Reference</th>
                    <th className="px-6 py-4">Dates</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentBookings.map(b => (
                    <tr 
                      key={b.id} 
                      tabIndex={0}
                      onKeyDown={handleRowKeyDown}
                      className="hover:bg-gray-50 focus:bg-blue-50 focus:outline-none transition-colors group"
                    >
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-12 h-10 rounded bg-gray-200 overflow-hidden flex-shrink-0">
                          {b.car && <img src={b.car.photos[0]} alt={b.car.model} className="w-full h-full object-cover" />}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {b.car ? `${b.car.make} ${b.car.model}` : "Unknown Car"}
                          </p>
                          {b.car && (
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {b.car.neighbourhood}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-700">{b.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(b.startDate)} - {formatDate(b.endDate)}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">ETB {b.total.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize border ${
                          b.status === "confirmed" ? "bg-blue-50 text-blue-700 border-blue-100" :
                          b.status === "completed" ? "bg-green-50 text-green-700 border-green-100" :
                          b.status === "cancelled" ? "bg-gray-100 text-gray-600 border-gray-200" : 
                          "bg-orange-50 text-orange-700 border-orange-100"
                        }`}>
                          ● {b.status.replace("_", " ")}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 text-sm flex items-center gap-3">
                        <Link href={`/dashboard/renter/bookings/${b.id}`} className="text-blue-600 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1">
                          View
                        </Link>

                        {b.status === "requested" && (
                          <button onClick={() => handleCancel(b.id)} className="text-red-500 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-1">
                            Cancel
                          </button>
                        )}

                        {b.status === "confirmed" && (
                          <>
                            <Link href={`/dashboard/renter/bookings/${b.id}/track`} className="text-blue-600 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1">
                              Track
                            </Link>
                            <button onClick={() => handleCancel(b.id)} className="text-red-500 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-1">
                              Cancel
                            </button>
                          </>
                        )}

                        {b.status === "completed" && (
                          <Link href={`/dashboard/renter/bookings/${b.id}/review`} className="text-orange-500 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-orange-500 rounded px-1">
                            Leave Review
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-4 border-t border-gray-200 flex items-center justify-between bg-white">
              <p className="text-sm text-gray-500">
                Showing <span className="font-medium">{bookings.length === 0 ? 0 : indexOfFirstItem + 1}</span> to{" "}
                <span className="font-medium">
                  {indexOfLastItem > bookings.length ? bookings.length : indexOfLastItem}
                </span>{" "}
                of <span className="font-medium">{bookings.length}</span> bookings
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
          </>
        )}
      </div>
    </div>
  );
}