import { RoleUsers } from '../enum/role.enum';
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
