import { Script } from "@/types/database"

declare module "@/lib/ai" {
  interface AIConfig {
    openaiApiKey?: string
    anthropicApiKey?: string
    googleApiKey?: string
  }

  export class AIService {
    constructor(config: AIConfig)
    generateBlock(script: Script, prompt: string, model?: 'openai' | 'anthropic' | 'google'): Promise<string>
  }
} 