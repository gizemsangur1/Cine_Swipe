import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a movie expert. Return only a JSON array of movie titles without explanation.",
      },
      {
        role: "user",
        content: `Recommend 5 movies based on: "${prompt}"`,
      },
    ],
    temperature: 0.8,
  });

  const responseText = completion.choices[0].message.content;
  try {
    const movieTitles = JSON.parse(responseText!); 
    return NextResponse.json(movieTitles);
  } catch (err) {
    return NextResponse.json({ error: "AI output could not be parsed",err }, { status: 500 });
  }
}
