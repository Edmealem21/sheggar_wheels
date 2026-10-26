"use client";
import { useEffect, useState } from "react";
import { readStorage, writeStorage } from "@/lib/storage";
import { getSession } from "@/lib/auth";
import { Booking, Car } from "@/types";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { formatDate } from "@/lib/utils"; // Ensure this is imported

type EnrichedBooking = Booking & { car?: Car };

export default function RenterBookings() {
  const [bookings, setBookings] = useState<EnrichedBooking[]>([]);
  const [loading, setLoading] = useState(true);

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

  // ADD THIS FUNCTION TO HANDLE CANCELLATION
  const handleCancel = (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    const allBookings = readStorage<Booking[]>("sw_bookings_v1", []);
    const updated = allBookings.map(b => 
      b.id === bookingId ? { ...b, status: "cancelled" as const } : b
    );
    
    writeStorage("sw_bookings_v1", updated);
    loadBookings(); // Reload the list
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading bookings...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My bookings</h1>
      
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {bookings.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 mb-4">You have no bookings yet.</p>
            <Link href="/cars" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700">
              Explore cars
            </Link>
          </div>
        ) : (
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
              {bookings.map(b => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-12 h-10 rounded bg-gray-200 overflow-hidden flex-shrink-0">
                      {b.car && <img src={b.car.photos[0]} className="w-full h-full object-cover" />}
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
                  
                  {/* DYNAMIC ACTIONS COLUMN */}
                  <td className="px-6 py-4 text-sm flex items-center gap-3">
                    <Link href={`/dashboard/renter/bookings/${b.id}`} className="text-blue-600 font-medium hover:underline">
                      View
                    </Link>

                    {b.status === "requested" && (
                      <button onClick={() => handleCancel(b.id)} className="text-red-500 font-medium hover:underline">
                        Cancel
                      </button>
                    )}

                    {b.status === "confirmed" && (
                      <>
                        <Link href={`/dashboard/renter/bookings/${b.id}/track`} className="text-blue-600 font-medium hover:underline">
                          Track
                        </Link>
                        <button onClick={() => handleCancel(b.id)} className="text-red-500 font-medium hover:underline">
                          Cancel
                        </button>
                      </>
                    )}

                    {b.status === "completed" && (
                      <Link href={`/dashboard/renter/bookings/${b.id}/review`} className="text-orange-500 font-medium hover:underline">
                        Leave Review
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
}