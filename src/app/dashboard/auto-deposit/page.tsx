import * as React from 'react';
import type { Metadata } from 'next';
import AutoDepositHistoryPage from '@/pages/auto-deposits.page';

import { config } from '@/config';

export const metadata = { title: `Nạp tiền | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return <AutoDepositHistoryPage />;
}
