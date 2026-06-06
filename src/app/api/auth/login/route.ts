import { NextResponse } from "next/server";
import { AUTH_USER } from "@/constants/auth";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    username?: string;
    password?: string;
  };
  const username = body.username?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";

  if (username === AUTH_USER.username && password === AUTH_USER.password) {
    return NextResponse.json({
      user: {
        name: AUTH_USER.name,
        username: AUTH_USER.username,
        role: AUTH_USER.role,
      },
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user || !user.active || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ error: "Usuario o contrasena invalida." }, { status: 401 });
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
      { error: "No se pudo validar contra la base de datos. generic/generic sigue disponible." },
      { status: 500 },
    );
  }
}
