"use client";
import { Star, MessageSquare } from "lucide-react";

export default function OwnerReviews() {
  const reviews = [
    { id: 1, renter: "Meron A.", car: "Toyota Corolla", rating: 5, text: "Spotless car and smooth pickup in Bole." },
    { id: 2, renter: "Samuel T.", car: "Toyota RAV4", rating: 4, text: "Great ride, slightly late handover." },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
        <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded">SAMPLE REVIEWS</span>
      </div>
      
      <div className="space-y-4">
        {reviews.map(r => (
          <div key={r.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <p className="font-semibold text-gray-900">{r.renter} <span className="text-gray-400 font-normal">on {r.car}</span></p>
              <div className="flex text-orange-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < r.rating ? "fill-current" : "text-gray-300"}`} />
                ))}
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">{r.text}</p>
            <button className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:underline">
              <MessageSquare className="w-4 h-4" /> Reply
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}