"use client";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminReports() {
  const reports = [
    { title: "Bookings report", desc: "All demo bookings by status and month", icon: FileText },
    { title: "Commission report", desc: "Mock platform fees by owner", icon: FileText },
    { title: "Users report", desc: "Demo accounts by role and status", icon: FileText },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded">SAMPLE DATA</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reports.map((r, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                <r.icon className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-lg text-gray-900 mb-1">{r.title}</h2>
              <p className="text-sm text-gray-500 mb-6">{r.desc}</p>
            </div>
            <Button variant="outline" className="w-full flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> Export CSV
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}