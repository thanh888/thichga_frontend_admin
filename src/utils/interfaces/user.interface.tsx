import { RoleUsers } from '../enum/role.enum';
import { UserStatus } from '../enum/user-status.enum';
import { BankInteface } from './bank.interface';

export interface UserInterface {
  _id?: string;

  fullname?: string;
  pin?: string;
  username: string;
  password?: string;
  email?: string;
  phone?: string;
  last_login_at?: Date | string;
  ipv6?: string;
  status?: UserStatus | string;
  referral_code?: string;
  referral_receiver_id?: string; // ID của người giới thiệu
  device_id?: string;
  role?: RoleUsers | string;
  bank?: BankInteface;
  money?: number;

  createdAt?: Date | string;
  updatedAt?: Date | string;
}
