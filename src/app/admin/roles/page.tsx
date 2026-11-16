'use client';

import { useAuth } from '@/components/auth/auth-provider';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertTriangle, Info } from 'lucide-react';

export default function AdminRoles() {
  const { session, client } = useAuth();

  if (!session) return null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 lg:px-8 lg:py-12">
      <h1 className="text-3xl font-bold text-veyra-navy mb-6">Roles & permissions</h1>
      <div className="rounded-xl border border-border bg-card p-8">
        <CardHeader>
          <CardTitle>Admin roles</CardTitle>
          <CardDescription>Server-side role-based access control.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 rounded-lg border border-border bg-secondary/50">
              <h3 className="text-sm font-semibold text-veyra-navy mb-2">Roles</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>admin — full administrative access</li>
                <li>support — user lookup and support operations</li>
                <li>auditor — audit log access</li>
                <li>billing — credit adjustment and payments</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg border border-border bg-secondary/50">
              <h3 className="text-sm font-semibold text-veyra-navy mb-2">Enforcement</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>Roles verified server-side by the Platform</li>
                <li>Never granted by frontend state or email</li>
                <li>Every sensitive admin action is audited</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 rounded-lg border border-dashed border-amber-200 bg-amber-50 p-4">
            <h4 className="text-sm font-semibold text-amber-800 mb-2">Role assignment</h4>
            <p className="text-sm text-amber-700">
              The Platform has no admin roles seeded yet. The first administrator must be created directly
              in the Platform database before admin operations can be performed.
            </p>
          </div>
        </CardContent>
      </div>

      {client && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Assign role</CardTitle>
            <CardDescription>Assign an admin role to a user.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Role assignment uses POST /api/v1/account/admin/roles/assign (admin role required).
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


