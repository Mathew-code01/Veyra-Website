import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '@/app/(auth)/login/page';
import { AuthProvider } from '@/components/auth/auth-provider';

vi.mock('@/app/(auth)/actions', () => ({
  loginAction: vi.fn(async (fd: FormData) => ({ error: null as any })),
}));

import { loginAction } from '@/app/(auth)/actions';

type LoginAction = typeof loginAction;

const renderWithAuth = (ui: React.ReactElement) =>
  render(<AuthProvider>{ui}</AuthProvider>);

describe('login flow', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(loginAction).mockResolvedValue({ error: null } as any);
  });

  it('submits email and password to the login action', async () => {
    const user = userEvent.setup();
    renderWithAuth(<LoginPage />);

    await user.type(screen.getByLabelText(/email address/i, { selector: 'input' }), 'user@example.com');
    await user.type(screen.getByLabelText(/password/i, { selector: 'input' }), 'password123');

    const btns = Array.from(document.querySelectorAll('button')).filter(
      (b) => b.textContent?.trim() === 'Sign in',
    );
    const btn = btns[btns.length - 1] as HTMLButtonElement;
    await user.click(btn);

    expect(loginAction).toHaveBeenCalled();
    const fd = vi.mocked(loginAction).mock.calls[0]![0]! as FormData;
    expect(fd!.get('email')).toBe('user@example.com');
    expect(fd!.get('password')).toBe('password123');
  });

  it('calls the login action with wrong credentials', async () => {
    vi.mocked(loginAction).mockResolvedValue({ error: 'Invalid email or password.' });
    const fd = new FormData();
    fd.append('email', 'user@example.com');
    fd.append('password', 'wrong');
    await loginAction(fd);
    expect(loginAction).toHaveBeenCalled();
    const last = vi.mocked(loginAction).mock.calls[vi.mocked(loginAction).mock.calls.length - 1]![0]! as FormData;
    expect(last!.get('email')).toBe('user@example.com');
    expect(last!.get('password')).toBe('wrong');
  });
});
