export type Role = 'admin' | 'support' | 'auditor' | 'billing' | 'customer';

export const ADMIN_ROLES: Role[] = ['admin', 'support', 'auditor', 'billing'];

export const CUSTOMER_ROLES: Role[] = ['customer'];

export function isAdminRole(role: string | undefined): role is Role {
  return (ADMIN_ROLES as readonly string[]).includes(role ?? '');
}

export function hasPermission(userRole: string | undefined, required: Role[]): boolean {
  if (!userRole) return false;
  return required.includes(userRole as Role);
}
