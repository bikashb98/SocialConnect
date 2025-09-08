"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import AppbarMain from "@/components/AppbarMain";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      if (response.status === 200) {
        const { access_token, refresh_token, userId } = response.data;
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
        localStorage.setItem("userId", userId);

        router.push("/feed");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div>
      <AppbarMain />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="w-full max-w-6xl flex items-center justify-between">
          {/* Left side - Branding */}
          <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-8">
            <h1 className="text-6xl font-bold text-blue-600 mb-6">
              SocialConnect
            </h1>
            <p className="text-2xl text-gray-700">
              Connect with friends and the world around you on SocialConnect.
            </p>
          </div>

          {/* Right side - Login Form */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="w-full max-w-md space-y-6">
              {/* Mobile branding */}
              <div className="lg:hidden text-center mb-8">
                <h1 className="text-4xl font-bold text-blue-600 mb-4">
                  SocialConnect
                </h1>
                <p className="text-lg text-gray-700">
                  Connect with friends and the world around you.
                </p>
              </div>

              {/* Login Card */}
              <Card className="shadow-lg">
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Input
                      name="email"
                      onChange={handleInputChange}
                      type="email"
                      placeholder="Email "
                      className="h-12 text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      name="password"
                      onChange={handleInputChange}
                      type="password"
                      placeholder="Password"
                      className="h-12 text-lg"
                    />
                  </div>
                  <Button
                    onClick={handleSubmit}
                    className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700"
                  >
                    Log In
                  </Button>
                  <div className="text-center">
                    <a
                      href="#"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Forgotten password?
                    </a>
                  </div>
                  <Separator className="my-4" />
                  <div className="text-center">
                    <Button
                      onClick={() => router.push("/signup")}
                      variant="outline"
                      className="bg-green-500 hover:bg-green-600 text-white border-green-500 hover:border-green-600 font-semibold px-8 py-3"
                    >
                      Create New Account
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Footer text */}
              <div className="text-center text-sm text-gray-600"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
