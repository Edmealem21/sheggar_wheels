"use client";
import { Button } from "@/components/ui/Button";

export default function OwnerDisputes() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Disputes</h1>
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="font-bold text-lg text-gray-900">Booking SW-24801 • Toyota RAV4</h2>
            <p className="text-sm text-gray-500">Raised by Liya Mulat on 12 Oct 2026</p>
          </div>
          <span className="bg-red-50 text-red-700 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
            ● Disputed
          </span>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <p className="text-sm text-gray-700 font-medium mb-1">Reason: Fuel level on return did not match the agreed level.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Your response</label>
          <textarea rows={4} placeholder="Add details..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4 focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
          <Button>Send response</Button>
        </div>
      </div>
    </div>
  );
}