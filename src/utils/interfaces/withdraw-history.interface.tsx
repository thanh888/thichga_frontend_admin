import { DepositModeEnum } from '../enum/deposit-mode.enum';
import { WithdrawStatusEnum } from '../enum/withdraw-status.enum';
import { BankInteface } from './bank.interface';

// Interface for the WithdrawTransaction document
export interface WithdrawTransactionInterface {
  _id: string;
  // ID of the user who initiated the withdrawal
  userID?: any;

  // Status of the withdrawal (e.g., PENDING, APPROVED, REJECTED)
  status?: WithdrawStatusEnum;

  code?: string;

  referenceCode?: string;

  // Amount of money withdrawn
  money?: number;

  mode: DepositModeEnum;
  // ID of the admin who processed the withdrawal
  adminID?: string;

  // Bank information for the withdrawal
  bank?: BankInteface;

  // Feedback or notes about the withdrawal
  feedback?: string;

  // Timestamp when the withdrawal was created
  createdAt?: Date;

  // Timestamp when the withdrawal was last updated
  updatedAt?: Date;
}
