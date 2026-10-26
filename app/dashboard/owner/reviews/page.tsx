"use client";
import { useEffect, useState } from "react";
import { readStorage, writeStorage } from "@/lib/storage";
import { getSession } from "@/lib/auth";
import { Review } from "@/types";
import { Star, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function OwnerReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const loadReviews = () => {
    const user = getSession();
    if (user) {
      const allReviews = readStorage<Review[]>("sw_reviews_v1", []);
      setReviews(allReviews.filter(r => r.ownerId === user.id));
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleReplySubmit = (reviewId: string) => {
    if (!replyText.trim()) return;

    const allReviews = readStorage<Review[]>("sw_reviews_v1", []);
    const updated = allReviews.map(r => 
      r.id === reviewId ? { ...r, ownerReply: replyText } : r
    );
    
    writeStorage("sw_reviews_v1", updated);
    setReplyingTo(null);
    setReplyText("");
    loadReviews(); // Refresh list
  };

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
              <p className="font-semibold text-gray-900">{r.renterName} <span className="text-gray-400 font-normal">on Toyota</span></p>
              <div className="flex text-orange-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < r.rating ? "fill-current" : "text-gray-300"}`} />
                ))}
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">{r.comment}</p>
            
            {/* Display Owner Reply if exists */}
            {r.ownerReply && (
              <div className="bg-gray-50 p-4 rounded-lg mb-4 text-sm border-l-4 border-blue-500">
                <p className="font-semibold text-gray-900 mb-1">Your reply:</p>
                <p className="text-gray-600">{r.ownerReply}</p>
              </div>
            )}

            {/* Reply Form Logic */}
            {!r.ownerReply && replyingTo !== r.id && (
              <button 
                onClick={() => setReplyingTo(r.id)} 
                className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:underline"
              >
                <MessageSquare className="w-4 h-4" /> Reply
              </button>
            )}

            {replyingTo === r.id && (
              <div className="mt-4">
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write your reply..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 focus:ring-2 focus:ring-blue-500 outline-none"
                ></textarea>
                <div className="flex gap-2">
                  <Button onClick={() => handleReplySubmit(r.id)}>Send Reply</Button>
                  <Button variant="outline" onClick={() => setReplyingTo(null)}>Cancel</Button>
                </div>
              </div>
            )}
          </div>
        ))}
        {reviews.length === 0 && <p className="text-gray-500">No reviews yet.</p>}
      </div>
    </div>
  );
}