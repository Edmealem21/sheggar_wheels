"use client";
import { Bell, CheckCircle2, Star } from "lucide-react";

export default function RenterNotifications() {
  const notifications = [
    { id: 1, title: "Booking confirmed", message: "Dawit confirmed your Hyundai Tucson for 8–11 Nov.", time: "2h ago", icon: CheckCircle2, color: "text-blue-600" },
    { id: 2, title: "Review reminder", message: "How was your Toyota Corolla trip? Leave a review.", time: "Yesterday", icon: Star, color: "text-orange-500" },
    { id: 3, title: "Price drop", message: "Suzuki Swift in CMC is now ETB 2,100 / day.", time: "3 days ago", icon: Bell, color: "text-gray-400" },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Notifications</h1>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
        {notifications.map(n => (
          <div key={n.id} className="p-6 flex items-start gap-4 hover:bg-gray-50">
            <div className={`p-2 rounded-full bg-gray-50 ${n.color}`}>
              <n.icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 text-sm">{n.title}</h4>
              <p className="text-gray-500 text-sm mt-1">{n.message}</p>
            </div>
            <span className="text-xs text-gray-400">{n.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}