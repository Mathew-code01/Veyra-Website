'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { VeyraPlatformClient } from '@/services/platform/client';
import { userFriendlyMessage, isAuthError, isPermissionError } from '@/services/platform/errors';
import { Button } from '@/components/ui/button';
import {
  AlertCircle,
  CheckCircle2,
  Info,
  Laptop,
  Monitor,
  Search,
  Shield,
  ShieldAlert,
  XCircle,
} from 'lucide-react';

const panel = "rounded-xl border border-[#E2E5EF] bg-white shadow-[0_12px_36px_-28px_rgba(24,32,68,0.34)]";

export default function AdminDevices() {
  const { session, client, logout } = useAuth();
  const [userId, setUserId] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [reason, setReason] = useState('Administrative session revocation');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const handleRevoke = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client || !session?.accessToken) return;
    if (!userId.trim() || !deviceId.trim()) {
      setError('Both User ID and Device ID are required.');
      return;
    }
    const c = client as VeyraPlatformClient;
    setBusy(true);
    setError(null);
    setSuccess(null);
    setPermissionError(null);
    try {
      const res = await c.adminRevokeDevice({
        userId: userId.trim(),
        deviceId: deviceId.trim(),
        reason: reason.trim() || 'Administrative session revocation',
      });
      if (res.ok) {
        setSuccess(`Device ${deviceId.trim()} has been revoked for user ${userId.trim()}.`);
        setDeviceId('');
      } else {
        setError('Device revocation could not be processed.');
      }
    } catch (err: any) {
      if (isPermissionError(err)) {
        setPermissionError('Admin role required. You do not have permission to revoke device authorization.');
      } else if (isAuthError(err)) {
        await logout();
      } else {
        setError(userFriendlyMessage(err));
      }
    } finally {
      setBusy(false);
    }
  };

  if (!session) return null;

  if (permissionError) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-amber-200 bg-amber-50/70 p-10 text-center">
        <Shield className="mx-auto mb-4 h-10 w-10 text-amber-600" />
        <h2 className="mb-2 text-xl font-bold text-[#182044]">Admin access required</h2>
        <p className="text-sm text-[#4E5A7E]">{permissionError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[.14em] text-[#6b4fe0]">Device Governance</p>
        <h1 className="mt-2 text-[28px] font-bold tracking-tight text-[#182044] sm:text-[32px]">
          Device Management &amp; Revocation
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#4E5A7E]">
          Inspect device authorizations and revoke compromised or decommissioned desktop installations.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
        >
          <XCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      {/* Revocation form */}
      <div className={`${panel} max-w-2xl p-6`}>
        <div className="flex items-center gap-2 pb-4 border-b border-[#E2E5EF]">
          <ShieldAlert size={18} className="text-[#6b4fe0]" />
          <h2 className="font-semibold text-[#182044]">Revoke Device Authorization</h2>
        </div>
        <p className="mt-2 text-xs leading-5 text-[#8891A9]">
          Revoking a device invalidates its local session and device refresh token. The installation will be blocked from Platform services until re-registered.
        </p>

        <form onSubmit={handleRevoke} className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#8891A9]">
              User ID
            </label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="e.g. usr_8f2a... or UUID"
              className="mt-1.5 h-10 w-full rounded-lg border border-[#E2E5EF] bg-white px-3 text-sm text-[#182044] outline-none font-mono placeholder:text-[#8891A9] focus:border-[#6b4fe0] focus:ring-2 focus:ring-[#6b4fe0]/20"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#8891A9]">
              Device ID to Revoke
            </label>
            <input
              type="text"
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              placeholder="e.g. dev_55a1... or hardware UUID"
              className="mt-1.5 h-10 w-full rounded-lg border border-[#E2E5EF] bg-white px-3 text-sm text-[#182044] outline-none font-mono placeholder:text-[#8891A9] focus:border-[#6b4fe0] focus:ring-2 focus:ring-[#6b4fe0]/20"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#8891A9]">
              Reason (saved to audit trail)
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for revocation"
              className="mt-1.5 h-10 w-full rounded-lg border border-[#E2E5EF] bg-white px-3 text-sm text-[#182044] outline-none placeholder:text-[#8891A9] focus:border-[#6b4fe0] focus:ring-2 focus:ring-[#6b4fe0]/20"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" disabled={busy || !userId.trim() || !deviceId.trim()}>
              {busy ? 'Revoking…' : 'Revoke device session'}
            </Button>
          </div>
        </form>
      </div>

      {/* Security notice */}
      <div className="flex items-start gap-3 rounded-xl border border-[#E2E5EF] bg-white p-4 text-xs text-[#8891A9]">
        <Info size={16} className="mt-0.5 shrink-0 text-[#6b4fe0]" />
        <p className="leading-5">
          Revocation calls are authorized server-side and recorded to the audit log. Device listing per-user is also available inside each user profile.
        </p>
      </div>
    </div>
  );
}
