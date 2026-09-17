"use client";

import React, { useState, useEffect } from "react";
import { format, addMinutes, startOfDay, setHours, setMinutes, isSameDay, parseISO } from "date-fns";
import { Clock, MapPin, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

const OPERATING_HOURS = { start: 9, end: 17 };
const PFW_DATES = [
  new Date(2027, 0, 19),
  new Date(2027, 0, 20),
  new Date(2027, 0, 21),
  new Date(2027, 0, 22),
  new Date(2027, 0, 23),
  new Date(2027, 0, 24),
  new Date(2027, 0, 25),
];

export default function AppointmentCalendar() {
  const [selectedDate, setSelectedDate] = useState(PFW_DATES[0]);
  const [selectedDuration, setSelectedDuration] = useState(30);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<{ start: Date; end: Date } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", company: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchSlots();
  }, [selectedDate]);

  async function fetchSlots() {
    setLoading(true);
    try {
      const response = await fetch(\`/api/appointments?date=\${selectedDate.toISOString()}\`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setBookedSlots(data.map(s => ({
          start: new Date(s.startTime),
          end: new Date(s.endTime)
        })));
      }
    } catch (error) {
      console.error("Failed to fetch slots:", error);
    } finally {
      setLoading(false);
    }
  }

  const generateSlots = () => {
    const slots = [];
    let current = setMinutes(setHours(startOfDay(selectedDate), OPERATING_HOURS.start), 0);
    const endOfDay = setHours(startOfDay(selectedDate), OPERATING_HOURS.end);

    while (current < endOfDay) {
      const slotEnd = addMinutes(current, 30);
      slots.push({ start: current, end: slotEnd });
      current = slotEnd;
    }
    return slots;
  };

  const isSlotBooked = (start: Date, end: Date) => {
    return bookedSlots.some(slot => (start < slot.end && end > slot.start));
  };

  const isBlockedByConsecutiveRule = (start: Date, end: Date) => {
    const checkWindow = (offset: number) => {
      const windowStart = addMinutes(start, offset * 30);
      const windowEnd = addMinutes(windowStart, 30);
      return isSlotBooked(windowStart, windowEnd);
    };
    if (checkWindow(-1) && checkWindow(-2)) return true;
    if (checkWindow(-1) && checkWindow(1)) return true;
    if (checkWindow(1) && checkWindow(2)) return true;
    return false;
  };

  const handleSlotClick = (start: Date) => {
    const end = addMinutes(start, selectedDuration);
    if (isSlotBooked(start, end)) return;
    if (isBlockedByConsecutiveRule(start, end)) {
      alert("This slot is blocked to prevent excessive consecutive appointments.");
      return;
    }
    setBooking({ start, end });
    setShowForm(true);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName: formData.name,
          companyName: formData.company,
          guestEmail: formData.email,
          startTime: booking?.start!.toISOString(),
          endTime: booking?.end!.toISOString(),
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Booking failed");
      }

      alert("Appointment scheduled successfully! A confirmation email has been sent to your inbox.");
      setShowForm(false);
      setFormData({ name: "", company: "", email: "" });
      setBooking(null);
      await fetchSlots();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const slots = generateSlots();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 relative">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tighter">Schedule Appointment</h2>
        <p className="text-neutral-500 flex items-center justify-center gap-2">
          <MapPin size={16} /> 21 Rue de Turenne, Paris
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between bg-neutral-100 dark:bg-neutral-800 p-2 rounded-lg">
            <button onClick={() => {
              const idx = PFW_DATES.findIndex(d => isSameDay(d, selectedDate));
              if (idx > 0) setSelectedDate(PFW_DATES[idx - 1]);
            }} className="p-2 hover:bg-white dark:hover:bg-neutral-700 rounded-md transition-colors">
              <ChevronLeft size={20} />
            </button>
            <span className="font-medium">{format(selectedDate, "EEEE, MMM do")}</span>
            <button onClick={() => {
              const idx = PFW_DATES.findIndex(d => isSameDay(d, selectedDate));
              if (idx < PFW_DATES.length - 1) setSelectedDate(PFW_DATES[idx + 1]);
            }} className="p-2 hover:bg-white dark:hover:bg-neutral-700 rounded-md transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-black dark:hover:border-white transition-colors"
                 onClick={() => setSelectedDuration(30)}>
              <div className={cn("w-4 h-4 rounded-full border", selectedDuration === 30 ? "bg-black dark:bg-white" : "")} />
              <span>30 Minutes</span>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-black dark:hover:border-white transition-colors"
                 onClick={() => setSelectedDuration(60)}>
              <div className={cn("w-4 h-4 rounded-full border", selectedDuration === 60 ? "bg-black dark:bg-white" : "")} />
              <span>1 Hour</span>
            </div>
          </div>
        </div>

        <div className="flex-[2] space-y-4">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 opacity-50">
              {[...Array(18)].map((_, i) => (
                <div key={i} className="p-3 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-md animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {slots.map((slot, i) => {
                const booked = isSlotBooked(slot.start, slot.end);
                const blocked = isBlockedByConsecutiveRule(slot.start, slot.end);
                const selected = booking && isSameDay(booking.start, slot.start) &&
                                   (booking.start.getHours() === slot.start.getHours() &&
                                    booking.start.getMinutes() === slot.start.getMinutes());

                return (
                  <button
                    key={i}
                    disabled={booked || blocked}
                    onClick={() => handleSlotClick(slot.start)}
                    className={cn(
                      "p-3 text-sm font-medium rounded-md border transition-all",
                      booked && "bg-neutral-100 text-neutral-400 cursor-not-allowed border-neutral-200",
                      blocked && "bg-neutral-50 text-neutral-300 cursor-not-allowed border-neutral-100",
                      !booked && !blocked && "hover:bg-black hover:text-white border-neutral-200 dark:border-neutral-700",
                      selected && "bg-black text-white border-black dark:bg-white dark:text-black"
                    )}
                  >
                    {format(slot.start, "p")}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-2xl max-w-md w-full space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold">Complete Booking</h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full">
                <X size={20} />
              </button>
            </div>
            <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center gap-3">
              <Clock size={18} />
              <span className="font-medium">
                {booking ? `${format(booking.start, "p")} - ${format(booking.end, "p")}` : "No slot selected"}
              </span>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Company Name</label>
                <input
                  required
                  type="text"
                  value={formData.company}
                  onChange={e => setFormData({...formData, company: e.target.value})}
                  className="w-full p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent"
                  placeholder="Luxury Brand LLC"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent"
                  placeholder="john@example.com"
                />
              </div>
              <button
                disabled={isSubmitting}
                type="submit"
                className="w-full py-4 bg-black text-white dark:bg-white dark:text-black rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isSubmitting ? "Scheduling..." : "Confirm Appointment"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
