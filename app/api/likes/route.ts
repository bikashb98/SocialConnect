import { NextResponse } from "next/server";
import { PrismaClient } from "../../../lib/generated/prisma";
import { z } from "zod";

const prisma = new PrismaClient();

// Schema validation for like creation
const LikeSchema = z.object({
  postId: z.string().min(1, "Post ID is required"),
  userId: z.string().min(1, "User ID is required"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = LikeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid like data", details: parsed.error },
        { status: 400 },
      );
    }

    const { postId, userId } = parsed.data;

    // Check if the post exists
    const post = await prisma.post.findUnique({
      where: { id: postId, isActive: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if like already exists
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      // If like exists, remove it (toggle functionality)
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });

      return NextResponse.json(
        { message: "Like removed", liked: false },
        { status: 200 },
      );
    } else {
      // Create new like
      const newLike = await prisma.like.create({
        data: {
          postId,
          userId,
        },
      });

      return NextResponse.json(
        { message: "Post liked", liked: true, like: newLike },
        { status: 201 },
      );
    }
  } catch (err: unknown) {
    console.error("Error handling like:", err);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// GET route to check if a user has liked a post
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");
    const userId = searchParams.get("userId");

    if (!postId || !userId) {
      return NextResponse.json(
        { error: "Post ID and User ID are required" },
        { status: 400 },
      );
    }

    const like = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    return NextResponse.json({ liked: !!like }, { status: 200 });
  } catch (err: unknown) {
    console.error("Error checking like status:", err);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
