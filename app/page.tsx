"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  return (
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
                    type="email"
                    placeholder="Email or phone number"
                    className="h-12 text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="Password"
                    className="h-12 text-lg"
                  />
                </div>
                <Button className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700">
                  Log In
                </Button>
                <div className="text-center">
                  <a href="#" className="text-blue-600 hover:underline text-sm">
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
  );
}
