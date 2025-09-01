"use client";
import * as React from "react";

export function Accordion({ children }) {
  return <div className="space-y-2">{children}</div>;
}

export function AccordionItem({ value, children }) {
  return (
    <div className="border rounded-lg">
      {children}
    </div>
  );
}

export function AccordionTrigger({ children, onClick }) {
  const [open, setOpen] = React.useState(false);

  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full flex justify-between items-center px-4 py-2 font-medium text-left"
    >
      {children}
      <span>{open ? "−" : "+"}</span>
    </button>
  );
}

export function AccordionContent({ children }) {
  const [visible, setVisible] = React.useState(false);

  // Simple toggle version
  return (
    <div className="px-4 pb-3 text-gray-600">
      {children}
    </div>
  );
}
