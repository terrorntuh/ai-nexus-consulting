import Link from 'next/link';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Navbar } from '@/components/Navbar';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="min-h-screen bg-paper text-ink">
      <Navbar />

      <section className="mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-6 pb-20 pt-32 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="max-w-xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-coral">Client Portal</p>
          <h1 className="mt-4 text-5xl font-semibold leading-none md:text-7xl">
            Secure workspace for active AI projects.
          </h1>
          <p className="mt-6 text-lg leading-8 text-ink/64">
            Access roadmaps, workflow notes, project files, and review checkpoints once
            your AI Nexus engagement is active.
          </p>
        </div>

        <div className="mx-auto w-full max-w-md rounded-md border border-ink/12 bg-white p-6 shadow-2xl shadow-ink/8">
          <div className="mb-7 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-blueprint/15 bg-blueprint/8">
              <Shield className="h-6 w-6 text-blueprint" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-ink">Client Portal Login</h2>
              <p className="mt-1 text-sm text-ink/54">Invitation-only access.</p>
            </div>
          </div>

          {error && (
            <div className="mb-5 rounded-md border border-red-500/20 bg-red-500/8 p-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          <form action="/auth/login" method="post" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-black uppercase tracking-[0.16em] text-ink/50">
                Business Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="exec@company.com"
                className="h-12 rounded-md border-ink/12 bg-paper text-ink placeholder:text-ink/34"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-black uppercase tracking-[0.16em] text-ink/50">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Password"
                className="h-12 rounded-md border-ink/12 bg-paper text-ink placeholder:text-ink/34"
              />
            </div>

            <Button type="submit" className="h-12 w-full rounded-md bg-ink font-bold text-white hover:bg-blueprint">
              Sign in
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-ink/10" />
            <span className="text-xs font-black uppercase tracking-[0.14em] text-ink/36">
              Or continue with
            </span>
            <span className="h-px flex-1 bg-ink/10" />
          </div>

          <form action="/auth/google" method="get">
            <Button
              type="submit"
              variant="outline"
              className="h-12 w-full rounded-md border-ink/12 bg-white font-bold text-ink hover:bg-stone"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>
          </form>

          <p className="mt-6 text-center text-xs leading-6 text-ink/48">
            Need access?{' '}
            <Link href="/#contact" className="font-bold text-blueprint hover:underline">
              Contact the AI Nexus team
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
