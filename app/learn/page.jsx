"use client";

import { useState } from "react";

export default function LearnPage() {
  const sections = [
    {
      title: "Getting Started",
      description:
        "Step-by-step guide to set up your first workspace and begin building.",
      details: `Here you can write the full getting started guide. 
It could include screenshots, code snippets, and more instructions.`,
    },
    {
      title: "Token System",
      description:
        "Learn how tokens work, how they are consumed, and ways to optimize usage.",
      details: `Tokens are used to measure usage. This section will explain 
pricing, limits, and how to optimize consumption.`,
    },
    {
      title: "Export & Deploy",
      description:
        "Understand how to export your code and deploy your projects easily.",
      details: `Steps for exporting code, pushing to GitHub, and deploying 
to Vercel/Netlify are explained here.`,
    },
    {
      title: "Best Practices",
      description:
        "Explore best practices and tips for faster, efficient development.",
      details: `Use environment variables, follow modular design, 
and keep code reusable. Tips go here.`,
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Learn</h1>
      <div className="grid gap-6">
        {sections.map((s, i) => (
          <div
            key={i}
            className="rounded-2xl border p-6 bg-gray-100 shadow-sm hover:shadow-md transition cursor-pointer"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            <h2 className="text-xl font-semibold mb-2">{s.title}</h2>
            <p className="text-gray-700">{s.description}</p>

            {openIndex === i && (
              <div className="mt-4 text-gray-900 border-t pt-4 whitespace-pre-line">
                {s.details}
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
