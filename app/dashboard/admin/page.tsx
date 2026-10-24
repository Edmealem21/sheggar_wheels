"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Users, Car, CalendarCheck, CreditCard } from "lucide-react";

const lineData = [
  { name: "May", bookings: 20 }, { name: "Jun", bookings: 35 }, 
  { name: "Jul", bookings: 30 }, { name: "Aug", bookings: 45 },
  { name: "Sep", bookings: 55 }, { name: "Oct", bookings: 60 },
];

const barData = [
  { name: "requested", count: 4 }, { name: "confirmed", count: 2 },
  { name: "in progress", count: 1 }, { name: "completed", count: 2 },
  { name: "cancelled", count: 1 }, { name: "disputes", count: 1 },
];

export default function AdminOverview() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Platform overview</h1>
        <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded">DEMO DATA</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total users", value: "7", icon: Users },
          { label: "Active users", value: "6", icon: Users },
          { label: "Approved listings", value: "5", icon: Car },
          { label: "Pending listings", value: "1", icon: CalendarCheck },
          { label: "Total bookings", value: "8", icon: CalendarCheck },
          { label: "Mock commission", value: "ETB 14,240", icon: CreditCard, sub: "8% of demo bookings" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-500 text-sm font-medium">{stat.label}</span>
              <stat.icon className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            {stat.sub && <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">Monthly booking volume</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip />
                <Line type="monotone" dataKey="bookings" stroke="#2563eb" strokeWidth={2} dot={{r: 4}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">Bookings by status</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ left: 30 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip />
                <Bar dataKey="count" fill="#1e293b" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}