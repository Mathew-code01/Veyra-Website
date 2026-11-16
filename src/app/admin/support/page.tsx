'use client';

import { useAuth } from '@/components/auth/auth-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Info } from 'lucide-react';

export default function AdminSupport() {
  const { session } = useAuth();
  if (!session) return null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 lg:px-8 lg:py-12">
      <h1 className="text-3xl font-bold text-veyra-navy mb-6">Support</h1>
      <div className="rounded-xl border border-border bg-card p-8">
        <CardHeader>
          <CardTitle>Support tools</CardTitle>
          <CardDescription>Customer support operations.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border border-border bg-background">
              <h3 className="text-lg font-semibold text-veyra-navy mb-3">User lookup</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Look up any user account via the Platform (admin role required).
              </p>
              <p className="text-xs text-muted-foreground">GET /api/v1/admin/users/:userId</p>
            </div>
            <div className="p-6 rounded-xl border border-border bg-background">
              <h3 className="text-lg font-semibold text-veyra-navy mb-3">Account export</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Users can request a portable export of their platform-owned data.
              </p>
              <p className="text-xs text-muted-foreground">POST /api/v1/account/export/request</p>
            </div>
          </div>
          <div className="rounded-lg border border-dashed border-amber-200 bg-amber-50 p-4">
            <h4 className="text-sm font-semibold text-amber-800 mb-2">Support capability</h4>
            <p className="text-sm text-amber-700">
              Dedicated support tooling (ticketing, impersonation controls) is not yet implemented in the
              Platform. Use the Users section for basic lookups.
            </p>
          </div>
        </CardContent>
      </div>
    </div>
  );
}


