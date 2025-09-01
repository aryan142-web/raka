import { GenAiCode } from "@/configs/AiModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    console.log("📩 Incoming prompt:", prompt?.slice(0, 200));

    const SYSTEM_PROMPT = `
You are an AI that generates complete React projects. 
Return valid JSON ONLY in the format:
{
  "files": {
    "/App.jsx": { "code": "..." },
    "/index.css": { "code": "..." }
  }
}
Do NOT include explanations, just JSON.
`;

    const result = await GenAiCode.sendMessage(SYSTEM_PROMPT + "\n\n" + prompt);

    console.log("🤖 Raw GenAiCode result:", result);

    let text = "";
    if (typeof result === "string") {
      text = result;
    } else if (result?.response?.text) {
      text = await result.response.text();
    } else if (result?.content) {
      text = result.content[0]?.text || JSON.stringify(result.content);
    } else if (result?.choices) {
      text = result.choices[0]?.message?.content || "";
    } else {
      console.error("❌ Unknown AI response format:", result);
      throw new Error("Unsupported AI response format from GenAiCode");
    }

    console.log("📜 Parsed text:", text);

    let aiResp;
    try {
      aiResp = JSON.parse(text);
    } catch (err) {
      console.error("⚠️ Invalid AI JSON, falling back. Text was:", text);
      aiResp = {
        files: {
          "/App.jsx": { code: text },
        },
      };
    }

    return NextResponse.json(aiResp);
  } catch (e) {
    console.error("🚨 AI CodeGen error:", e);
    return NextResponse.json(
      { error: e.message || "AI code generation failed" },
      { status: 500 }
    );
  }
}
