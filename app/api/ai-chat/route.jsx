import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // make sure this exists in .env.local
});

export async function POST(req) {
  try {
    const { messages, systemPrompt } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages must be an array" },
        { status: 400 }
      );
    }

    // Build conversation
    const conversation = [
      { role: "system", content: systemPrompt || "You are an AI assistant." },
      ...messages,
    ];

    // Call OpenAI
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini", // you can change to gpt-4.1 or gpt-3.5-turbo
      messages: conversation,
    });

    const reply = completion.choices[0]?.message?.content || "";

    return NextResponse.json({ result: reply.trim() });
  } catch (e) {
    console.error("🚨 AI Chat error:", e);
    return NextResponse.json(
      { error: e.message || "AI chat failed" },
      { status: 500 }
    );
  }
}
