// Interface for the BankInteface document
export interface BankInteface {
  // Name of the bank (e.g., Vietcombank)
  bankName?: string;

  // Bank account number
  accountNumber?: string;

  // Name of the account holder
  accountName?: string;

  // Bank branch
  branch?: string;

  // QR code image URL or identifier
  imageQR?: string;

  // Transfer description content (e.g., "NAP123456" or user ID reference)
  transferContent?: string;

  code?: number | string;
}
