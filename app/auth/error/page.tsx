import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertCircle, CheckCircle } from "lucide-react"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  const params = await searchParams

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
            <CheckCircle className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground font-serif">Task-Karo</h1>
        </div>

        <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4 pb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-destructive/20 rounded-full mx-auto">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl font-serif">Authentication Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-2">
              {params?.error ? (
                <p className="text-sm text-muted-foreground">Error: {params.error}</p>
              ) : (
                <p className="text-sm text-muted-foreground">An authentication error occurred. Please try again.</p>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <Button asChild className="w-full h-11 font-medium">
                <Link href="/auth/login">Try signing in again</Link>
              </Button>
              <Button asChild variant="outline" className="w-full h-11 font-medium bg-transparent">
                <Link href="/auth/sign-up">Create new account</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
