"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { readStorage, writeStorage } from "@/lib/storage";
import { getSession } from "@/lib/auth";
import { Car, Booking, User } from "@/types";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { Footer } from "@/components/layout/Footer";
import { CheckCircle2, Lock } from "lucide-react";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const carId = searchParams.get("carId");

  const [car, setCar] = useState<Car | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [startDate, setStartDate] = useState("2026-11-15");
  const [endDate, setEndDate] = useState("2026-11-18");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      // If not logged in, send to sign in, then back to checkout
      router.push(`/signin?next=/checkout?carId=${carId}`);
      return;
    }
    setUser(session);

    if (carId) {
      const cars = readStorage<Car[]>("sw_cars_v1", []);
      const found = cars.find(c => c.id === carId);
      if (found) setCar(found);
    }
  }, [carId, router]);

  if (!car || !user) return <div className="p-10 text-center text-gray-500">Loading checkout...</div>;

  // Calculate number of days
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

  const subtotal = car.pricePerDay * days;
  const fee = subtotal * 0.08; // 8% platform fee
  const total = subtotal + fee;

  const handlePayment = () => {
    setIsProcessing(true);
    
    // Simulate network delay for payment
    setTimeout(() => {
      const bookings = readStorage<Booking[]>("sw_bookings_v1", []);
      const newBooking: Booking = {
        id: `SW-${Math.floor(10000 + Math.random() * 90000)}`,
        carId: car.id,
        renterId: user.id,
        ownerId: car.ownerId,
        startDate: startDate,
        endDate: endDate,
        total: total,
        status: "requested",
        createdAt: new Date().toISOString()
      };
      
      writeStorage("sw_bookings_v1", [...bookings, newBooking]);
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <PublicNavbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-200 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking request sent</h2>
            <p className="text-gray-500 mb-8 text-sm">The owner will confirm shortly. You'll be notified in your dashboard.</p>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-8 text-left space-y-2 text-sm border border-gray-100">
              <div className="flex justify-between"><span className="text-gray-500">Vehicle</span><span className="font-medium">{car.make} {car.model}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Dates</span><span className="font-medium">{startDate} to {endDate}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Total (demo)</span><span className="font-medium">ETB {total.toLocaleString()}</span></div>
            </div>

            <div className="flex flex-col gap-3">
              <Link href="/dashboard/renter/bookings" className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700">View my bookings</Link>
              <Link href="/dashboard/renter" className="w-full border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50">Back to dashboard</Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PublicNavbar />
      <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
        <p className="text-gray-500 mb-8 text-sm">Review your booking and complete the mock payment.</p>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left: Summary */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="font-bold text-lg mb-4">Trip details</h2>
              <div className="flex gap-4 mb-6">
                <img src={car.photos[0]} alt={car.model} className="w-24 h-24 object-cover rounded-lg" />
                <div>
                  <h3 className="font-bold text-gray-900">{car.make} {car.model} {car.year}</h3>
                  <p className="text-sm text-gray-500 mt-1">{car.neighbourhood}, {car.city}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pickup date</label>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Return date</label>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="font-bold text-lg mb-4">Payment method</h2>
              <div className="border border-blue-500 bg-blue-50 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-[10px]">TELE</div>
                  <div>
                    <p className="font-medium text-gray-900">TeleBirr</p>
                    <p className="text-xs text-gray-500">Mock payment gateway</p>
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-24">
              <h2 className="font-bold text-lg mb-4">Price details</h2>
              <div className="space-y-3 text-sm mb-6 border-b border-gray-100 pb-6">
                <div className="flex justify-between">
                  <span className="text-gray-500">ETB {car.pricePerDay.toLocaleString()} x {days} days</span>
                  <span className="font-medium">ETB {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Platform fee (8%)</span>
                  <span className="font-medium">ETB {fee.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex justify-between font-bold text-lg mb-6">
                <span>Total</span>
                <span>ETB {total.toLocaleString()}</span>
              </div>

              <button 
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isProcessing ? "Processing..." : "Complete demo payment"}
              </button>
              
              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
                <Lock className="w-3 h-3" />
                <span>No real payment will be processed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}