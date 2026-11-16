// Platform API endpoint constants (single source of truth for paths)
// All paths are verified against the Platform route implementations under
// veyra-platform/apps/api/src/modules/*

export const API_VERSION = 'v1';

export const API_PATHS = {
  // Health (no auth)
  health: '/api/v1/health',
  ready: '/api/v1/ready',
  version: '/api/v1/version',

  // Auth
  authRegister: '/api/v1/auth/register',
  authLogin: '/api/v1/auth/login',
  authLogout: '/api/v1/auth/logout',
  authRefresh: '/api/v1/auth/refresh',
  authPasswordRecovery: '/api/v1/auth/password-recovery',
  authMe: '/api/v1/auth/me',
  authOAuthProviders: '/api/v1/auth/oauth/providers',
  authOAuthAuthorize: '/api/v1/auth/oauth/authorize',
  authOAuthCallback: '/api/v1/auth/oauth/callback',
  authOAuthLink: '/api/v1/auth/oauth/link',

  // Devices
  devicesRegister: '/api/v1/devices/register',
  devicesList: '/api/v1/devices',
  devicesAuthorize: (deviceId: string) => `/api/v1/devices/${deviceId}/authorize`,
  devicesRevoke: (deviceId: string) => `/api/v1/devices/${deviceId}`,
  devicesLastSeen: (deviceId: string) => `/api/v1/devices/${deviceId}/last-seen`,
  devicesReplace: (deviceId: string) => `/api/v1/devices/${deviceId}/replace`,
  devicesRevokeSessions: (deviceId: string) => `/api/v1/devices/${deviceId}/sessions/revoke`,

  // Entitlements
  entitlementsCheck: '/api/v1/entitlements/check',
  entitlementsList: '/api/v1/entitlements',
  entitlementsSnapshot: '/api/v1/entitlements/snapshot',
  entitlementsSnapshotVerify: '/api/v1/entitlements/snapshot/verify',

  // Plans
  plansList: '/api/v1/plans',
  plansGet: (planId: string) => `/api/v1/plans/${planId}`,

  // Subscriptions
  subscriptionsCurrent: '/api/v1/subscriptions/current',
  subscriptionsCreate: '/api/v1/subscriptions',
  subscriptionsCancel: '/api/v1/subscriptions/cancel',
  subscriptionsReactivate: '/api/v1/subscriptions/reactivate',

  // Payments
  paymentsCheckout: '/api/v1/payments/checkout',
  paymentsHistory: '/api/v1/payments/history',
  paymentsWebhook: '/api/v1/payments/webhook',
  paymentsReconcile: '/api/v1/payments/reconcile',

  // Credits
  creditsBalance: '/api/v1/credits/balance',
  creditsReserve: '/api/v1/credits/reserve',
  creditsSettle: '/api/v1/credits/settle',
  creditsRelease: '/api/v1/credits/release',
  usageHistory: '/api/v1/usage',

  // Modules
  modulesList: '/api/v1/modules',
  modulesVersions: (moduleId: string) => `/api/v1/modules/${moduleId}/versions`,

  // Downloads
  downloadsAuthorize: '/api/v1/downloads/authorize',
  downloadsVerify: '/api/v1/downloads/authorize/verify',
  downloadsMarkUsed: '/api/v1/downloads/authorize/mark-used',
  downloadsAudit: '/api/v1/downloads/audit',

  // Releases
  releasesCheck: '/api/v1/releases/check',
  releasesChannels: '/api/v1/releases/channels',
  releasesList: '/api/v1/releases',

  // AI
  aiInvoke: '/api/v1/ai/invoke',
  aiModels: '/api/v1/ai/models',

  // Pricing
  pricingCountries: '/api/v1/pricing/countries',
  pricingCountryCurrencies: (country: string) => `/api/v1/pricing/countries/${country}/currencies`,
  pricingPlans: '/api/v1/pricing/plans',
  pricingDetect: '/api/v1/pricing/detect',

  // Notifications
  notificationsTest: '/api/v1/notifications/notify/test',
  notificationsStatus: '/api/v1/notifications/status',

  // Backups / Consent
  backupsMetadata: (category: string) => `/api/v1/backups/${category}`,
  consentRecord: (category: string) => `/api/v1/consent/${category}`,

  // Account
  accountStatus: '/api/v1/account/status',
  accountDeletionRequest: '/api/v1/account/deletion/request',
  accountExportRequest: '/api/v1/account/export/request',
  accountAdminRolesList: (userId: string) => `/api/v1/account/admin/users/${userId}/roles`,
  accountAdminRolesAssign: '/api/v1/account/admin/roles/assign',
  accountAdminRolesRevoke: '/api/v1/account/admin/roles/revoke',

  // Admin
  adminLookupUser: (userId: string) => `/api/v1/admin/users/${userId}`,
  adminAdjustCredits: '/api/v1/admin/credits/adjust',
  adminRevokeDevice: '/api/v1/admin/devices/revoke',
  adminAudit: '/api/v1/admin/audit',
  adminListUsers: '/api/v1/admin/users',
  adminGetSubscription: (userId: string) => `/api/v1/admin/users/${userId}/subscription`,
  adminListPayments: '/api/v1/admin/payments',
  adminStats: '/api/v1/admin/stats',
} as const;
