import { BetHistoryStatusEnum } from '../enum/bet-history-status.enum';
import { BetResultEnum } from '../enum/bet-result.enum';
import { RoleUsers } from '../enum/role.enum';
import { StatusGame } from '../enum/status-game.enum';
import { TypeRevenueEnum } from '../enum/type-revenue.enum';
import { UserStatus } from '../enum/user-status.enum';

export function CheckFormDataNull(formData: any, setFormError: any) {
  let isNotNull = true;
  for (let item in formData) {
    if (!formData[item]) {
      isNotNull = false;
      setFormError((prev: any) => ({ ...prev, [item]: true }));
    }
  }
  return isNotNull;
}

export function setFieldError(setFormError: any, key: string, value: boolean) {
  setFormError((prev: any) => ({ ...prev, [key]: value }));
}

export const ConvertMoneyVND = (value: number): string => {
  return value.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
};

export const numberThousand = (value: string) => {
  return Number(value).toLocaleString('de-DE') ?? 0;
};

export const numberThousandFload = (value: string | number) => {
  const floatValue = parseFloat(value.toString());
  if (isNaN(floatValue)) return '0,00';
  return floatValue.toLocaleString('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// Dữ liệu chọn chức vụ
export const rolesAdmin = [
  { value: RoleUsers.ADMIN, label: 'ADMIN' },
  { value: RoleUsers.MANA_DEPOSIT_WITHDRAW, label: 'Nhân viên quản lý nạp rút' },
  { value: RoleUsers.MANA_ROOM, label: 'Nhân viên quản lý phòng' },
] as const;

// status user
export const listUserStatuss = [
  { value: UserStatus.ACTIVE, label: 'Hoạt động' },
  { value: UserStatus.BLOCK, label: 'Đã khóa' },
] as const;

// status bet history
export const listStatusHistory = [
  { value: BetHistoryStatusEnum.MATCHED, label: 'Đã khớp' },
  { value: BetHistoryStatusEnum.NOT_MATCHED, label: 'Chưa khớp' },
] as const;

export const listResultHistory = [
  { value: BetResultEnum.WIN, label: 'Thắng' },
  { value: BetResultEnum.LOSE, label: 'Thua' },
  { value: BetResultEnum.REFUDNED, label: 'Hoàn tiền' },
] as const;

export const listRevenueType = [
  { value: TypeRevenueEnum.BET, label: 'Cược' },
  { value: TypeRevenueEnum.DEPOSIT, label: 'Nạp' },
  { value: TypeRevenueEnum.WITHDRAW, label: 'Rút' },
] as const;

export const listStatusGame = [
  { value: StatusGame.ACTIVE, label: 'Hoạt đông' },
  { value: StatusGame.UN_ACTIVE, label: 'Dừng hoạt đông' },
  { value: StatusGame.COMING_SOON, label: 'Sắp ra mắt' },
] as const;

export const odds = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10];

export const convertDateTime = (dateTime: string) => {
  return new Date(dateTime ?? '').toLocaleString('vi-VN');
};
