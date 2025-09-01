"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function HelpCenterPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Help Center</h1>
      <p className="text-gray-600 mb-8">
        Find answers to common questions, troubleshooting guides, and support resources.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>How do I reset my password?</AccordionTrigger>
                <AccordionContent>
                  Go to <b>Settings → Security</b> and choose "Update Password". You’ll be asked to enter your old password and a new one.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>How can I contact support?</AccordionTrigger>
                <AccordionContent>
                  You can reach out via our support email <b>support@example.com</b> or use the in-app chat for urgent help.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Where can I see my subscription?</AccordionTrigger>
                <AccordionContent>
                  Navigate to <b>My Subscription</b> in the sidebar. You’ll see your plan details and renewal information there.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Guides Section */}
        <Card>
          <CardHeader>
            <CardTitle>Getting Started Guides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>🚀 <b>Start a New Chat</b> – Learn how to create workspaces and interact with AI.</li>
              <li>⚙️ <b>Customize Settings</b> – Update your profile, preferences, and security.</li>
              <li>💳 <b>Manage Subscription</b> – Upgrade, cancel, or review billing details.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
