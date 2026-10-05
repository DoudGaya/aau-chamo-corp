import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { clearSession, createSession, getPortalUser, verifyPassword } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().trim().email("Valid email is required").toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export async function GET() {
  try {
    const user = await getPortalUser();
    if (!user) {
      return NextResponse.json({ ok: false, user: null }, { status: 401 });
    }
    return NextResponse.json({ ok: true, user });
  } catch (error: any) {
    return NextResponse.json({ ok: false, message: error?.message || "Server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = loginSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, message: "Valid email and password are required" },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const user = await prisma.websiteUser.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { ok: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (user.status === "SUSPENDED") {
      return NextResponse.json(
        { ok: false, message: "Your account is temporarily suspended. Please contact customer care." },
        { status: 403 }
      );
    }

    const isValid = verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { ok: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    await prisma.websiteUser.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    await createSession(user.id);

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
    console.error("Login error:", error);
    return NextResponse.json(
      { ok: false, message: error?.message || "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await clearSession();
    return NextResponse.json({ ok: true, message: "Logged out successfully" });
  } catch (error: any) {
    return NextResponse.json({ ok: false, message: error?.message || "Server error" }, { status: 500 });
  }
}
