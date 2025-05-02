import { auth } from "@clerk/nextjs/server"
import { AIService } from "@/lib/ai"
import { getScript } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new Response("Unauthorized", { status: 401 })
    }

    const { scriptId, prompt, model } = await req.json()
    
    if (!scriptId || !prompt) {
      return new Response("Missing required fields", { status: 400 })
    }

    const script = await getScript(scriptId)
    if (!script) {
      return new Response("Script not found", { status: 404 })
    }

    const aiService = new AIService({
      openaiApiKey: process.env.OPENAI_API_KEY,
      anthropicApiKey: process.env.ANTHROPIC_API_KEY,
      googleApiKey: process.env.GOOGLE_API_KEY
    })

    const generatedText = await aiService.generateBlock(script, prompt, model)
    
    return new Response(JSON.stringify({ text: generatedText }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error generating text:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
} 