import { UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { getScript } from "@/lib/db"
import { notFound } from "next/navigation"
import Link from "next/link"
import { VersionHistory } from "@/components/version-history"
import { ExportButton } from "@/components/ExportButton"

export default async function ScriptPage({ params }: { params: { id: string } }) {
  const script = await getScript(params.id)
  
  if (!script) {
    notFound()
  }

  // Combine all script blocks into a single string
  const scriptContent = script.script_blocks
    ?.map(block => block.content)
    .join('\n\n') || ''

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-xl font-bold">{script.title}</h1>
          <div className="flex items-center gap-4">
            <ExportButton content={scriptContent} title={script.title} />
            <Button variant="outline" asChild>
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>
      
      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-2">Product Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Product Name</h3>
                  <p>{script.product_name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Target Audience</h3>
                  <p>{script.target_audience}</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-2">Key Features</h2>
              <p className="whitespace-pre-wrap">{script.features}</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Script Blocks</h2>
              {script.script_blocks?.length === 0 ? (
                <p className="text-muted-foreground">No blocks yet. Start adding blocks to build your script.</p>
              ) : (
                <div className="space-y-4">
                  {script.script_blocks?.map((block) => (
                    <div key={block.id} className="p-4 border rounded-lg">
                      <p className="whitespace-pre-wrap">{block.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <VersionHistory scriptId={params.id} currentVersion={script.current_version || 1} />
          </div>
        </div>
      </main>
    </div>
  )
} 