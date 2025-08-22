import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Mail, CheckCircle } from "lucide-react"

export default function SignUpSuccessPage() {
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/20 rounded-full mx-auto">
              <Mail className="w-8 h-8 text-secondary" />
            </div>
            <CardTitle className="text-2xl font-serif">Check your email</CardTitle>
            <CardDescription className="text-base">
              We've sent you a confirmation link to verify your account
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Click the link in your email to activate your account and start managing your tasks.
              </p>
              <p className="text-sm text-muted-foreground">
                Didn't receive the email? Check your spam folder or try signing up again.
              </p>
            </div>
            <Button asChild className="w-full h-11 font-medium">
              <Link href="/auth/login">Return to sign in</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
