import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getPortalUser } from "@/lib/auth";
import { notifyEnquiry } from "@/lib/email";

const requestSchema = z.object({
  type: z.string().min(1, "Service type is required"),
  department: z.string().default("Operations"),
  message: z.string().trim().min(5, "Message must be at least 5 characters"),
  details: z.record(z.string(), z.any()).default({}),
});

function generateRef() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "AAU-";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function GET() {
  try {
    const user = await getPortalUser();
    if (!user) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const enquiries = await prisma.websiteEnquiry.findMany({
      where: {
        OR: [
          { userId: user.id },
          { customerEmail: user.email },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        statusEvents: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    const serialized = enquiries.map((e) => ({
      id: e.id.toString(),
      reference: e.reference,
      type: e.type,
      message: e.message,
      status: e.status,
      department: e.department,
      details: e.details,
      createdAt: e.createdAt.toISOString(),
      updatedAt: e.updatedAt.toISOString(),
    }));

    return NextResponse.json({ ok: true, requests: serialized });
  } catch (error: any) {
    console.error("Portal requests fetch error:", error);
    return NextResponse.json({ ok: false, message: error?.message || "Server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getPortalUser();
    if (!user) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    const parsed = requestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, message: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { type, department, message, details } = parsed.data;
    const reference = generateRef();

    const enquiry = await prisma.websiteEnquiry.create({
      data: {
        reference,
        type,
        customerName: user.fullName,
        customerEmail: user.email,
        customerPhone: user.phone,
        message,
        details,
        status: "New",
        department,
        source: "portal",
        userId: user.id,
      },
    });

    await prisma.enquiryStatusEvent.create({
      data: {
        enquiryRef: reference,
        newStatus: "New",
        actor: `customer:${user.email}`,
        note: `Direct service request from client portal by ${user.fullName}`,
        isCustomerVisible: true,
      },
    });

    // Notify staff
    notifyEnquiry({
      reference,
      type,
      name: user.fullName,
      email: user.email,
      phone: user.phone,
      message,
      details: details as Record<string, string>,
      source: "portal",
      status: "New",
      createdAt: enquiry.createdAt.toISOString(),
      updatedAt: enquiry.updatedAt.toISOString(),
    }).catch((err) => console.error("Notification error:", err));

    return NextResponse.json({
      ok: true,
      request: {
        id: enquiry.id.toString(),
        reference: enquiry.reference,
        type: enquiry.type,
        status: enquiry.status,
        createdAt: enquiry.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Portal request creation error:", error);
    return NextResponse.json({ ok: false, message: error?.message || "Server error" }, { status: 500 });
  }
}
