import { NextResponse } from "next/server";
import { PrismaClient } from "../../../lib/generated/prisma";
import { supabase } from "../../lib/supabase";
import { z } from "zod";

const prisma = new PrismaClient();
// Schema validation
const PostSchema = z.object({
  content: z.string().min(1, "Content is required"),
  category: z.enum(["GENERAL", "ANNOUNCEMENT", "QUESTION"]),
  image: z.string().optional(),
  authorId: z.string(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = PostSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid post data", details: parsed.error },
        { status: 400 },
      );
    }

    const { content, category, image, authorId } = parsed.data;

    let imageUrl: string | null = null;
    if (image) {
      const fileName = `${Date.now()}-${authorId}.png`;
      const { error } = await supabase.storage
        .from("posts") // bucket name
        .upload(fileName, Buffer.from(image, "base64"), {
          contentType: "image/png",
        });

      if (error) {
        return NextResponse.json(
          { error: "Image upload failed", details: error.message },
          { status: 500 },
        );
      }

      const { data } = supabase.storage.from("posts").getPublicUrl(fileName);
      imageUrl = data.publicUrl;
    }

    // Save post in DB
    const newPost = await prisma.post.create({
      data: {
        content,
        category: category,
        authorId: authorId,
        imageUrl: imageUrl,
      },
    });

    return NextResponse.json(
      { message: "Post created successfully", post: newPost },
      { status: 201 },
    );
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
