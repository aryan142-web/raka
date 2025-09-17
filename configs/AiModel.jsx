// configs/AiModel.js
import OpenAI from "openai";

// ✅ Server-side client (do NOT expose apiKey to client)
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // set in `.env.local`
});

// 🔹 General chat session
export async function chatSession(messages) {
  const response = await openai.chat.completions.create({
    model: "gpt-4.1-nano", // ✅ use OpenAI GPT-4.1-nano
    messages,
    temperature: 0.7,
    max_tokens: 4000,
  });

  return response.choices[0].message.content;
}

// 🔹 Code/project generation session
export async function GenAiCode(prompt) {
  const SYSTEM_PROMPT = `
You are an AI that generates complete, production-ready Next.js 15 projects.

Return valid JSON ONLY in this format:
{
  "projectTitle": "Professional descriptive title",
  "explanation": "Technical overview",
  "files": { "/app/page.js": { "code": "..." } },
  "generatedFiles": ["..."]
}
- No markdown, no code fences, JSON only.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4.1-nano", // ✅ switched to GPT-4.1-nano
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ],
    temperature: 0.8,
    max_tokens: 6000,
  });

  return response.choices[0].message.content;
}
