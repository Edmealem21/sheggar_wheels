"use client";
import { useEffect, useState } from "react";
import { readStorage } from "@/lib/storage";
import { Booking, Car } from "@/types";
import { Car as CarIcon, CalendarCheck, Wallet, CheckCircle2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

const chartData = [
  { name: "May", earnings: 15000 }, { name: "Jun", earnings: 18000 },
  { name: "Jul", earnings: 12000 }, { name: "Aug", earnings: 25000 },
  { name: "Sep", earnings: 22000 }, { name: "Oct", earnings: 30000 },
];

export default function OwnerOverview() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cars, setCars] = useState<Car[]>([]);

  useEffect(() => {
    const allBookings = readStorage<Booking[]>("sw_bookings_v1", []);
    const allCars = readStorage<Car[]>("sw_cars_v1", []);
    setBookings(allBookings.filter(b => b.ownerId === "owner-1"));
    setCars(allCars.filter(c => c.ownerId === "owner-1"));
  }, []);

  const pendingRequests = bookings.filter(b => b.status === "requested").length;
  const totalEarnings = bookings.filter(b => ["completed", "confirmed"].includes(b.status)).reduce((sum, b) => sum + b.total, 0);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Owner overview</h1>
          <p className="text-gray-500 mt-1">Welcome back, Dawit.</p>
        </div>
        <Link href="/dashboard/owner/cars/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2">
          + Add car
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total cars", value: cars.length, icon: CarIcon },
          { label: "Approved cars", value: cars.filter(c => c.status === "approved").length, icon: CheckCircle2 },
          { label: "Pending requests", value: pendingRequests, icon: CalendarCheck },
          { label: "Total earnings", value: `ETB ${totalEarnings.toLocaleString()}`, icon: Wallet, sub: "Demo earnings" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500 text-sm font-medium">{stat.label}</span>
              <stat.icon className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            {stat.sub && <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-gray-900">Monthly earnings</h2>
            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded">SAMPLE EARNINGS</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip />
                <Bar dataKey="earnings" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">Vehicle utilization</h2>
          <div className="space-y-4 mt-6">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">Toyota Corolla</span>
                <span className="text-gray-500">78%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "78%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">Toyota RAV4</span>
                <span className="text-gray-500">54%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "54%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between">
          <h2 className="font-bold text-lg">Recent booking requests</h2>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-semibold">
            <tr>
              <th className="px-6 py-3">Renter</th>
              <th className="px-6 py-3">Vehicle</th>
              <th className="px-6 py-3">Dates</th>
              <th className="px-6 py-3">Total</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.map(b => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">Meron Alemu</td>
                <td className="px-6 py-4 text-gray-500">Toyota Corolla</td>
                <td className="px-6 py-4 text-gray-500">{b.startDate} - {b.endDate}</td>
                <td className="px-6 py-4 font-medium">ETB {b.total.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                    b.status === "requested" ? "bg-orange-100 text-orange-700" :
                    b.status === "confirmed" ? "bg-blue-100 text-blue-700" :
                    b.status === "completed" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                  }`}>
                    ● {b.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {b.status === "requested" && (
                    <div className="flex gap-2">
                      <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium">Approve</button>
                      <button className="border border-gray-300 text-gray-700 px-3 py-1 rounded text-xs font-medium">Decline</button>
                    </div>
                  )}
                  {b.status !== "requested" && <span className="text-gray-400 text-sm">No action</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}