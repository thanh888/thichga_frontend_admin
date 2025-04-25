import { WithdrawStatusEnum } from '../enum/withdraw-status.enum';
import { BankInteface } from './bank.interface';

// Interface for the WithdrawTransaction document
export interface WithdrawTransactionInterface {
  // ID of the user who initiated the withdrawal
  userID?: string;

  // Status of the withdrawal (e.g., PENDING, APPROVED, REJECTED)
  status?: WithdrawStatusEnum;

  // Amount of money withdrawn
  money?: number;

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
