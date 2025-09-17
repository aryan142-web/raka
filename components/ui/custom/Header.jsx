"use client";

import React, { useContext, useState } from "react";
import Image from "next/image";
import { Button } from "../button";
import { UserDetailContext } from "@/context/UserDetailContext";
import { ActionContext } from "@/context/ActionContext";
import { useSidebar } from "../sidebar";
import { usePathname } from "next/navigation";
import { LucideDownload, Rocket, Github } from "lucide-react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

function UserAvatar({ src, onClick }) {
  if (!src) {
    return (
      <div
        onClick={onClick}
        className="w-7 h-7 rounded-full bg-gray-400 flex items-center justify-center text-black cursor-pointer font-bold text-xs"
      >
        U
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt="User Avatar"
      width={28}
      height={28}
      className="rounded-full cursor-pointer border border-gray-300 shadow-sm"
      onClick={onClick}
    />
  );
}

function Header() {
  const { userDetail } = useContext(UserDetailContext);
  const { setAction } = useContext(ActionContext);
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();

  const [exportPaid, setExportPaid] = useState(false);
  const [deployPaid, setDeployPaid] = useState(false);
  const [showPayPal, setShowPayPal] = useState(null);

  // 🔑 Subscription flag (from user detail, Supabase, or Stripe)
  const hasSubscription = userDetail?.subscriptionActive === true;

  const handleAction = (action) => {
    setAction?.({
      actionType: action,
      timeStamp: Date.now(),
    });
  };

  // GitHub token handling
  const urlParams =
    typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const githubToken = urlParams?.get("github_token");

  const handleGitHub = async () => {
    if (!githubToken) {
      window.location.href = "/api/github/connect";
      return;
    }
    try {
      const res = await fetch("/api/github/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: githubToken,
          repoName: "my-new-repo",
          files: [
            { path: "README.md", content: "# Hello GitHub" },
            { path: "index.html", content: "<h1>Hello</h1>" },
          ],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      alert("✅ Project pushed: " + data.repoUrl);
    } catch (err) {
      console.error("GitHub push error:", err);
      alert("❌ GitHub push failed: " + err.message);
    }
  };

  if (!pathname.startsWith("/workspace")) return null;

  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test",
      }}
    >
      <header className="fixed top-0 inset-x-0 z-50 h-7 px-2 flex items-center justify-between bg-orange-100 text-black shadow-sm">
        {/* Left: Logo */}
        <div className="flex items-center">
          <img src="/logo.png" alt="Logo" className="h-5 w-auto" />
        </div>

        {/* Right: GitHub/Export/Deploy + Avatar */}
        <div className="flex items-center gap-3">
          <div className="flex gap-2 items-center">
            {/* GitHub Button */}
            <Button
              onClick={handleGitHub}
              className="flex items-center bg-black text-white px-2 py-1 rounded-md hover:bg-gray-800 transition text-xs"
            >
              <Github className="w-3 h-3 mr-1" />
              {githubToken ? "Push to GitHub" : "Connect GitHub"}
            </Button>

            {/* Export */}
            <Button
              onClick={() =>
                hasSubscription || exportPaid
                  ? handleAction("export")
                  : setShowPayPal("export")
              }
              className="flex items-center border border-gray-300 bg-white text-black px-2 py-1 rounded-md hover:bg-gray-200 transition text-xs"
            >
              <LucideDownload className="w-3 h-3 mr-1" />
              Export
            </Button>
            {!hasSubscription && showPayPal === "export" && !exportPaid && (
              <PayPalButtons
                style={{ layout: "horizontal", height: 28 }}
                createOrder={(data, actions) =>
                  actions.order.create({
                    purchase_units: [{ amount: { value: "5.00" } }],
                  })
                }
                onApprove={async (data, actions) => {
                  await actions.order.capture();
                  setExportPaid(true);
                  setShowPayPal(null);
                }}
              />
            )}

            {/* Deploy */}
            <Button
              onClick={() =>
                hasSubscription || deployPaid
                  ? handleAction("deploy")
                  : setShowPayPal("deploy")
              }
              className="flex items-center bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 transition text-xs"
            >
              <Rocket className="w-3 h-3 mr-1" />
              Deploy
            </Button>
            {!hasSubscription && showPayPal === "deploy" && !deployPaid && (
              <PayPalButtons
                style={{ layout: "horizontal", height: 28 }}
                createOrder={(data, actions) =>
                  actions.order.create({
                    purchase_units: [{ amount: { value: "10.00" } }],
                  })
                }
                onApprove={async (data, actions) => {
                  await actions.order.capture();
                  setDeployPaid(true);
                  setShowPayPal(null);
                }}
              />
            )}
          </div>

          {/* Avatar */}
          {userDetail?.name && (
            <UserAvatar src={userDetail?.picture} onClick={toggleSidebar} />
          )}
        </div>
      </header>
    </PayPalScriptProvider>
  );
}

export default Header;
