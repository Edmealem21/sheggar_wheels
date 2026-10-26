"use client";
import { useState, FormEvent } from "react"; // <-- Added FormEvent here
import { useParams, useRouter } from "next/navigation";
import { readStorage, writeStorage } from "@/lib/storage";
import { getSession } from "@/lib/auth"; // <-- Added this import!
import { Button } from "@/components/ui/Button";
import { Star, ArrowLeft } from "lucide-react";
import { Booking, Review } from "@/types"; // <-- Removed 'Car' since it's not used here

export default function LeaveReview() {
  const { id } = useParams();
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // Changed React.FormEvent to just FormEvent
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const user = getSession();
    if (!user) return;

    const allBookings = readStorage<Booking[]>("sw_bookings_v1", []);
    const booking = allBookings.find(b => b.id === id);
    if (!booking) return;

    // 1. Create the new review
    const newReview: Review = {
      id: crypto.randomUUID(),
      bookingId: booking.id,
      carId: booking.carId,
      renterId: user.id,
      renterName: user.name,
      ownerId: booking.ownerId,
      rating: rating,
      comment: comment,
      ownerReply: null,
      createdAt: new Date().toISOString()
    };

    // 2. Save the review to localStorage
    const allReviews = readStorage<Review[]>("sw_reviews_v1", []);
    writeStorage("sw_reviews_v1", [...allReviews, newReview]);

    // 3. Update the booking status to "reviewed"
    const updatedBookings = allBookings.map(b => 
      b.id === id ? { ...b, status: "reviewed" as const } : b
    );
    writeStorage("sw_bookings_v1", updatedBookings);

    alert("Thank you! Your review has been submitted.");
    router.push("/dashboard/renter/bookings");
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Leave a review</h1>
        <p className="text-gray-500 mb-6 text-sm">How was your trip? (Booking {id})</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star className={`w-8 h-8 ${star <= rating ? "fill-orange-400 text-orange-400" : "text-gray-300"}`} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
            <textarea 
              rows={4} 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about the car and the owner..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            ></textarea>
          </div>

          <Button type="submit" className="w-full py-2.5">Submit Review</Button>
        </form>
      </div>
    </div>
  );
}