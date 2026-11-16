'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { VeyraPlatformClient } from '@/services/platform/client';
import { userFriendlyMessage, isAuthError } from '@/services/platform/errors';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Monitor, RefreshCw, AlertTriangle, User } from 'lucide-react';

export default function DevicesPage() {
  const { session, client } = useAuth();
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!client || !session?.accessToken) return;
    const c = client as VeyraPlatformClient;
    let cancelled = false;
    const load = async () => {
      try {
        const d = await c.listDevices();
        if (!cancelled) {
          setDevices(d.devices);
        }
      } catch (err: any) {
        if (isAuthError(err)) return;
        setError(userFriendlyMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [client, session?.accessToken]);

  const revoke = async (deviceId: string) => {
    if (!window.confirm('Are you sure you want to revoke this device?')) return;
    if (!client) return;
    try {
      await client.revokeDevice(deviceId);
      setDevices(devices.filter((d) => d.id !== deviceId));
    } catch (err: any) {
      setError(userFriendlyMessage(err));
    }
  };

  if (!session) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 lg:px-8 lg:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-veyra-navy mb-2">Devices</h1>
        <p className="text-muted-foreground">
          Registered and authorised devices. Revoke access only through the Platform.
        </p>
      </div>

      {loading && (
        <div className="rounded-xl border border-border bg-card p-8 animate-pulse">
          <div className="h-10 bg-secondary/50 rounded" />
        </div>
      )}

      {!loading && devices.length === 0 && !error && (
        <div className="rounded-xl border border-dashed border-border bg-secondary/50 p-8 text-center">
          <Monitor className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-veyra-navy mb-2">No devices registered</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Register your device from the Veyra Desktop application.
          </p>
        </div>
      )}

      {!loading && devices.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="text-xs text-muted-foreground border-b border-border">
                <th className="pb-3 font-medium">Device</th>
                <th className="pb-3 font-medium">Platform</th>
                <th className="pb-3 font-medium text-center">Status</th>
                <th className="pb-3 font-medium">Last seen</th>
                <th className="pb-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {devices.map((d) => (
                <tr key={d.id} className="hover:bg-accent/50 transition-colors">
                  <td className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded bg-secondary flex items-center justify-center">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{d.deviceName || d.installationId}</p>
                        <p className="text-xs text-muted-foreground">{d.installationId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="pb-4 text-muted-foreground">{d.platform || '—'}</td>
                  <td className="pb-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                      d.isAuthorized && !d.isRevoked
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {d.isRevoked ? 'Revoked' : d.isAuthorized ? 'Authorised' : 'Pending'}
                    </span>
                  </td>
                  <td className="pb-4 text-muted-foreground">
                    {d.lastSeenAt ? new Date(d.lastSeenAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="pb-4 text-right">
                    {!d.isRevoked && (
                      <Button variant="destructive" size="sm" onClick={() => revoke(d.id)}>
                        Revoke
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 mt-6 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="mt-8 rounded-xl border border-border bg-secondary/50 p-8">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0" />
          <div>
            <h3 className="font-semibold text-veyra-navy mb-1">Device registration</h3>
            <p className="text-sm text-muted-foreground">
              Devices are registered and authorised through the Veyra Desktop application. Revocation here
              is handled by the Platform (DELETE /api/v1/devices/:id).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}



