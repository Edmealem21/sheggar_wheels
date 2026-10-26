"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { readStorage } from "@/lib/storage";
import { Booking, Car } from "@/types";
import { ArrowLeft, MapPin, Calendar, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function BookingDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [car, setCar] = useState<Car | null>(null);

  useEffect(() => {
    const bookings = readStorage<Booking[]>("sw_bookings_v1", []);
    const foundBooking = bookings.find(b => b.id === id);
    
    if (foundBooking) {
      setBooking(foundBooking);
      const cars = readStorage<Car[]>("sw_cars_v1", []);
      const foundCar = cars.find(c => c.id === foundBooking.carId);
      if (foundCar) setCar(foundCar);
    }
  }, [id]);

  if (!booking) return <div className="p-10 text-center text-gray-500">Booking not found.</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to bookings
      </button>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Booking Summary</h1>
          <p className="text-gray-500">Reference: {booking.id}</p>
        </div>
        <span className={`px-3 py-1 text-sm font-semibold rounded-full capitalize ${
          booking.status === "confirmed" ? "bg-blue-100 text-blue-700" :
          booking.status === "completed" ? "bg-green-100 text-green-700" :
          booking.status === "cancelled" ? "bg-gray-100 text-gray-600" : "bg-orange-100 text-orange-700"
        }`}>
          ● {booking.status.replace("_", " ")}
        </span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        {/* Car Header */}
        <div className="p-6 border-b border-gray-200 flex items-center gap-4">
          {car && (
            <>
              <img src={car.photos[0]} alt={car.model} className="w-20 h-20 rounded-lg object-cover" />
              <div>
                <h2 className="font-bold text-xl text-gray-900">{car.make} {car.model} {car.year}</h2>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5" /> {car.neighbourhood}, {car.city}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Details */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Pick-up Date</p>
              <p className="font-medium text-gray-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" /> {booking.startDate}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Drop-off Date</p>
              <p className="font-medium text-gray-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" /> {booking.endDate}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h3 className="font-bold text-gray-900 mb-4">Payment Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Method</span>
                <span className="font-medium flex items-center gap-1"><CreditCard className="w-4 h-4" /> Mock TeleBirr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="font-medium text-green-600">Paid / Held (Demo)</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-100">
                <span>Total</span>
                <span>ETB {booking.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {booking.status === "confirmed" && (
        <div className="flex gap-4">
          <Button className="w-full py-3" variant="outline">Cancel Booking</Button>
          <Link href={`/dashboard/renter/bookings/${booking.id}/track`} className="w-full">
            <Button className="w-full py-3">Track Trip</Button>
          </Link>
        </div>
      )}
    </div>
  );
}