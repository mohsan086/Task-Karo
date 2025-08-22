"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4 pb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-destructive/20 rounded-full mx-auto">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl font-serif">Something went wrong</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-2">
              <p className="text-muted-foreground">
                An unexpected error occurred. Please try again or contact support if the problem persists.
              </p>
              {process.env.NODE_ENV === "development" && (
                <details className="text-left text-sm bg-muted p-3 rounded-lg">
                  <summary className="cursor-pointer font-medium">Error Details</summary>
                  <pre className="mt-2 text-xs overflow-auto">{error.message}</pre>
                </details>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <Button onClick={reset} className="w-full h-11 font-medium">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button asChild variant="outline" className="w-full h-11 font-medium bg-transparent">
                <Link href="/dashboard">
                  <Home className="w-4 h-4 mr-2" />
                  Go to Dashboard
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
