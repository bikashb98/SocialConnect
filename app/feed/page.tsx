"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageIcon, X } from "lucide-react";
import ContentCard from "@/components/contentCard";
import Image from "next/image";
import axios from "axios";

// Mock data for demonstration
const mockPosts = [
  {
    id: "1",
    content:
      "Just finished building an amazing React component! The feeling when everything clicks into place is unmatched 🚀",
    imageUrl: "",
    category: "general" as const,
    createdAt: "2025-09-08T10:30:00Z",
    author: {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      username: "johndoe",
      profile: {
        avatarUrl: "",
      },
    },
    likes: [{ id: "1" }, { id: "2" }],
    comments: [{ id: "1" }],
    _count: {
      likes: 2,
      comments: 1,
    },
  },
  {
    id: "2",
    content:
      "Beautiful sunset from my office window today. Sometimes you need to pause and appreciate the little things in life.",
    imageUrl: "",
    category: "general" as const,
    createdAt: "2025-09-08T08:15:00Z",
    author: {
      id: "2",
      firstName: "Jane",
      lastName: "Smith",
      username: "janesmith",
      profile: {
        avatarUrl: "",
      },
    },
    likes: [{ id: "1" }, { id: "2" }, { id: "3" }],
    comments: [{ id: "1" }, { id: "2" }],
    _count: {
      likes: 3,
      comments: 2,
    },
  },
  {
    id: "3",
    content:
      "Learning Next.js has been an incredible journey. The app router makes everything so much cleaner!",
    imageUrl: "",
    category: "question" as const,
    createdAt: "2025-09-08T06:45:00Z",
    author: {
      id: "3",
      firstName: "Alex",
      lastName: "Johnson",
      username: "alexj",
      profile: {
        avatarUrl: "",
      },
    },
    likes: [{ id: "1" }],
    comments: [],
    _count: {
      likes: 1,
      comments: 0,
    },
  },
];

export default function Feed() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication on component mount
  useEffect(() => {
    const verifiedUser = localStorage.getItem("userId");
    if (!verifiedUser) {
      router.push("/");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  const [postContent, setPostContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<
    "general" | "announcement" | "question"
  >("general");
  const [isPosting, setIsPosting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
        return;
      }

      // Validate file size
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        alert("File too large. Maximum size is 2MB.");
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePost = async () => {
    if (!postContent.trim() && !selectedImage) return;

    setIsPosting(true);

    try {
      // Get user ID from localStorage (you might want to use a different auth method)
      const userId = localStorage.getItem("userId");

      // Convert image to base64 if present
      let imageBase64 = null;
      if (selectedImage) {
        const reader = new FileReader();
        imageBase64 = await new Promise((resolve) => {
          reader.onload = (e) => {
            const result = e.target?.result as string;
            // Remove the data:image/...;base64, prefix
            resolve(result.split(",")[1]);
          };
          reader.readAsDataURL(selectedImage);
        });
      }

      // Prepare the data according to the backend schema
      const postData = {
        content: postContent,
        category: selectedCategory.toUpperCase(), // Backend expects uppercase
        image: imageBase64,
        authorId: userId,
      };

      // Make API call to create post
      const response = await axios.post("/api/posts", postData, {});

      if (response.status === 201) {
        // Reset form on success
        setPostContent("");
        setSelectedImage(null);
        setImagePreview("");
        setSelectedCategory("general");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        alert("Post created successfully!");

        // Optionally refresh the feed or add the new post to the state
        // You might want to refetch posts here
      }
    } catch (error) {
      console.error("Error creating post:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error || "Failed to create post";
        alert(errorMessage);
      } else {
        alert("An unexpected error occurred");
      }
    } finally {
      setIsPosting(false);
    }
  };

  const handleLike = (postId: string) => {
    // TODO: Implement like functionality
    console.log("Liked post:", postId);
  };

  const handleComment = (postId: string) => {
    // TODO: Implement comment functionality
    console.log("Comment on post:", postId);
  };

  const handleEdit = (postId: string) => {
    // TODO: Implement edit functionality
    console.log("Edit post:", postId);
  };

  const handleDelete = (postId: string) => {
    // TODO: Implement delete functionality
    console.log("Delete post:", postId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Feed</h1>
          </div>
        </div>

        {/* Create Post Card */}
        <Card className="mb-8 shadow-sm">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="" alt="Your avatar" />
                <AvatarFallback className="bg-blue-500 text-white">
                  YU
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm">Share something...</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              <Textarea
                placeholder="What's on your mind?"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                className="min-h-[100px] resize-none border-0 p-0 focus-visible:ring-0 text-lg placeholder:text-gray-400"
              />

              {/* Category Selection */}
              <div className="flex items-center space-x-3">
                <label className="text-sm font-medium text-gray-700">
                  Category:
                </label>
                <Select
                  value={selectedCategory}
                  onValueChange={(value) =>
                    setSelectedCategory(
                      value as "general" | "announcement" | "question",
                    )
                  }
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="announcement">Announcement</SelectItem>
                    <SelectItem value="question">Question</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="relative">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={600}
                    height={300}
                    className="w-full rounded-lg max-h-80 object-cover"
                  />
                  <Button
                    onClick={removeImage}
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Action Bar */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 hover:bg-blue-50"
                  >
                    <ImageIcon className="h-5 w-5" />
                    <span>Add Photo</span>
                  </Button>
                </div>

                <Button
                  onClick={handlePost}
                  disabled={
                    (!postContent.trim() && !selectedImage) || isPosting
                  }
                  className="px-6"
                >
                  {isPosting ? "Posting..." : "Post"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Posts Feed */}
        <div className="space-y-6">
          {mockPosts.map((post) => (
            <ContentCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onComment={handleComment}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {/* Load More */}
        <div className="mt-8 text-center">
          <Button variant="outline" className="px-8">
            Load More Posts
          </Button>
        </div>
      </div>
    </div>
  );
}
