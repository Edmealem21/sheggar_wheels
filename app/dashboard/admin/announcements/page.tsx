"use client";
import { useEffect, useState } from "react";
import { readStorage, writeStorage } from "@/lib/storage";
import { Announcement } from "@/types";
import { Button } from "@/components/ui/Button";

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setAnnouncements(readStorage<Announcement[]>("sw_announcements_v1", []));
  }, []);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;
    
    const newAnnouncement: Announcement = {
      id: crypto.randomUUID(),
      title,
      message,
      active: true,
      createdAt: new Date().toISOString()
    };
    
    const updated = [newAnnouncement, ...announcements];
    writeStorage("sw_announcements_v1", updated);
    setAnnouncements(updated);
    setTitle("");
    setMessage("");
  };

  const toggleActive = (id: string) => {
    const updated = announcements.map(a => a.id === id ? { ...a, active: !a.active } : a);
    writeStorage("sw_announcements_v1", updated);
    setAnnouncements(updated);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Announcements</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="font-bold text-lg mb-4">Publish an announcement</h2>
          <form onSubmit={handlePublish} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input 
                type="text" 
                value={title} 
                onChange={e => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea 
                rows={4} 
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
              ></textarea>
            </div>
            <Button type="submit">Publish</Button>
          </form>
        </div>

        {/* List */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="font-bold text-lg mb-4">Current announcements</h2>
          <div className="space-y-3">
            {announcements.map(a => (
              <div key={a.id} className="border border-gray-100 rounded-lg p-4 flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-sm text-gray-900">{a.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">{a.message}</p>
                  <button 
                    onClick={() => toggleActive(a.id)}
                    className="text-red-600 text-xs font-medium mt-2 hover:underline"
                  >
                    {a.active ? "Deactivate" : "Activate"}
                  </button>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full flex items-center gap-1 ${
                  a.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                }`}>
                  ● {a.active ? "Active" : "Inactive"}
                </span>
              </div>
            ))}
            {announcements.length === 0 && <p className="text-sm text-gray-500">No announcements yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}