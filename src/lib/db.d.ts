import { Script, ScriptBlock } from "@/types/database"

declare module "@/lib/db" {
  export function getScripts(): Promise<Script[]>
  export function getScript(id: string): Promise<Script | null>
  export function createScriptBlock(scriptId: string, content: string): Promise<ScriptBlock>
  export function updateScriptBlock(id: string, content: string): Promise<ScriptBlock>
  export function deleteScriptBlock(id: string): Promise<void>
} 