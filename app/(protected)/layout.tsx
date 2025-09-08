"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function validateSession() {
      const token = localStorage.getItem("access_token");
      const refresh = localStorage.getItem("refresh_token");

      if (!token || !refresh) {
        router.push("/");
        return;
      }

      try {
        // Use the correct endpoint path
        const response = await axios.post("/api/auth/token/refresh", {
          refresh_token: refresh,
        });

        const data = response.data;

        // Update tokens in localStorage
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);

        setIsAuthenticated(true);
        setLoading(false);
      } catch {
        router.push("/");
      }
    }

    validateSession();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Prevent flash of content before redirect
  }

  return <>{children}</>;
}
