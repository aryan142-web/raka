"use client";
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How do I get started?",
    answer:
      "Click on 'Get Started' on the homepage, sign in with Google, and begin creating your first workspace.",
  },
  {
    question: "How does token usage work?",
    answer:
      "Each action such as generating a workspace consumes tokens. You can view your balance in your profile.",
  },
  {
    question: "Can I export my code?",
    answer:
      "Yes. Inside a workspace, use the 'Export' button at the top-right to download your generated code.",
  },
  {
    question: "Who can I contact for support?",
    answer:
      "Visit our Community page or email us at support@example.com for direct help.",
  },
];

function HelpCenter() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen w-full bg-orange-100 text-black flex flex-col items-center px-4 md:px-20 py-12">
      {/* Heading */}
      <h1 className="text-4xl font-bold text-center mb-10">Help Center</h1>

      {/* FAQ Section */}
      <div className="w-full max-w-3xl space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border rounded-lg bg-white shadow hover:shadow-md"
          >
            <button
              className="w-full flex justify-between items-center px-4 py-3 text-left font-medium"
              onClick={() => toggleFAQ(index)}
            >
              {faq.question}
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>
            {openIndex === index && (
              <div className="px-4 pb-4 text-gray-600">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default HelpCenter;
