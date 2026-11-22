import { generateCsrfToken } from '@/lib/security/csrf';

export async function GET() {
  const token = await generateCsrfToken();
  return Response.json({ token });
}