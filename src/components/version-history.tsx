import { Button } from "@/components/ui/button"
import { createScriptVersion, getScriptVersions } from "@/lib/db"
import { ScriptVersion } from "@/types/database"
import { format } from "date-fns"
import { revalidatePath } from "next/cache"

interface VersionHistoryProps {
  scriptId: string
  currentVersion: number
}

export async function VersionHistory({ scriptId, currentVersion }: VersionHistoryProps) {
  const versions = await getScriptVersions(scriptId)

  async function createVersion() {
    "use server"
    await createScriptVersion(scriptId)
    revalidatePath(`/scripts/${scriptId}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Version History</h3>
        <form action={createVersion}>
          <Button type="submit">Create New Version</Button>
        </form>
      </div>

      <div className="space-y-2">
        {versions.map((version: ScriptVersion) => (
          <div
            key={version.id}
            className={`p-3 border rounded-lg ${
              version.version_number === currentVersion
                ? "border-primary bg-primary/5"
                : "hover:bg-accent/50 cursor-pointer"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">Version {version.version_number}</span>
                <p className="text-sm text-muted-foreground">
                  Created {format(new Date(version.created_at), "MMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
              {version.version_number === currentVersion && (
                <span className="text-sm text-primary">Current</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 