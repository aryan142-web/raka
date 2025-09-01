"use client";
import { useContext } from "react";
import { UserDetailContext } from "@/context/UserDetailContext";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function SettingsPage() {
  const { userDetail } = useContext(UserDetailContext);

  if (!userDetail) {
    return (
      <div className="p-6 max-w-3xl mx-auto text-gray-600">
        Please sign in to view your settings.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Tokens left */}
      <Card>
        <CardHeader>
          <CardTitle>Your Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold text-blue-600">
            {userDetail.token ?? 0} tokens left
          </p>
        </CardContent>
      </Card>

      {/* Profile (from sign-in details) */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Name:</strong> {userDetail.name || "N/A"}</p>
          <p><strong>Email:</strong> {userDetail.email || "N/A"}</p>
        </CardContent>
      </Card>
    </div>
  );
}
