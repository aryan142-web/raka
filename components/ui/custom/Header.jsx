"use client";

import React, { useContext } from "react";
import Image from "next/image";
import { Button } from "../button";
import { UserDetailContext } from "@/context/UserDetailContext";
import { ActionContext } from "@/context/ActionContext";
import { useSidebar } from "../sidebar";
import { usePathname } from "next/navigation";
import { LucideDownload, Rocket } from "lucide-react";

function UserAvatar({ src, onClick }) {
  if (!src) {
    return (
      <div
        onClick={onClick}
        className="w-9 h-9 rounded-full bg-gray-400 flex items-center justify-center text-black cursor-pointer font-bold"
      >
        U
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt="User Avatar"
      width={36}
      height={36}
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

  const handleAction = (action) => {
    setAction?.({
      actionType: action,
      timeStamp: Date.now(),
    });
  };

  // ✅ Only render Header on /workspace routes
  if (!pathname.startsWith("/workspace")) {
    return null;
  }

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-8 px-6 flex items-center justify-between bg-orange-100 text-black">
      {/* Left: Logo */}
      <div className="flex items-center">
        <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
      </div>

      {/* Right: Buttons + Avatar */}
      <div className="flex items-center gap-6">
        <div className="flex gap-3">
          <Button
            onClick={() => handleAction("export")}
            className="flex items-center border border-gray-300 bg-white text-black px-3 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            <LucideDownload className="w-1 h-1 mr-1" />
            Export
          </Button>
          <Button
            onClick={() => handleAction("deploy")}
            className="flex items-center bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600 transition"
          >
            <Rocket className="w-1 h-1 mr-1" />
            Deploy
          </Button>
        </div>

        {userDetail?.name && (
          <UserAvatar src={userDetail?.picture} onClick={toggleSidebar} />
        )}
      </div>
    </header>
  );
}

export default Header;
