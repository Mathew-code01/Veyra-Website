'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity, Bell, CreditCard, Database, FileClock, Gauge,
  LayoutDashboard, LifeBuoy, Monitor, PackageCheck, Receipt, Settings2,
  ShieldCheck, Users, WalletCards, Workflow,
} from 'lucide-react';

const customerLinks = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
  { href: '/dashboard/credits', label: 'Usage & credits', icon: Activity },
  { href: '/dashboard/devices', label: 'Devices', icon: Monitor },
  { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
  { href: '/dashboard/settings', label: 'Account settings', icon: Settings2 },
];

const adminLinks = [
  { href: '/admin', label: 'Overview', icon: Gauge },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/subscriptions', label: 'Subscriptions', icon: WalletCards },
  { href: '/admin/payments', label: 'Payments', icon: Receipt },
  { href: '/admin/credits', label: 'Credits & usage', icon: Activity },
  { href: '/admin/devices', label: 'Devices', icon: Monitor },
  { href: '/admin/plans', label: 'Plans & pricing', icon: CreditCard },
  { href: '/admin/models', label: 'Model catalogue', icon: Database },
  { href: '/admin/releases', label: 'Desktop releases', icon: PackageCheck },
  { href: '/admin/notifications', label: 'Notifications', icon: Bell },
  { href: '/admin/roles', label: 'Roles & permissions', icon: ShieldCheck },
  { href: '/admin/audit', label: 'Audit logs', icon: FileClock },
  { href: '/admin/support', label: 'Support', icon: LifeBuoy },
  { href: '/admin/errors', label: 'Errors', icon: Workflow },
];

function PortalNav({ kind }: { kind: 'customer' | 'admin' }) {
  const pathname = usePathname();
  const links = kind === 'admin' ? adminLinks : customerLinks;

  return (
    <>
      <nav aria-label={kind === 'admin' ? 'Administration' : 'Account'} className="hidden space-y-1 lg:block">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/dashboard' && href !== '/admin' && pathname.startsWith(`${href}/`));
          return (
            <Link key={href} href={href} aria-current={active ? 'page' : undefined}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${active ? 'bg-indigo-50 text-indigo-800 ring-1 ring-indigo-100' : 'text-slate-600 hover:bg-white hover:text-slate-950'}`}>
              <Icon className={`h-4 w-4 ${active ? 'text-indigo-700' : 'text-slate-400 group-hover:text-indigo-600'}`} strokeWidth={1.8} />
              {label}
            </Link>
          );
        })}
      </nav>
      <nav aria-label={`${kind} navigation`} className="flex gap-2 overflow-x-auto px-4 py-3 lg:hidden">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/dashboard' && href !== '/admin' && pathname.startsWith(`${href}/`));
          return (
            <Link key={href} href={href} aria-current={active ? 'page' : undefined}
              className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl border px-3 text-xs font-medium ${active ? 'border-indigo-200 bg-indigo-50 text-indigo-800' : 'border-slate-200 bg-white text-slate-600'}`}>
              <Icon className="h-4 w-4" strokeWidth={1.8} />{label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export function CustomerPortalNavigation() { return <PortalNav kind="customer" />; }
export function AdminPortalNavigation() { return <PortalNav kind="admin" />; }
