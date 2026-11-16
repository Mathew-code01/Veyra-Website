'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { VeyraPlatformClient } from '@/services/platform/client';
import { userFriendlyMessage, isAuthError } from '@/services/platform/errors';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Watch, Play, AlertTriangle, Info } from 'lucide-react';

export default function PracticePage() {
  const { session, client } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [entitled, setEntitled] = useState<boolean | null>(null);

  useEffect(() => {
    if (!client || !session?.accessToken) return;
    const c = client as VeyraPlatformClient;
    c.checkEntitlement('practice')
      .then((r) => setEntitled(r.entitled))
      .catch((err: any) => setError(userFriendlyMessage(err)));
  }, [client, session?.accessToken]);

  if (!session) return null;

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 lg:px-8 lg:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-veyra-navy mb-2">Interview practice</h1>
        <p className="text-muted-foreground">
          Prepare for interviews with simulated sessions and AI feedback.
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 mb-6 text-sm text-red-800">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Practice mode</CardTitle>
          <CardDescription>Simulated interviews tailored to your target role.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!entitled ? (
            <div className="rounded-lg border border-dashed border-border bg-secondary/50 p-8 text-center">
              <AlertTriangle className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
              <h3 className="text-lg font-semibold text-veyra-navy mb-2">Practice not yet available</h3>
              <p className="text-sm text-muted-foreground mb-4">
                The practice entitlement is not active on your account. Practice runs in the Veyra Desktop
                application and requires an active plan with the <code className="text-xs bg-background px-1.5 py-0.5 rounded">practice</code> capability.
              </p>
              <Link href="/pricing">
                <Button>View pricing</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="text-lg font-semibold text-veyra-navy mb-4">Start a practice session</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Practice sessions are launched from the Veyra Desktop application. Download the app to begin.
                </p>
                <Link href="/download">
                  <Button>
                    <Play className="mr-2 h-4 w-4" /> Download Desktop app
                  </Button>
                </Link>
              </div>
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="text-lg font-semibold text-veyra-navy mb-4">What to expect</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <Info className="h-4 w-4 mt-0.5 shrink-0 text-veyra-indigo" />
                    <span>AI-generated questions tailored to your target role</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Info className="h-4 w-4 mt-0.5 shrink-0 text-veyra-indigo" />
                    <span>Feedback on clarity, structure, and impact of your answers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Info className="h-4 w-4 mt-0.5 shrink-0 text-veyra-indigo" />
                    <span>Answer improvement suggestions and progress tracking</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-8 rounded-xl border border-border bg-secondary/50 p-8 text-center">
        <Watch className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
        <h3 className="text-lg font-semibold text-veyra-navy mb-2">Practice runs in the Desktop app</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Interview practice is a Desktop capability. VEYRA does not run a website-based practice engine.
        </p>
        <Link href="/download">
          <Button>Download Desktop app</Button>
        </Link>
      </div>
    </div>
  );
}



