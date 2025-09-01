"use client";

import Link from "next/link";

export default function UserMenu({ onSignOut }) {
  return (
    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
      <Link
        href="/chats"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        Your Chats
      </Link>
      <Link
        href="/settings"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        Settings
      </Link>
      <Link
        href="/help-center"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        Help Center
      </Link>
      <Link
        href="/subscription"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        My Subscription
      </Link>
      <button
        onClick={onSignOut}
        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
      >
        Sign Out
      </button>
    </div>
  );
}
