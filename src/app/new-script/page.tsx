'use client'

import { UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { createScript } from "@/lib/db"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { useState } from "react"

export default function NewScript() {
  const router = useRouter()
  const { user } = useUser()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user) return

    setIsSubmitting(true)
    const formData = new FormData(event.currentTarget)
    
    try {
      const script = await createScript({
        user_id: user.id,
        title: formData.get('title') as string,
        product_name: formData.get('product-name') as string,
        features: formData.get('features') as string,
        target_audience: formData.get('target-audience') as string,
      })

      router.push(`/scripts/${script.id}`)
    } catch (error) {
      console.error('Failed to create script:', error)
      alert('Failed to create script. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-xl font-bold">New Script</h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <a href="/dashboard">Back to Dashboard</a>
            </Button>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>
      
      <main className="container py-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Create Your VSL Script</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Script Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter a title for your script"
              />
            </div>

            <div>
              <label htmlFor="product-name" className="block text-sm font-medium mb-2">
                Product Name
              </label>
              <input
                type="text"
                id="product-name"
                name="product-name"
                required
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter your product name"
              />
            </div>
            
            <div>
              <label htmlFor="features" className="block text-sm font-medium mb-2">
                Key Features
              </label>
              <textarea
                id="features"
                name="features"
                required
                className="w-full px-3 py-2 border rounded-md"
                rows={4}
                placeholder="List the main features of your product"
              />
            </div>
            
            <div>
              <label htmlFor="target-audience" className="block text-sm font-medium mb-2">
                Target Audience
              </label>
              <textarea
                id="target-audience"
                name="target-audience"
                required
                className="w-full px-3 py-2 border rounded-md"
                rows={4}
                placeholder="Describe your ideal customer"
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Script'}
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
} 