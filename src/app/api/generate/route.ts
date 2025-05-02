import { NextResponse } from "next/server"
import { AIService } from "@/lib/ai"
import { getScript } from "@/lib/db"
import { auth } from "@clerk/nextjs"

export async function POST(request: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { scriptId, prompt, model } = await request.json()
    
    if (!scriptId || !prompt) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const script = await getScript(scriptId)
    if (!script) {
      return new NextResponse("Script not found", { status: 404 })
    }

    const aiService = new AIService({
      openaiApiKey: process.env.OPENAI_API_KEY,
      anthropicApiKey: process.env.ANTHROPIC_API_KEY,
      googleApiKey: process.env.GOOGLE_API_KEY
    })

    const generatedText = await aiService.generateBlock(script, prompt, model)
    
    return NextResponse.json({ text: generatedText })
  } catch (error) {
    console.error("Error generating text:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 