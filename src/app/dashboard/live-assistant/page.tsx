'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { VeyraPlatformClient } from '@/services/platform/client';
import { userFriendlyMessage, isAuthError } from '@/services/platform/errors';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Watch, Mic, AlertTriangle, Info, Download, Monitor } from 'lucide-react';

export default function LiveAssistantPage() {
  const { session, client } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [entitled, setEntitled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!client || !session?.accessToken) return;
    let active = true;
    const c = client as VeyraPlatformClient;
    c.checkEntitlement('liveInterview')
      .then((r) => { if (active) setEntitled(r.entitled); })
      .catch((err: any) => { if (active) setError(userFriendlyMessage(err)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [client, session?.accessToken]);

  if (!session) return null;

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 lg:px-8 lg:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-veyra-navy mb-2">Live interview assistant</h1>
        <p className="text-muted-foreground">
          The Website can check account access. Live assistance runs in VEYRA Desktop. The Website cannot determine what is visible in your desktop windows.
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 mb-6 text-sm text-red-800">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>How live assistance works</CardTitle>
          <CardDescription>This page does not listen, capture your screen, or start a Desktop session.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <p role="status" className="rounded-lg border border-border bg-secondary/50 p-6 text-sm text-muted-foreground">Checking account access…</p>
          ) : error ? (
            <p className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">Access could not be verified. Try again after your connection is restored.</p>
          ) : !entitled ? (
            <div className="rounded-lg border border-dashed border-border bg-secondary/50 p-8 text-center">
              <AlertTriangle className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
              <h3 className="text-lg font-semibold text-veyra-navy mb-2">Live assistance not yet available</h3>
              <p className="text-sm text-muted-foreground mb-4">
                The liveInterview entitlement is not active on your account. Live assistance requires the
                Veyra Desktop application and an active plan.
              </p>
              <Link href="/pricing">
                <Button>View pricing</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="text-lg font-semibold text-veyra-navy mb-4">Use VEYRA Desktop</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  The liveInterview entitlement is active on your account. The Website cannot verify that a Desktop session is connected; check permissions and connection state in the Desktop app.
                </p>
                <Link href="/download">
                  <Button>
                    <Monitor className="mr-2 h-4 w-4" /> Download Desktop app
                  </Button>
                </Link>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-border bg-background">
                  <div className="flex items-center gap-2 mb-3">
                    <Mic className="h-4 w-4 text-veyra-indigo" />
                    <span className="text-sm font-medium">Microphone access</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Audio capture requires an explicit start and the relevant operating-system permission.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-background">
                  <div className="flex items-center gap-2 mb-3">
                    <Watch className="h-4 w-4 text-veyra-indigo" />
                    <span className="text-sm font-medium">Desktop guidance</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Suggestions appear in your Desktop workspace; visibility depends on your window and screen-sharing setup.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-8 rounded-xl border border-border bg-secondary/50 p-8">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex flex-col md:items-start">
            <Info className="h-6 w-6 mb-2 text-muted-foreground" />
            <h3 className="font-semibold text-veyra-navy mb-1">Desktop application required</h3>
            <p className="text-sm text-muted-foreground">
              Live interview listening, screen capture, and local AI inference run in the Veyra Desktop
              application — not in the browser.
            </p>
          </div>
          <Link href="/download">
            <Button>
              <Download className="mr-2 h-4 w-4" /> Download Desktop app
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}



