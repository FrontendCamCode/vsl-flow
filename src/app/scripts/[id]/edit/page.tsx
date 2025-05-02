import { UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { getScript, createScriptBlock, updateScriptBlock, deleteScriptBlock } from "@/lib/db"
import { notFound } from "next/navigation"
import Link from "next/link"
import { revalidatePath } from "next/cache"
import { ScriptBlock } from "@/types/database"
import { ExportButton } from "@/components/ExportButton"

export default async function EditScriptPage({ params }: { params: { id: string } }) {
  const script = await getScript(params.id)
  
  if (!script) {
    notFound()
  }

  // Combine all script blocks into a single string
  const scriptContent = script.script_blocks
    ?.map(block => block.content)
    .join('\n\n') || ''

  async function addBlock(formData: FormData) {
    "use server"
    
    const content = formData.get("content") as string
    const prompt = formData.get("prompt") as string
    const model = formData.get("model") as string

    if (!content && !prompt) return

    let blockContent = content
    if (prompt) {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scriptId: params.id, prompt, model })
      })
      
      if (!response.ok) {
        throw new Error('Failed to generate text')
      }
      
      const { text } = await response.json()
      blockContent = text
    }

    await createScriptBlock(params.id, blockContent)
    revalidatePath(`/scripts/${params.id}/edit`)
  }

  async function updateBlock(formData: FormData) {
    "use server"
    
    const blockId = formData.get("blockId") as string
    const content = formData.get("content") as string
    if (!blockId || !content) return

    await updateScriptBlock(blockId, content)
    revalidatePath(`/scripts/${params.id}/edit`)
  }

  async function removeBlock(formData: FormData) {
    "use server"
    
    const blockId = formData.get("blockId") as string
    if (!blockId) return

    await deleteScriptBlock(blockId)
    revalidatePath(`/scripts/${params.id}/edit`)
  }

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-xl font-bold">Edit {script.title}</h1>
          <div className="flex items-center gap-4">
            <ExportButton content={scriptContent} title={script.title} />
            <Button variant="outline" asChild>
              <Link href={`/scripts/${params.id}`}>View Script</Link>
            </Button>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>
      
      <main className="container py-8">
        <div className="max-w-4xl mx-auto">
          <form action={addBlock} className="mb-8">
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="content" className="block text-sm font-medium mb-2">
                  Add New Block
                </label>
                <textarea
                  id="content"
                  name="content"
                  rows={4}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter your script block content..."
                />
              </div>
              
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium mb-2">Or Generate with AI</h3>
                <div className="flex flex-col gap-2">
                  <textarea
                    name="prompt"
                    rows={3}
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter a prompt for AI generation..."
                  />
                  <select
                    name="model"
                    className="w-full p-2 border rounded-md"
                    defaultValue="openai"
                  >
                    <option value="openai">OpenAI GPT-4</option>
                    <option value="anthropic">Anthropic Claude</option>
                    <option value="google">Google Gemini</option>
                  </select>
                </div>
              </div>
              
              <Button type="submit">Add Block</Button>
            </div>
          </form>

          <div className="space-y-4">
            {script.script_blocks?.map((block: ScriptBlock) => (
              <form key={block.id} action={updateBlock} className="p-4 border rounded-lg">
                <input type="hidden" name="blockId" value={block.id} />
                <textarea
                  name="content"
                  rows={4}
                  className="w-full p-2 border rounded-md mb-2"
                  defaultValue={block.content}
                  required
                />
                <div className="flex gap-2">
                  <Button type="submit">Update</Button>
                  <Button
                    type="submit"
                    formAction={removeBlock}
                    variant="destructive"
                  >
                    Delete
                  </Button>
                </div>
              </form>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
} 