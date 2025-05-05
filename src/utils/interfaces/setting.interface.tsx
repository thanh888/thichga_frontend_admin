import { DepositModeEnum } from '../enum/deposit-mode.enum';
import { BankInteface } from './bank.interface';
import { PostInterface } from './post.interface';
import { SupportContactInterface } from './support.interface';

// Interface for the Setting document
export interface SettingInterface {
  // Brief introduction or description
  _id: string;

  introduce?: string;

  // Array of banner image URLs or identifiers
  banner?: string[];

  // Slogan or tagline
  slogan?: string;

  // Bank information (e.g., account details)
  bank?: BankInteface;

  // Post information (e.g., announcement or content)
  post?: PostInterface;

  // Flag to enable/disable referral code feature
  referralCodeEnabled?: boolean;

  // Deposit mode (e.g., MANUAL, AUTOMATIC)
  deposit_mode?: DepositModeEnum;

  // Support contact information
  support_contact?: SupportContactInterface;

  // Optional Mongoose timestamps (createdAt, updatedAt)
  createdAt?: Date;
  updatedAt?: Date;
}
