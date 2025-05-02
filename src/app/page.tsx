import { SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">VSL Flow</h1>
        <p className="text-center mb-8 text-lg">
          AI-powered Video Sales Letter Script Generator
        </p>
        
        <div className="flex justify-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="default">Sign In</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button variant="outline">Sign Up</Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Button variant="default" asChild>
              <a href="/dashboard">Go to Dashboard</a>
            </Button>
          </SignedIn>
        </div>
      </div>
    </div>
  )
}
