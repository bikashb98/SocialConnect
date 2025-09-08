"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";

interface AppbarProps {
  user?: {
    firstName?: string;
    lastName?: string;
    username?: string;
    profile?: {
      avatarUrl?: string;
    };
  };
}

export default function Appbar({ user }: AppbarProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    router.push("/");
  };

  const handleProfileClick = () => {
    // TODO: Navigate to profile page or open profile menu
    console.log("Profile clicked");
    // router.push("/profile");
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName || !lastName) return "U";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-blue-600">SocialConnect</h1>
          </div>

          {/* Right Side - Profile & Logout */}
          <div className="flex items-center space-x-3">
            {/* Profile Section */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                onClick={handleProfileClick}
                className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user?.profile?.avatarUrl}
                    alt={`${user?.firstName} ${user?.lastName}`}
                  />
                  <AvatarFallback className="bg-blue-500 text-white text-sm">
                    {getInitials(user?.firstName, user?.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.firstName
                      ? `${user.firstName} ${user.lastName}`
                      : "User"}
                  </p>
                  <p className="text-xs text-gray-500">
                    @{user?.username || "username"}
                  </p>
                </div>
              </Button>
            </div>

            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600 hover:border-red-300"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
