export const metadata = {
  title: 'Sign in',
  description: 'Sign in to your VEYRA account.',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background px-4">{children}</div>;
}
