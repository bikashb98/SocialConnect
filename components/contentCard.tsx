"use client";

import { useState } from "react";
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

  const likesCount = post._count?.likes || post.likes?.length || 0;
  const commentsCount = post._count?.comments || post.comments?.length || 0;

  const handleCommentClick = () => {
    setShowComments(!showComments);
    onComment?.(post.id);
  };

  const handleCommentSubmit = () => {
    if (!commentText.trim()) return;

    setIsCommenting(true);

    // TODO: Implement your comment submission logic here
    console.log("Submitting comment:", {
      postId: post.id,
      comment: commentText,
    });

    // Simulate API call
    setTimeout(() => {
      setCommentText("");
      setIsCommenting(false);
      // You can add the new comment to the post here
    }, 500);
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
              onClick={() => onLike?.(post.id)}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-500 hover:bg-red-50"
            >
              <Heart className="h-5 w-5" />
              <span>Like</span>
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
            <div className="flex items-start space-x-3">
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
          </div>
        )}
      </CardContent>
    </Card>
  );
}
