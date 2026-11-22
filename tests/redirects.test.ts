import { describe, it, expect } from 'vitest';
import { isTrustedRedirect, getSafeRedirect } from '@/lib/security/redirects';

describe('redirect validation', () => {
  it('allows relative allowlisted paths', () => {
    expect(isTrustedRedirect('/dashboard')).toBe(true);
    expect(isTrustedRedirect('/')).toBe(true);
    expect(isTrustedRedirect('/login')).toBe(true);
    expect(isTrustedRedirect('/register')).toBe(true);
    expect(isTrustedRedirect('/callback')).toBe(true);
    expect(isTrustedRedirect('/reset-password')).toBe(true);
  });

  it('rejects relative paths not in allowlist', () => {
    expect(isTrustedRedirect('/admin')).toBe(false);
    expect(isTrustedRedirect('/settings')).toBe(false);
  });

  it('rejects absolute external URLs', () => {
    expect(isTrustedRedirect('https://evil.com')).toBe(false);
    expect(isTrustedRedirect('//evil.com')).toBe(false);
  });

  it('allows an absolute URL on the configured application origin', () => {
    expect(isTrustedRedirect('http://localhost:5173/dashboard')).toBe(true);
    expect(isTrustedRedirect('http://localhost:51730/dashboard')).toBe(false);
    expect(isTrustedRedirect('http://localhost:3001/dashboard')).toBe(false);
  });

  it('rejects protocol-relative and javascript URLs', () => {
    expect(isTrustedRedirect('javascript:alert(1)')).toBe(false);
    expect(isTrustedRedirect('data:text/html,<script>')).toBe(false);
  });

  it('falls back to safe default for untrusted redirects', () => {
    expect(getSafeRedirect('https://evil.com', '/')).toBe('/');
    expect(getSafeRedirect(null, '/dashboard')).toBe('/dashboard');
    expect(getSafeRedirect('/dashboard', '/')).toBe('/dashboard');
  });
});
