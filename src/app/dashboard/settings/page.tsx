'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { VeyraPlatformClient } from '@/services/platform/client';
import { userFriendlyMessage, isAuthError } from '@/services/platform/errors';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { User, Mail, AlertTriangle, Shield, LogOut } from 'lucide-react';

export default function SettingsPage() {
  const { session, client, logout } = useAuth();
  const [profile, setProfile] = useState<{ displayName?: string | null; locale: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!client || !session?.accessToken) return;
    const c = client as VeyraPlatformClient;
    c.getProfile()
      .then((r) => setProfile({ displayName: r.profile.displayName, locale: r.profile.locale }))
      .catch((err: any) => {
        if (isAuthError(err)) return;
        setError(userFriendlyMessage(err));
      });
  }, [client, session?.accessToken]);

  const onUpdate = async (formData: FormData) => {
    const displayName = formData.get('displayName') as string;
    const locale = formData.get('locale') as string;
    if (!client) return;
    try {
      await client.updateProfile({ displayName: displayName || undefined, locale: locale || undefined });
      setProfile({ displayName, locale });
      setSuccess('Profile updated.');
      setError(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(userFriendlyMessage(err));
    }
  };

  const onDelete = async (formData: FormData) => {
    const confirmPassword = formData.get('confirmPassword') as string;
    if (!window.confirm('Are you sure you want to delete your account? This cannot be undone.')) return;
    if (!client) return;
    try {
      await client.requestAccountDeletion({ reason: 'User requested', confirmPassword });
      await logout();
    } catch (err: any) {
      setError(userFriendlyMessage(err));
    }
  };

  if (!session) return null;

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 lg:px-8 lg:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-veyra-navy mb-2">Account settings</h1>
        <p className="text-muted-foreground">Manage your profile and account.</p>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 mb-6 text-sm text-red-800">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 mb-6 text-sm text-emerald-800">
          {success}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your display name and language.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={(e) => { e.preventDefault(); onUpdate(new FormData(e.currentTarget)); }} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="displayName" className="text-sm font-medium">
                Display name
              </label>
              <input
                id="displayName"
                name="displayName"
                defaultValue={profile?.displayName ?? ''}
                className="input"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="locale" className="text-sm font-medium">
                Language / locale
              </label>
              <select id="locale" name="locale" defaultValue={profile?.locale ?? 'en'} className="input">
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
            <Button type="submit">Save changes</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Email, status, and account actions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded bg-secondary flex items-center justify-center">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">{session.user?.email}</p>
                  <p className="text-xs text-muted-foreground">
                    {session.user?.emailConfirmed ? 'Verified' : 'Unverified'}
                  </p>
                </div>
              </div>
              <Link href="/reset-password" className="text-sm text-veyra-indigo hover:underline">
                Change password
              </Link>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Status</span>
              <span className="text-sm font-medium">{session.user?.emailConfirmed ? 'Active' : 'Pending verification'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6 border-destructive/20">
        <CardHeader>
          <CardTitle>Danger zone</CardTitle>
          <CardDescription>Permanent account actions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={(e) => { e.preventDefault(); onDelete(new FormData(e.currentTarget)); }} className="space-y-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 mt-0.5 text-destructive shrink-0" />
              <div>
                <h3 className="font-semibold text-veyra-navy mb-1">Delete account</h3>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and associated data. This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="input"
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" variant="destructive">
              <LogOut className="mr-2 h-4 w-4" /> Delete account
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-8 rounded-xl border border-border bg-secondary/50 p-8">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0" />
          <div>
            <h3 className="font-semibold text-veyra-navy mb-1">Security notes</h3>
            <p className="text-sm text-muted-foreground">
              Session tokens are managed in secure cookies. Your password is never stored by the Website —
              authentication is handled by Supabase Auth via the Veyra Platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}



