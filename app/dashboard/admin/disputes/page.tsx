"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export default function AdminDisputes() {
  const [resolved, setResolved] = useState(false);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Disputes</h1>
      
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="font-bold text-lg text-gray-900">Booking SW-24801 • Toyota RAV4</h2>
            <p className="text-sm text-gray-500">Raised by Liya Mulat on 12 Oct 2026</p>
          </div>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${resolved ? "bg-green-100 text-green-700" : "bg-red-50 text-red-700"}`}>
            ● {resolved ? "Resolved" : "Disputed"}
          </span>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <p className="text-sm text-gray-700 font-medium mb-1">Reason: Fuel level on return did not match the agreed level.</p>
        </div>

        {!resolved ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Resolution notes</label>
            <textarea rows={4} placeholder="Add details..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4 focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
            <Button onClick={() => setResolved(true)}>Resolve dispute</Button>
          </div>
        ) : (
          <div className="bg-green-50 text-green-700 p-4 rounded-lg text-sm border border-green-200">
            This dispute has been successfully resolved. Note: "Owner and renter agreed to split the refueling cost."
          </div>
        )}
      </div>
    </div>
  );
}