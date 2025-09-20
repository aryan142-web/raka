import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!, // ✅ only once
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, systemPrompt } = body || {};

    // ✅ Validate messages
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages must be a non-empty array" },
        { status: 400 }
      );
    }

    // ✅ Clean and validate
    const cleanedMessages = messages.filter(
      (m: any) =>
        m &&
        ["user", "assistant"].includes(m.role) &&
        typeof m.content === "string" &&
        m.content.trim() !== ""
    );

    if (cleanedMessages.length === 0) {
      return NextResponse.json(
        { error: "No valid messages provided" },
        { status: 400 }
      );
    }

    // ✅ Limit history
    const MAX_MESSAGES = 50;
    const safeMessages =
      cleanedMessages.length > MAX_MESSAGES
        ? cleanedMessages.slice(-MAX_MESSAGES)
        : cleanedMessages;

    // ✅ Build conversation
    const conversation = [
      { role: "system", content: systemPrompt || "You are an AI assistant." },
      ...safeMessages,
    ];

    // Call OpenAI
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: conversation,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content?.trim() || "";

    // ✅ Return both reply and updated history
    return NextResponse.json({
      result: reply,
      updatedMessages: [...safeMessages, { role: "assistant", content: reply }],
    });
  } catch (e: any) {
    console.error("🚨 AI Chat error:", e);
    return NextResponse.json(
      { error: e?.message || "AI chat failed" },
      { status: 500 }
    );
  }
}
