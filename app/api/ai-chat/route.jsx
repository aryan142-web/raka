import { chatSession } from "@/configs/AiModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    const result = await chatSession.sendMessage(prompt);

    let AIResp = "";

    // Handle all common SDK formats safely
    if (typeof result === "string") {
      AIResp = result;
    } else if (result?.response?.text) {
      AIResp = await result.response.text();
    } else if (result?.content) {
      AIResp = result.content[0]?.text || JSON.stringify(result.content);
    } else if (result?.choices) {
      AIResp = result.choices[0]?.message?.content || "";
    } else {
      console.error("Unknown AI response format:", result);
      throw new Error("Unsupported AI response format from chatSession");
    }

    return NextResponse.json({ result: AIResp.trim() });
  } catch (e) {
    console.error("AI Chat error:", e);
    return NextResponse.json(
      { error: e.message || "AI chat failed" },
      { status: 500 }
    );
  }
}
