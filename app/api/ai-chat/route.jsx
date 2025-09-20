import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // ✅ must exist in .env.local
});

export async function POST(req) {
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

    // ✅ Keep both user + assistant messages
    const cleanedMessages = messages.filter(
      (m) =>
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

    // ✅ Truncate history if too long
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

    console.log("📝 Sending conversation to OpenAI:", conversation);

    // ✅ Call OpenAI
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini", // change to gpt-4.1 for longer context
      messages: conversation,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content || "";

    // ✅ Return both reply and updated history
    return NextResponse.json({
      result: reply.trim(),
      updatedMessages: [...safeMessages, { role: "assistant", content: reply.trim() }],
    });
  } catch (e) {
    console.error("🚨 AI Chat error:", e.response?.data || e.message || e);

    return NextResponse.json(
      { error: e?.message || "AI chat failed" },
      { status: 500 }
    );
  }
}
