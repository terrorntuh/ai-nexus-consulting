import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';

export default function AdminLayout({ children }: { children: ReactNode }) {
  if (!process.env.NEXT_PUBLIC_DEMO_ADMIN_CODE) {
    notFound();
  }

  return children;
}
