'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { VeyraPlatformClient } from '@/services/platform/client';
import { userFriendlyMessage, isAuthError, isPermissionError } from '@/services/platform/errors';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Monitor, AlertTriangle, Shield, Info } from 'lucide-react';

export default function AdminDevices() {
  const { session, client } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  useEffect(() => {
    if (!client || !session?.accessToken) return;
    const c = client as VeyraPlatformClient;
    c.adminStats()
      .then(() => {})
      .catch((err: any) => {
        if (isPermissionError(err)) setPermissionError('Admin role required for device revocation.');
        else if (!isAuthError(err)) setError(userFriendlyMessage(err));
      })
      .finally(() => setLoading(false));
  }, [client, session?.accessToken]);

  if (!session) return null;

  if (permissionError) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12 lg:px-8 lg:py-16">
        <div className="rounded-xl border border-dashed border-amber-200 bg-amber-50 p-8 text-center">
          <Shield className="h-8 w-8 mx-auto mb-4 text-amber-600" />
          <h2 className="text-xl font-bold text-veyra-navy mb-2">Admin access required</h2>
          <p className="text-sm text-muted-foreground">{permissionError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 lg:px-8 lg:py-12">
      <h1 className="text-3xl font-bold text-veyra-navy mb-6">Devices</h1>
      {loading && <div className="h-32 bg-secondary/50 rounded-xl animate-pulse" />}
      {!loading && permissionError && (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">{permissionError}</div>
      )}
      {!loading && !permissionError && (
        <div className="rounded-xl border border-dashed border-border bg-secondary/50 p-8 text-center">
          <Monitor className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-veyra-navy mb-2">Device management</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Device revocation is available via the Platform (admin role). Device listing per-user is available
            in the customer dashboard.
          </p>
        </div>
      )}
      {error && <div className="rounded-md border border-red-200 bg-red-50 p-4 mt-6 text-sm text-red-800">{error}</div>}
    </div>
  );
}



