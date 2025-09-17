// app/api/ai-chat/route.js
import { chatSession } from "@/configs/AiModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { messages, systemPrompt } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages must be an array" },
        { status: 400 }
      );
    }

    // Build conversation for chatSession
    const conversation = [
      { role: "system", content: systemPrompt || "You are an AI assistant." },
      ...messages,
    ];

    const result = await chatSession(conversation);

    return NextResponse.json({ result: result.trim() });
  } catch (e) {
    console.error("🚨 AI Chat error:", e);
    return NextResponse.json(
      { error: e.message || "AI chat failed" },
      { status: 500 }
    );
  }
}
