"use client";

import React from "react";
import Link from "next/link";
import DancingLetters from "@/components/ui/dancing-letters";
import { ArrowRight, MapPin, Calendar } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image - The Door */}
        {/* Note: User provided image will be used here. Using a high-end minimalist door placeholder for now */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1513584684374-8bdb74838a7c?q=80&w=2070&auto=format&fit=crop"
            alt="Point LLC Door"
            className="w-full h-full object-cover opacity-80 grayscale contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-white dark:to-neutral-950" />
        </div>

        <div className="relative z-10 text-center px-4 space-y-8">
          <div className="flex justify-center">
            <DancingLetters text="POINT, LLC" className="text-neutral-900 dark:text-neutral-100" />
          </div>

          <div className="space-y-2 max-w-2xl mx-auto">
            <h1 className="text-xl md:text-2xl font-light tracking-widest uppercase">
              Paris Fashion Week 2027
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 font-medium">
              January 19 — January 25
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link
              href="/schedule"
              className="group flex items-center gap-2 px-8 py-4 bg-black text-white dark:bg-white dark:text-black rounded-full font-bold text-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              Book Appointment
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
          </div>
        </div>

        {/* Footer Info */}
        <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center gap-2 text-sm tracking-wide text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center gap-2">
            <MapPin size={14} /> 21 Rue de Turenne, Paris
          </div>
        </div>
      </section>

      {/* Awake NY Section - Imagery Gallery */}
      <section className="py-24 px-4 bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold tracking-tighter uppercase">The Collection</h2>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto">
              Exploring the intersection of urban energy and Parisian elegance.
              Featuring Awake NY.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-neutral-200 dark:bg-neutral-800 group">
              <img
                src="https://images.unsplash.com/photo-1552374196-1ab26e973748?q=80&w=1974&auto=format&fit=crop"
                alt="Awake NY Aesthetic 1"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale hover:grayscale-0"
              />
            </div>
            <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-neutral-200 dark:bg-neutral-800 group">
              <img
                src="https://images.unsplash.com/photo-1539109136881-3bbb8710947d?q=80&w=1974&auto=format&fit=crop"
                alt="Awake NY Aesthetic 2"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale hover:grayscale-0"
              />
            </div>
            <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-neutral-200 dark:bg-neutral-800 group">
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
                alt="Awake NY Aesthetic 3"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale hover:grayscale-0"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 text-center space-y-8 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <Calendar size={48} className="mx-auto text-neutral-300 dark:text-neutral-700" />
          <h2 className="text-5xl font-bold tracking-tighter">Limited Availability</h2>
          <p className="text-lg text-neutral-500 dark:text-neutral-400">
            Appointments are limited for the duration of Paris Fashion Week.
          </p>
          <Link
            href="/schedule"
            className="inline-block px-10 py-4 border-2 border-black dark:border-white rounded-full font-bold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
          >
            Reserve Your Slot
          </Link>
        </div>
      </section>

      <footer className="py-12 border-t border-neutral-200 dark:border-neutral-800 text-center text-sm text-neutral-400">
        <p>© 2027 Point, LLC. All rights reserved.</p>
      </footer>
    </div>
  );
}
