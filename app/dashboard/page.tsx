"use client";

import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { admin } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Welcome, {admin?.username}!</h1>
      <p className="text-muted-foreground">
        Select a category from the sidebar to manage your application.
      </p>
    </div>
  );
}
