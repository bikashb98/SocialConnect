"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Send,
  Edit,
  Trash2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import axios from "axios";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    profile?: {
      avatarUrl?: string;
    };
  };
}

interface ContentCardProps {
  post: {
    id: string;
    content: string;
    imageUrl?: string;
    createdAt: string;
    category: "general" | "announcement" | "question";
    author: {
      id: string;
      firstName: string;
      lastName: string;
      username: string;
      profile?: {
        avatarUrl?: string;
      };
    };
    likes: { id: string }[];
    comments: { id: string }[];
    _count?: {
      likes: number;
      comments: number;
    };
  };
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
}

export default function ContentCard({
  post,
  onLike,
  onComment,
  onEdit,
  onDelete,
}: ContentCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(
    post._count?.likes || post.likes?.length || 0,
  );
  const [isLiking, setIsLiking] = useState(false);

  // Check initial like status
  useEffect(() => {
    const checkLikeStatus = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const response = await axios.get(
          `/api/likes?postId=${post.id}&userId=${userId}`,
        );
        setIsLiked(response.data.liked);
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    };

    checkLikeStatus();
  }, [post.id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatCommentDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) {
      return "now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d`;
    }
  };

  const getCategoryStyle = (
    category: "general" | "announcement" | "question",
  ) => {
    switch (category) {
      case "announcement":
        return {
          bg: "bg-blue-100",
          text: "text-blue-800",
          label: "Announcement",
        };
      case "question":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          label: "Question",
        };
      case "general":
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          label: "General",
        };
    }
  };

  const commentsCount = post._count?.comments || post.comments?.length || 0;

  const handleCommentClick = async () => {
    setShowComments(!showComments);
    onComment?.(post.id);

    // Load comments when expanding
    if (!showComments && comments.length === 0) {
      await loadComments();
    }
  };

  const handleLikeClick = async () => {
    if (isLiking) return;

    setIsLiking(true);

    try {
      // Get user ID from localStorage (you might want to use a different auth method)
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("Please log in to like posts");
        setIsLiking(false);
        return;
      }

      const likeData = {
        postId: post.id,
        userId,
      };

      const response = await axios.post("/api/likes", likeData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 || response.status === 201) {
        const { liked } = response.data;
        setIsLiked(liked);
        setLikesCount((prev) => (liked ? prev + 1 : prev - 1));

        // Optionally trigger a callback to update parent component
        onLike?.(post.id);
      }
    } catch (error) {
      console.error("Error handling like:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error || "Failed to update like";
        alert(errorMessage);
      } else {
        alert("An unexpected error occurred");
      }
    } finally {
      setIsLiking(false);
    }
  };

  const loadComments = async () => {
    setLoadingComments(true);
    try {
      const response = await axios.get(`/api/comments?postId=${post.id}`);
      setComments(response.data.comments);
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;

    setIsCommenting(true);

    try {
      // Get user ID from localStorage (you might want to use a different auth method)
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("Please log in to comment");
        setIsCommenting(false);
        return;
      }

      const commentData = {
        content: commentText,
        postId: post.id,
        authorId: userId,
      };

      const response = await axios.post("/api/comments", commentData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        // Add the new comment to the local state
        setComments([response.data.comment, ...comments]);
        setCommentText("");

        // Optionally trigger a callback to update parent component
        onComment?.(post.id);
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error || "Failed to submit comment";
        alert(errorMessage);
      } else {
        alert("An unexpected error occurred");
      }
    } finally {
      setIsCommenting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mb-4 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={post.author.profile?.avatarUrl}
                alt={`${post.author.firstName} ${post.author.lastName}`}
              />
              <AvatarFallback className="bg-blue-500 text-white">
                {getInitials(post.author.firstName, post.author.lastName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm">
                {post.author.firstName} {post.author.lastName}
              </p>
              <div className="flex items-center space-x-2">
                <p className="text-gray-500 text-xs">
                  @{post.author.username} • {formatDate(post.createdAt)}
                </p>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    getCategoryStyle(post.category).bg
                  } ${getCategoryStyle(post.category).text}`}
                >
                  {getCategoryStyle(post.category).label}
                </span>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onEdit?.(post.id)}
                className="cursor-pointer"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete?.(post.id)}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Post Content */}
        <div className="mb-4">
          <p className="text-gray-900 whitespace-pre-wrap break-words">
            {post.content}
          </p>
        </div>

        {/* Post Image */}
        {post.imageUrl && (
          <div className="mb-4 relative">
            <Image
              src={post.imageUrl}
              alt="Post content"
              width={800}
              height={400}
              className="w-full rounded-lg max-h-96 object-cover"
            />
          </div>
        )}

        {/* Engagement Stats */}
        {(likesCount > 0 || commentsCount > 0) && (
          <div className="flex items-center justify-between text-sm text-gray-500 mb-3 pb-3 border-b">
            <div className="flex items-center space-x-4">
              {likesCount > 0 && (
                <span>
                  {likesCount} {likesCount === 1 ? "like" : "likes"}
                </span>
              )}
              {commentsCount > 0 && (
                <span>
                  {commentsCount} {commentsCount === 1 ? "comment" : "comments"}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLikeClick}
              disabled={isLiking}
              className={`flex items-center space-x-2 ${
                isLiked
                  ? "text-red-500 hover:text-red-600 hover:bg-red-50"
                  : "text-gray-600 hover:text-red-500 hover:bg-red-50"
              }`}
            >
              <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
              <span>{isLiking ? "..." : "Like"}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleCommentClick}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 hover:bg-blue-50"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Comment</span>
            </Button>
          </div>
        </div>

        {/* Comment Section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t">
            {/* Comment Input */}
            <div className="flex items-start space-x-3 mb-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt="Your avatar" />
                <AvatarFallback className="bg-gray-500 text-white text-xs">
                  YU
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="min-h-[80px] resize-none text-sm"
                />
                <div className="flex justify-end mt-2">
                  <Button
                    onClick={handleCommentSubmit}
                    disabled={!commentText.trim() || isCommenting}
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>{isCommenting ? "Posting..." : "Comment"}</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Comments List */}
            {loadingComments ? (
              <div className="text-center py-4 text-gray-500">
                Loading comments...
              </div>
            ) : comments.length > 0 ? (
              <div className="space-y-3">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex items-start space-x-3">
                    <Avatar className="h-7 w-7">
                      <AvatarImage
                        src={comment.author.profile?.avatarUrl}
                        alt={`${comment.author.firstName} ${comment.author.lastName}`}
                      />
                      <AvatarFallback className="bg-blue-500 text-white text-xs">
                        {getInitials(
                          comment.author.firstName,
                          comment.author.lastName,
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="bg-gray-100 rounded-lg px-3 py-2">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold text-sm">
                            {comment.author.firstName} {comment.author.lastName}
                          </span>
                          <span className="text-gray-500 text-xs">
                            {formatCommentDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-900">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500 text-sm">
                No comments yet. Be the first to comment!
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
