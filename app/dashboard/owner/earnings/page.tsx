"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/Button";
import { Download } from "lucide-react";

const chartData = [
  { name: "May", earnings: 18000 }, { name: "Jun", earnings: 22000 },
  { name: "Jul", earnings: 21000 }, { name: "Aug", earnings: 29000 },
  { name: "Sep", earnings: 32000 }, { name: "Oct", earnings: 42000 },
];

export default function OwnerEarnings() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Earnings</h1>
          <p className="text-gray-500 mt-1">Sample figures for demonstration.</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="font-bold text-lg text-gray-900">Monthly earnings</h2>
          <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded">SAMPLE EARNINGS</span>
        </div>
        <div className="h-80">
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

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-bold text-lg text-gray-900">Per-car summary</h2>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Vehicle</th>
              <th className="px-6 py-4">Rentals</th>
              <th className="px-6 py-4">Earnings (Demo)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 font-medium">Toyota Corolla</td>
              <td className="px-6 py-4 text-gray-500">14</td>
              <td className="px-6 py-4 font-medium text-gray-900">ETB 84,200</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 font-medium">Toyota RAV4</td>
              <td className="px-6 py-4 text-gray-500">9</td>
              <td className="px-6 py-4 font-medium text-gray-900">ETB 61,500</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}