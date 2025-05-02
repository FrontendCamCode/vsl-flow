import { UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { getScripts } from "@/lib/db"
import Link from "next/link"

export default async function Dashboard() {
  const scripts = await getScripts()

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-xl font-bold">My Scripts</h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/settings">Settings</Link>
            </Button>
            <Button asChild>
              <Link href="/new-script">New Script</Link>
            </Button>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>
      
      <main className="container py-8">
        {scripts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">No scripts yet</h2>
            <p className="text-muted-foreground mb-6">
              Create your first script to get started
            </p>
            <Button asChild>
              <Link href="/new-script">Create New Script</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scripts.map((script) => (
              <div key={script.id} className="border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-2">{script.title}</h2>
                <p className="text-muted-foreground mb-4">{script.product_name}</p>
                <div className="flex gap-2">
                  <Button variant="outline" asChild>
                    <Link href={`/scripts/${script.id}`}>View</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href={`/scripts/${script.id}/edit`}>Edit</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
} 