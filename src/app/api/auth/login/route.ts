import { NextResponse } from "next/server";
import { APP_MESSAGES } from "@/constants/messages";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    username?: string;
    password?: string;
  };
  const username = body.username?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";

  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user || !user.active || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ error: APP_MESSAGES.auth.invalidCredentials }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        name: user.name,
        username: user.username,
        role: user.role,
      },
    });
  } catch {
    return NextResponse.json(
      { error: APP_MESSAGES.auth.databaseUnavailable },
      { status: 500 },
    );
  }
}
