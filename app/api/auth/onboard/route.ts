import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSession, hashPassword } from "@/lib/auth";
import { notifyNewCustomerOnboarded } from "@/lib/email";

const onboardSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required"),
  email: z.string().trim().email("Valid email address is required").toLowerCase(),
  phone: z.string().trim().min(7, "Valid phone number is required"),
  companyName: z.string().trim().optional(),
  accountType: z.enum(["INDIVIDUAL", "CORPORATE", "AGENT"]).default("INDIVIDUAL"),
  selectedServices: z.array(z.string()).min(1, "Please select at least one service"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  address: z.string().trim().optional(),
  city: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = onboardSchema.safeParse(json);

    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return NextResponse.json(
        { ok: false, message: issue?.message || "Invalid input data" },
        { status: 400 }
      );
    }

    const { fullName, email, phone, companyName, accountType, selectedServices, password, address, city, notes } = parsed.data;

    // Check existing
    const existing = await prisma.websiteUser.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { ok: false, message: "An account with this email address already exists. Please log in instead." },
        { status: 409 }
      );
    }

    const passwordHash = hashPassword(password);

    const user = await prisma.websiteUser.create({
      data: {
        fullName,
        email,
        phone,
        companyName: companyName || null,
        accountType,
        selectedServices,
        passwordHash,
        address: address || null,
        city: city || null,
        notes: notes || null,
        status: "ACTIVE",
        lastLoginAt: new Date(),
      },
    });

    // Create session cookie
    await createSession(user.id);

    // Notify company and welcome customer in background
    notifyNewCustomerOnboarded({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      companyName: user.companyName,
      accountType: user.accountType,
      selectedServices,
      city: user.city,
      address: user.address,
    }).catch((err) => {
      console.error("Failed to send onboarding email:", err);
    });

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        companyName: user.companyName,
        accountType: user.accountType,
        selectedServices: user.selectedServices,
      },
    });
  } catch (error: any) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      { ok: false, message: error?.message || "Internal server error occurred during onboarding" },
      { status: 500 }
    );
  }
}
