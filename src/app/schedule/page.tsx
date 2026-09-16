"use client";

import React from "react";
import AppointmentCalendar from "@/components/appointment-calendar";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SchedulePage() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-black dark:hover:text-white transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <AppointmentCalendar />
      </div>
    </div>
  );
}
