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
  last_login_at?: Date;
  ipv6?: string;
  status?: UserStatus;
  referral_code?: string;
  referral_id?: string; // ID của người giới thiệu
  device_id?: string;
  role?: RoleUsers;
  bank?: BankInteface;
  money?: number;

  createdAt?: Date;
  updatedAt?: Date;
}
