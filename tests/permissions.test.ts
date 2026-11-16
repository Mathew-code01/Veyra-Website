import { describe, it, expect } from 'vitest';
import { isAdminRole, hasPermission, ADMIN_ROLES, CUSTOMER_ROLES } from '@/lib/security/permissions';

describe('permissions', () => {
  it('identifies admin roles', () => {
    expect(isAdminRole('admin')).toBe(true);
    expect(isAdminRole('billing')).toBe(true);
    expect(isAdminRole('customer')).toBe(false);
    expect(isAdminRole(undefined)).toBe(false);
  });

  it('grants permission when role matches', () => {
    expect(hasPermission('admin', ['admin', 'billing'])).toBe(true);
    expect(hasPermission('billing', ['admin', 'billing'])).toBe(true);
    expect(hasPermission('customer', ['admin', 'billing'])).toBe(false);
    expect(hasPermission(undefined, ['admin'])).toBe(false);
  });

  it('lists known role sets', () => {
    expect(ADMIN_ROLES).toContain('admin');
    expect(CUSTOMER_ROLES).toContain('customer');
    expect(ADMIN_ROLES).not.toContain('customer');
  });
});
