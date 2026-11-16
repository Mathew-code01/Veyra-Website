// Shared TypeScript types used across the Website.
// Platform contract types are imported from the Platform SDK layer where available.

export type ViewState = 'idle' | 'loading' | 'success' | 'error';

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
}

export interface ApiError {
  code: string;
  message: string;
  status: number;
  requestId?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string | null;
  locale: string;
  status: string;
  createdAt: string;
}

export interface Subscription {
  id: string;
  planId: string;
  planName: string;
  billingInterval: 'monthly' | 'yearly';
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  canceledAt?: string | null;
  trialStart?: string | null;
  trialEnd?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Plan {
  id: string;
  name: string;
  family: 'local' | 'hybrid' | 'cloud';
  description?: string | null;
  billingInterval: 'monthly' | 'yearly';
  priceCents: number;
  currency: string;
  features: Record<string, boolean>;
  deviceLimit: number;
  isActive: boolean;
  createdAt: string;
  isDevFixture?: boolean;
}

export interface Device {
  id: string;
  installationId: string;
  deviceName?: string | null;
  platform?: string | null;
  isAuthorized: boolean;
  isRevoked: boolean;
  lastSeenAt?: string | null;
  createdAt: string;
}

export interface CreditBalance {
  balanceCents: number;
  currency: string;
}

export interface Entitlement {
  capability: string;
  entitled: boolean;
  reason?: string | null;
  expiresAt?: string | null;
}

export interface NotificationItem {
  id: string;
  title: string;
  body?: string | null;
  read: boolean;
  createdAt: string;
  category?: string | null;
}

export interface ReleaseInfo {
  id: string;
  channelId: string;
  channelIdText: string;
  version: string;
  platform: 'windows' | 'macos' | 'linux';
  architecture: 'x64' | 'arm64';
  minSupportedVersion?: string | null;
  isMandatory: boolean;
  rolloutPercentage: number;
  releaseNotes?: string | null;
  isRollbackCompatible: boolean;
  createdAt: string;
}

export interface ReleaseAsset {
  id: string;
  assetId: string;
  assetType: 'installer' | 'checksum' | 'signature';
  packageUrl: string;
  packageHashSha256: string;
  packageSizeBytes?: number | null;
  signedMetadata?: string | null;
  createdAt: string;
}

export interface OAuthProviderStatus {
  provider: 'google' | 'github';
  configured: boolean;
}
