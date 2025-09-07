import * as z from "zod";
import { NextResponse } from "next/server";
import { PrismaClient } from "../../../../../lib/generated/prisma";

const prisma = new PrismaClient();

const RegistrationSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/),
  authId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsedBody = RegistrationSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      { error: "Invalid request data", details: parsedBody.error },
      { status: 400 },
    );
  }

  const { authId, username, firstName, lastName } = parsedBody.data;

  const existingUser = await prisma.user.findUnique({
    where: { username: username },
  });

  if (existingUser) {
    return NextResponse.json(
      { error: "User with this username already exists" },
      { status: 400 },
    );
  }
  try {
    const newUser = await prisma.user.create({
      data: {
        authId,
        username,
        firstName,
        lastName,
      },
    });

    return NextResponse.json(
      { message: "User registered successfully", userId: newUser.id },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", details: error },
      { status: 500 },
    );
  }
}
