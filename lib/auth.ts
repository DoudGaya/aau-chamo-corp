import "server-only";

import crypto from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE_NAME = "aau_portal_session";
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [salt, key] = stored.split(":");
    if (!salt || !key) return false;
    const hash = crypto.scryptSync(password, salt, 64).toString("hex");
    return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(key, "hex"));
  } catch {
    return false;
  }
}

export async function createSession(userId: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await prisma.websiteUserSession.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return token;
}

export async function clearSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (token) {
    try {
      await prisma.websiteUserSession.deleteMany({ where: { token } });
    } catch {
      // ignore
    }
  }
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getPortalUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await prisma.websiteUserSession.findUnique({
    where: { token },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          companyName: true,
          accountType: true,
          selectedServices: true,
          address: true,
          city: true,
          country: true,
          status: true,
          createdAt: true,
        },
      },
    },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await prisma.websiteUserSession.delete({ where: { id: session.id } }).catch(() => {});
    }
    return null;
  }

  return session.user;
}
