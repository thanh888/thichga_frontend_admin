import { RoleUsers } from '@/utils/enum/role.enum';

import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Thống kê', href: paths.dashboard.overview, icon: 'chart-pie', role: [RoleUsers.ADMIN] },
  {
    key: 'admin_account',
    title: 'Tài khoản admin',
    href: paths.dashboard.admin_account,
    icon: 'admins',
    role: [RoleUsers.ADMIN],
  },
  {
    key: 'user_account',
    title: 'Người dùng',
    href: paths.dashboard.user_account,
    icon: 'users',
    role: [RoleUsers.ADMIN, RoleUsers.MANA_DEPOSIT_WITHDRAW],
  },
  {
    key: 'Games',
    title: 'Games',
    href: paths.dashboard.games,
    icon: 'game',
    role: [RoleUsers.ADMIN, RoleUsers.MANA_ROOM],
  },

  {
    key: 'bet_room',
    title: 'Quản lý cược',
    href: paths.dashboard.bet_room,
    icon: 'rooms',
    role: [RoleUsers.ADMIN, RoleUsers.MANA_ROOM],
  },
  {
    key: 'other_room',
    title: 'Quản lý cược gà đòn',
    href: paths.dashboard.other_room,
    icon: 'rooms',
    role: [RoleUsers.ADMIN, RoleUsers.MANA_ROOM],
  },
  {
    key: 'deposit_mode',
    title: 'Chế độ nạp',
    href: paths.dashboard.deposit_mode,
    icon: 'modes',
    role: [RoleUsers.ADMIN, RoleUsers.MANA_DEPOSIT_WITHDRAW],
  },
  {
    key: 'deposits',
    title: 'Đơn nạp tiền',
    href: paths.dashboard.deposits,
    icon: 'deposits',
    role: [RoleUsers.ADMIN, RoleUsers.MANA_DEPOSIT_WITHDRAW],
  },
  // {
  //   key: 'auto_deposits',
  //   title: 'Đơn nạp tiền tự động',
  //   href: paths.dashboard.auto_deposits,
  //   icon: 'deposits',
  //   role: [RoleUsers.ADMIN, RoleUsers.MANA_DEPOSIT_WITHDRAW],
  // },
  {
    key: 'withdraws',
    title: 'Đơn rút tiền',
    href: paths.dashboard.withdraws,
    icon: 'withdraws',
    role: [RoleUsers.ADMIN, RoleUsers.MANA_DEPOSIT_WITHDRAW],
  },
  { key: 'bank', title: 'Ngân hàng nạp tiền', href: paths.dashboard.bank, icon: 'banks', role: [RoleUsers.ADMIN] },
  { key: 'posts', title: 'Bài viết', href: paths.dashboard.posts, icon: 'post', role: [RoleUsers.ADMIN] },
  { key: 'supports', title: 'Link hỗ trợ', href: paths.dashboard.supports, icon: 'supports', role: [RoleUsers.ADMIN] },
  { key: 'banners', title: 'Banner', href: paths.dashboard.banners, icon: 'banners', role: [RoleUsers.ADMIN] },
  // { key: 'customers', title: 'Customers', href: paths.dashboard.customers, icon: 'users', role: [RoleUsers.ADMIN] },
] satisfies NavItemConfig[];
