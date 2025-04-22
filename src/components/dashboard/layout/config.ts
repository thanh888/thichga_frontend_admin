import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Thống kê', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'customers', title: 'Customers', href: paths.dashboard.customers, icon: 'users' },
  { key: 'admin_account', title: 'Tài khoản admin', href: paths.dashboard.admin_account, icon: 'users' },
  { key: 'user_account', title: 'Người dùng', href: paths.dashboard.user_account, icon: 'users' },
  { key: 'bet_room', title: 'Quản lý cược', href: paths.dashboard.bet_room, icon: 'users' },
  { key: 'type_deposit', title: 'Chế độ nạp', href: paths.dashboard.type_deposit, icon: 'users' },
  { key: 'normal_deposit', title: 'Đợn nạp tiền', href: paths.dashboard.normal_deposit, icon: 'users' },
  { key: 'auto_deposit', title: 'Đơn nạp tiền tự động', href: paths.dashboard.auto_deposit, icon: 'users' },
  { key: 'withdraw', title: 'Đơn rút tiền', href: paths.dashboard.withdraw, icon: 'users' },
  { key: 'bank', title: 'Ngân hàng nạp tiền', href: paths.dashboard.bank, icon: 'users' },
  { key: 'post', title: 'Bài viết', href: paths.dashboard.post, icon: 'users' },
  { key: 'link_support', title: 'Link hỗ trợ', href: paths.dashboard.link_support, icon: 'users' },
  { key: 'banner', title: 'Banner', href: paths.dashboard.banner, icon: 'users' },
  { key: 'integrations', title: 'Integrations', href: paths.dashboard.integrations, icon: 'plugs-connected' },
  { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
  { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];
