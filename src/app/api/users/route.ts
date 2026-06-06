import { NextResponse } from "next/server";
import { APP_MESSAGES } from "@/constants/messages";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        active: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ users });
  } catch {
    return NextResponse.json(
      { error: APP_MESSAGES.users.loadError },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      username?: string;
      password?: string;
      email?: string;
      role?: string;
    };
    const name = body.name?.trim();
    const username = body.username?.trim().toLowerCase();
    const password = body.password ?? "";
    const email = body.email?.trim().toLowerCase() || null;
    const role = body.role?.trim().toUpperCase() || "OPERADOR";

    if (!name || !username || !password) {
      return NextResponse.json(
        { error: APP_MESSAGES.users.requiredFields },
        { status: 400 },
      );
    }

    const user = await prisma.user.create({
      data: {
        name,
        username,
        passwordHash: hashPassword(password),
        email,
        role,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        active: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";

    if (message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: APP_MESSAGES.users.duplicatedUser },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: APP_MESSAGES.users.createError },
      { status: 500 },
    );
  }
}
