import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import { VeyraLogo } from '@/components/marketing/logo';
import { CustomerPortalNavigation } from '@/components/layout/portal-navigation';
import { getSessionFromCookie } from '@/services/platform/auth';

export const metadata = {
  title: 'Your VEYRA account',
  description: 'Manage your VEYRA account, devices, usage, and billing.',
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = getSessionFromCookie(cookieStore.toString());

  if (!session?.accessToken) redirect('/login?redirectTo=%2Fdashboard');

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200/80 bg-[#fbfbfe] px-4 py-5 lg:flex">
        <Link href="/" className="mb-9 flex items-center gap-2.5 px-2" aria-label="VEYRA home">
          <VeyraLogo size="md" />
          <span className="text-base font-bold tracking-tight">VEYRA</span>
        </Link>
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Your account</p>
        <CustomerPortalNavigation />
        <div className="mt-auto rounded-2xl border border-indigo-100 bg-white p-4 shadow-sm shadow-indigo-950/[0.03]">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800"><ShieldCheck className="h-4 w-4 text-indigo-700" /> Platform managed</div>
          <p className="mt-2 text-xs leading-5 text-slate-500">Plans, payments, device access, and usage are reported by VEYRA Platform.</p>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-64">
        <header className="sticky top-0 z-20 hidden h-16 items-center justify-between border-b border-slate-200/80 bg-white/85 px-8 backdrop-blur-xl lg:flex">
          <div><p className="text-xs font-medium text-slate-500">Customer portal</p><p className="text-sm font-semibold">Account workspace</p></div>
          <div className="flex items-center gap-4">
            <span className="max-w-64 truncate text-xs text-slate-500">{session.user?.email}</span>
            <Link href="/dashboard/settings" className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-900">Account settings <ArrowUpRight className="h-3.5 w-3.5" /></Link>
          </div>
        </header>
        <div className="border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          <Link href="/" className="flex items-center gap-2" aria-label="VEYRA home"><VeyraLogo size="sm" /><span className="text-sm font-bold">VEYRA <span className="font-medium text-slate-500">Account</span></span></Link>
        </div>
        <div className="border-b border-slate-200 bg-white lg:hidden"><CustomerPortalNavigation /></div>
        <main className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
