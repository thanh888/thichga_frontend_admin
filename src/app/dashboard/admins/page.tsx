import * as React from 'react';
import type { Metadata } from 'next';
import AdminsPage from '@/pages/admins.page';

import { config } from '@/config';

export const metadata = { title: `Customers | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return <AdminsPage />;
}
