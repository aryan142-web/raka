"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import React from "react";

function ConvexClientProvider({ children }) {
  // ✅ Prefer env variable, fallback to local Convex dev server
  const convexUrl =
    process.env.NEXT_PUBLIC_CONVEX_URL || "http://localhost:3210";

  if (!convexUrl) {
    throw new Error(
      "Convex URL not found. Please set NEXT_PUBLIC_CONVEX_URL in .env.local"
    );
  }

  const convex = new ConvexReactClient(convexUrl);

  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}

export default ConvexClientProvider;
