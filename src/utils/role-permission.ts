import { RoleUsers } from './enum/role.enum';

export const isAdmin = (role: RoleUsers) => {
  if (role === RoleUsers.ADMIN) {
    return true;
  }
  return false;
};

export const isDepositWithdrawManager = (role: RoleUsers) => {
  if (role === RoleUsers.MANA_DEPOSIT_WITHDRAW) {
    return true;
  }
  return false;
};

export const isRoomManager = (role: RoleUsers) => {
  if (role === RoleUsers.MANA_ROOM) {
    return true;
  }
  return false;
};
