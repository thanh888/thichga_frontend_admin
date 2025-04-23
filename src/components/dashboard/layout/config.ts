import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Thống kê', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'customers', title: 'Customers', href: paths.dashboard.customers, icon: 'users' },
  { key: 'admin_account', title: 'Tài khoản admin', href: paths.dashboard.admin_account, icon: 'users' },
  { key: 'user_account', title: 'Người dùng', href: paths.dashboard.user_account, icon: 'users' },
  { key: 'bet_room', title: 'Quản lý cược', href: paths.dashboard.bet_room, icon: 'users' },
  { key: 'deposit_mode', title: 'Chế độ nạp', href: paths.dashboard.deposit_mode, icon: 'users' },
  { key: 'deposits', title: 'Đợn nạp tiền', href: paths.dashboard.deposits, icon: 'users' },
  { key: 'auto_deposits', title: 'Đơn nạp tiền tự động', href: paths.dashboard.auto_deposits, icon: 'users' },
  { key: 'withdraws', title: 'Đơn rút tiền', href: paths.dashboard.withdraws, icon: 'users' },
  { key: 'bank', title: 'Ngân hàng nạp tiền', href: paths.dashboard.bank, icon: 'users' },
  { key: 'posts', title: 'Bài viết', href: paths.dashboard.posts, icon: 'users' },
  { key: 'supports', title: 'Link hỗ trợ', href: paths.dashboard.supports, icon: 'users' },
  { key: 'banners', title: 'Banner', href: paths.dashboard.banners, icon: 'users' },
  { key: 'integrations', title: 'Integrations', href: paths.dashboard.integrations, icon: 'plugs-connected' },
  { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
  { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];
