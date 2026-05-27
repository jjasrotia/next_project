import OpenAI from "openai"
import { NextResponse } from "next/server"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    console.log("🔥 API HIT")

    const body = await req.json()
    console.log("BODY:", body)

    const prompt = body?.prompt

    if (!prompt) {
      console.log("❌ No prompt provided")

      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      console.log("❌ Missing API key")

      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY" },
        { status: 500 }
      )
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    })

    console.log("✅ OpenAI success")

    return NextResponse.json({
      text: response.choices[0].message.content,
    })
  } catch (error: any) {
    console.error("💥 FULL ERROR:", error)

    return NextResponse.json(
      {
        error: "Server crashed",
        details: error?.message,
      },
      { status: 500 }
    )
  }
}