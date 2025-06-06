import * as React from 'react';
import type { Metadata } from 'next';
import HomePage from '@/pages/dashboard.page';

import { config } from '@/config';

export const metadata = { title: `Overview | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return <HomePage />;
}
