import { DepositModeEnum } from '../enum/deposit-mode.enum';
import { DepositStatusEnum } from '../enum/deposit-status.enum';

// Interface for the DepositTransaction document
export interface DepositTransactionInterface {
  // ID of the user who made the deposit
  userID?: string;

  // Status of the deposit (e.g., PENDING, APPROVED, REJECTED)
  status?: DepositStatusEnum;

  // Amount of money deposited
  money?: number;

  // ID of the admin who processed the deposit (optional)
  adminID?: string;

  // Deposit mode (e.g., MANUAL, AUTOMATIC)
  mode?: DepositModeEnum;

  // Unique code for the deposit transaction
  code?: string;

  // Transaction code (e.g., bank transaction ID)
  transactionCode?: string;

  // Timestamp when the deposit was created
  createdAt?: Date;

  // Timestamp when the deposit was last updated
  updatedAt?: Date;
}
