// app/api/gen-ai-code/route.js
import OpenAI from "openai";
import { NextResponse } from "next/server";

// 🔑 Initialize OpenAI client once
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    console.log("📩 Incoming prompt:", prompt?.slice(0, 200));

    const SYSTEM_PROMPT = `
You are an AI that generates complete, production-ready Next.js 15 projects in **JavaScript only** (no TypeScript).

Return valid JSON ONLY in this format:
{
  "projectTitle": "Professional descriptive title",
  "explanation": "Technical overview",
  "files": { "/app/page.js": { "code": "..." } },
  "generatedFiles": ["..."]
}
- No markdown, no code fences, JSON only.
- Use .js and .jsx extensions (never .ts or .tsx).
- Never output "Hello world" or trivial placeholder code.
`;

    // 🔑 Call OpenAI (chat completion)
    const response = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 6000,
    });

    const text = response.choices[0]?.message?.content || "";
    let aiResp;

    try {
      aiResp = JSON.parse(text);

      // 🛠️ Normalize file extensions (.ts/.tsx → .js/.jsx)
      if (aiResp.files) {
        const newFiles = {};
        Object.entries(aiResp.files).forEach(([path, file]) => {
          const jsPath = path.replace(/\.tsx?$/, ".jsx").replace(/\.ts$/, ".js");
          newFiles[jsPath] = file;
        });
        aiResp.files = newFiles;
        aiResp.generatedFiles = Object.keys(newFiles);
      }

      // 🚨 Post-validation
      const allCode = Object.values(aiResp.files || {})
        .map(f => f.code?.toLowerCase() || "")
        .join(" ");

      if (
        allCode.includes("hello world") ||
        Object.keys(aiResp.files || {}).length === 0
      ) {
        throw new Error("Invalid trivial output detected.");
      }
    } catch (err) {
      console.error("⚠️ Invalid AI output, falling back:", text.slice(0, 300));
      aiResp = {
        projectTitle: "Fallback Project",
        explanation:
          "AI returned invalid or trivial JSON. Please retry with a different prompt.",
        files: {
          "/app/page.js": {
            code: `export default function Page() {
  return <div>⚠️ Failed to generate project. Try again.</div>;
}`,
          },
        },
        generatedFiles: ["/app/page.js"],
      };
    }

    return NextResponse.json(aiResp);
  } catch (e) {
    console.error("🚨 AI CodeGen error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
