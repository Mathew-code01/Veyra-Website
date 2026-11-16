import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import { VeyraLogo } from '@/components/marketing/logo';
import { AdminPortalNavigation } from '@/components/layout/portal-navigation';
import { getSessionFromCookie } from '@/services/platform/auth';

export const metadata = {
  title: 'VEYRA administration',
  description: 'Authorized Veyra Platform administration.',
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = getSessionFromCookie(cookieStore.toString());

  if (!session?.accessToken) redirect('/login?redirectTo=%2Fadmin');

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200/80 bg-[#fbfbfe] px-4 py-5 lg:flex">
        <Link href="/" className="mb-9 flex items-center gap-2.5 px-2" aria-label="VEYRA home">
          <VeyraLogo size="md" />
          <span className="text-base font-bold tracking-tight">VEYRA <span className="font-medium text-slate-500">Admin</span></span>
        </Link>
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Operations</p>
        <AdminPortalNavigation />
        <div className="mt-auto rounded-2xl border border-amber-200/80 bg-amber-50/70 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-900"><ShieldCheck className="h-4 w-4" /> Server-authorized</div>
          <p className="mt-2 text-xs leading-5 text-amber-800/80">Every administrative operation is checked by Platform. This navigation does not grant access.</p>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-64">
        <header className="sticky top-0 z-20 hidden h-16 items-center justify-between border-b border-slate-200/80 bg-white/85 px-8 backdrop-blur-xl lg:flex">
          <div><p className="text-xs font-medium text-slate-500">Platform operations</p><p className="text-sm font-semibold">Administration</p></div>
          <span className="max-w-64 truncate text-xs text-slate-500">{session.user?.email}</span>
        </header>
        <div className="border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          <Link href="/admin" className="flex items-center gap-2" aria-label="VEYRA admin home"><VeyraLogo size="sm" /><span className="text-sm font-bold">VEYRA <span className="font-medium text-slate-500">Admin</span></span></Link>
        </div>
        <div className="border-b border-slate-200 bg-white lg:hidden"><AdminPortalNavigation /></div>
        <main className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
