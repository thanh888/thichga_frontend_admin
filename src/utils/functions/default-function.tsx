import { RoleUsers } from '../enum/role.enum';

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
  { value: RoleUsers.MANA_DEPOSIT, label: 'Nhân viên quản lý nạp rút' },
  { value: RoleUsers.MANA_WITHDRAW, label: 'Nhân viên quản lý phòng' },
] as const;
