import { NextResponse } from "next/server";
import { PrismaClient } from "../../../lib/generated/prisma";
import { z } from "zod";

const prisma = new PrismaClient();

// Schema validation for comment creation
const CommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment content is required")
    .max(200, "Comment too long"),
  postId: z.string().min(1, "Post ID is required"),
  authorId: z.string().min(1, "Author ID is required"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = CommentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid comment data", details: parsed.error },
        { status: 400 },
      );
    }

    const { content, postId, authorId } = parsed.data;

    // Check if the post exists
    const post = await prisma.post.findUnique({
      where: { id: postId, isActive: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: authorId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create the comment
    const newComment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            profile: {
              select: {
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Comment created successfully", comment: newComment },
      { status: 201 },
    );
  } catch (err: unknown) {
    console.error("Error creating comment:", err);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// GET route to fetch comments for a specific post
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 },
      );
    }

    const comments = await prisma.comment.findMany({
      where: {
        postId,
        isActive: true,
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            profile: {
              select: {
                avatarUrl: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ comments }, { status: 200 });
  } catch (err: unknown) {
    console.error("Error fetching comments:", err);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
