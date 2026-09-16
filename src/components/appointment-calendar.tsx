"use client";

import React, { useState, useEffect } from "react";
import { format, addMinutes, isWithinInterval, startOfDay, setHours, setMinutes, isSameDay, parseISO } from "date-fns";
import { Calendar as CalendarIcon, Clock, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for booked slots
// In a real app, this would come from a database
const INITIAL_BOOKED_SLOTS = [
  { start: new Date(2027, 0, 20, 10, 0), end: new Date(2027, 0, 20, 10, 30) },
  { start: new Date(2027, 0, 20, 10, 30), end: new Date(2027, 0, 20, 11, 0) },
];

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
  const [selectedDuration, setSelectedDuration] = useState(30); // minutes
  const [bookedSlots, setBookedSlots] = useState(INITIAL_BOOKED_SLOTS);
  const [booking, setBooking] = useState<{ start: Date; end: Date } | null>(null);

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
    return bookedSlots.some(slot => isWithinInterval(slot.start, { start, end }) || isWithinInterval(start, { start: slot.start, end: slot.end }));
  };

  const isBlockedByConsecutiveRule = (start: Date, end: Date) => {
    // Rule: block if this appointment would create 3 consecutive slots booked.
    // 1 slot = 30 mins.
    // Check 2 slots before and 2 slots after.

    const checkWindow = (offset: number) => {
      const windowStart = addMinutes(start, offset * 30);
      const windowEnd = addMinutes(windowStart, 30);
      return isSlotBooked(windowStart, windowEnd);
    };

    // Scenario 1: [Booked] [Booked] [Current]
    if (checkWindow(-1) && checkWindow(-2)) return true;
    // Scenario 2: [Booked] [Current] [Booked]
    if (checkWindow(-1) && checkWindow(1)) return true;
    // Scenario 3: [Current] [Booked] [Booked]
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
  };

  const confirmBooking = () => {
    if (!booking) return;
    setBookedSlots([...bookedSlots, booking]);
    setBooking(null);
    alert("Appointment scheduled successfully!");
  };

  const slots = generateSlots();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tighter">Schedule Appointment</h2>
        <p className="text-neutral-500 flex items-center justify-center gap-2">
          <MapPin size={16} /> 21 Rue de Turenne, Paris
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Date Selection */}
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

        {/* Slots Grid */}
        <div className="flex-[2] space-y-4">
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
        </div>
      </div>

      {booking && (
        <div className="flex items-center justify-between p-4 bg-neutral-100 dark:bg-neutral-800 rounded-xl animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-3">
            <Clock size={20} />
            <span className="font-medium">
              {format(booking.start, "p")} - {format(booking.end, "p")} ({selectedDuration} min)
            </span>
          </div>
          <button
            onClick={confirmBooking}
            className="px-6 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg font-bold hover:opacity-90 transition-opacity"
          >
            Confirm Booking
          </button>
        </div>
      )}
    </div>
  );
}
