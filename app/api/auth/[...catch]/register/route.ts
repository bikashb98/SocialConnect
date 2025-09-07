import * as z from "zod";
import { NextResponse } from "next/server";

const RegistrationSchema = z.object({
  email: z.string().email(),
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/),
  firstname: z.string(),
  lastname: z.string(),
  password: z.string().min(8).max(100),
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
}
