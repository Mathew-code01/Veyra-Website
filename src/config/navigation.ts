import { NAV_LINKS } from './site';

export const navigation = {
  main: NAV_LINKS,
  auth: [
    { href: '/login', label: 'Sign in' },
    { href: '/register', label: 'Get started' },
  ],
} as const;
