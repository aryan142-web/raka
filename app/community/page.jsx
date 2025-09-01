"use client";
import React from "react";
import Link from "next/link";

function Community() {
  return (
    <div className="min-h-screen w-full bg-orange-100 text-black flex flex-col items-center px-4 md:px-20 py-12">
      {/* Heading */}
      <h1 className="text-4xl font-bold text-center mb-10">Community</h1>

      {/* Intro */}
      <p className="text-lg text-gray-700 leading-relaxed text-center max-w-2xl mb-8">
        Welcome to our Community! 🎉 <br />
        This is where you can connect with other developers, share your work,
        ask questions, and learn together.
      </p>

      {/* Join Telegram Button */}
      <Link
        href="https://t.me/+s3gK-MTv02A3NDJl"
        target="_blank"
        rel="noopener noreferrer"
        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-md transition mb-12"
      >
        🚀 Join Our Telegram Community
      </Link>

      {/* Content Cards */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="https://t.me/+s3gK-MTv02A3NDJl"
          target="_blank"
          rel="noopener noreferrer"
          className="p-6 bg-white shadow rounded-lg hover:shadow-lg transition block"
        >
          <h2 className="text-xl font-semibold mb-2">💬 Discussions</h2>
          <p className="text-gray-600">
            Join discussions with other members and share your ideas.
          </p>
        </Link>

        <Link
          href="https://t.me/+s3gK-MTv02A3NDJl"
          target="_blank"
          rel="noopener noreferrer"
          className="p-6 bg-white shadow rounded-lg hover:shadow-lg transition block"
        >
          <h2 className="text-xl font-semibold mb-2">🌟 Showcase</h2>
          <p className="text-gray-600">
            Showcase your projects and see what others are building.
          </p>
        </Link>

        <Link
          href="https://t.me/+s3gK-MTv02A3NDJl"
          target="_blank"
          rel="noopener noreferrer"
          className="p-6 bg-white shadow rounded-lg hover:shadow-lg transition block"
        >
          <h2 className="text-xl font-semibold mb-2">🛠 Help & Support</h2>
          <p className="text-gray-600">
            Stuck somewhere? Get help from our friendly community.
          </p>
        </Link>

        <Link
          href="https://t.me/+s3gK-MTv02A3NDJl"
          target="_blank"
          rel="noopener noreferrer"
          className="p-6 bg-white shadow rounded-lg hover:shadow-lg transition block"
        >
          <h2 className="text-xl font-semibold mb-2">📚 Resources</h2>
          <p className="text-gray-600">
            Access guides, tutorials, and learning resources shared by others.
          </p>
        </Link>
      </div>
    </div>
  );
}

export default Community;
