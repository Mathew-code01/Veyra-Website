'use client';

import { useAuth } from '@/components/auth/auth-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Info } from 'lucide-react';

export default function AdminErrors() {
  const { session } = useAuth();
  if (!session) return null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 lg:px-8 lg:py-12">
      <h1 className="text-3xl font-bold text-veyra-navy mb-6">Errors & operational status</h1>
      <div className="rounded-xl border border-border bg-card p-8">
        <CardHeader>
          <CardTitle>Operational status</CardTitle>
          <CardDescription>Platform health and error visibility.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border border-border bg-background">
              <h3 className="text-lg font-semibold text-veyra-navy mb-3">Health checks</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Platform health, readiness, and version endpoints.
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>GET /api/v1/health</li>
                <li>GET /api/v1/ready</li>
                <li>GET /api/v1/version</li>
              </ul>
            </div>
            <div className="p-6 rounded-xl border border-border bg-background">
              <h3 className="text-lg font-semibold text-veyra-navy mb-3">Audit visibility</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Admin actions are audited and viewable in the Audit logs section.
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>GET /api/v1/admin/audit</li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg border border-dashed border-amber-200 bg-amber-50 p-4">
            <h4 className="text-sm font-semibold text-amber-800 mb-2">Error visibility</h4>
            <p className="text-sm text-amber-700">
              Centralised error dashboards and operational alerting are not yet implemented in the Platform.
              Use Platform logs and audit events for troubleshooting.
            </p>
          </div>
        </CardContent>
      </div>
    </div>
  );
}


