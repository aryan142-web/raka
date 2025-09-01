// lib/aiClient.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import Anthropic from "@anthropic-ai/sdk";

const useClaude = process.env.USE_CLAUDE === "true";

let client = null;

if (useClaude) {
  client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
} else {
  client = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
}

export async function generateResponse(prompt) {
  if (useClaude) {
    const msg = await client.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    });
    return msg.content[0].text;
  } else {
    const model = client.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  }
}
