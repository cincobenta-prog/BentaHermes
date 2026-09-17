import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay, parseISO } from "date-fns";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateParam = searchParams.get("date");

  if (!dateParam) {
    return NextResponse.json({ error: "Date parameter is required" }, { status: 400 });
  }

  try {
    const date = parseISO(dateParam);
    const start = startOfDay(date);
    const end = endOfDay(date);

    const appointments = await prisma.appointment.findMany({
      where: {
        startTime: { gte: start },
        endTime: { lte: end },
      },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { guestName, companyName, guestEmail, startTime, endTime } = body;

    if (!guestName || !companyName || !guestEmail || !startTime || !endTime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check for double booking
    const existing = await prisma.appointment.findFirst({
      where: {
        OR: [
          {
            startTime: { lte: new Date(endTime) },
            endTime: { gte: new Date(startTime) },
          },
        ],
      },
    });

    if (existing) {
      return NextResponse.json({ error: "This time slot is already booked" }, { status: 409 });
    }

    const appointment = await prisma.appointment.create({
      data: {
        guestName,
        companyName,
        guestEmail,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
    });

    // MOCK EMAIL INTEGRATION
    // In production, you would use Resend or Nodemailer here:
    console.log(`[EMAIL SENT TO ${guestEmail}] Confirmation: Your appointment at 21 Rue de Turenne is confirmed for ${startTime}. Please add this to your calendar.`);
    console.log(`[EMAIL SENT TO concobenta@gmail.com] New Booking: ${guestName} from ${companyName} at ${startTime}.`);

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
