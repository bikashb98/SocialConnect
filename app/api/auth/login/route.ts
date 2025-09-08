import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";
import { PrismaClient } from "../../../../lib/generated/prisma";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const {
    data: { user, session },
    error,
  } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !user) {
    return NextResponse.json(
      { error: error?.message || "Invalid credentials" },
      { status: 401 },
    );
  }

  const existingUserUser = await prisma.user.findUnique({
    where: { authId: user.id },
  });

  if (existingUserUser) {
    return NextResponse.json({
      message: "Login successful",
      access_token: session?.access_token,
      refresh_token: session?.refresh_token,
      userId: existingUserUser.id,
    });
  }
}
