import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

let conversation = [
  { role: "system", content: "You are a helpful assistant." },
];

export async function POST(req) {
  const { message } = await req.json();

  conversation.push({ role: "user", content: message });

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: conversation,
  });

  const reply = completion.choices[0].message.content;

  conversation.push({ role: "assistant", content: reply });

  return Response.json({ reply });
}
