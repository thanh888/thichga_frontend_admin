// Interface for the BettingRevenue document
export interface BettingRevenueInterface {
  _id: string;
  // Total revenue (including fees)
  profit?: number;

  // Total fees collected
  betMoney?: number;

  // Total amount bet by players
  expense?: number;

  revenue?: number;
  totalDeposits?: number;
  totalWithdraws?: number;

  // ID of the associated betting room
  dateClose?: string;

  // ID of the associated betting session
  typeRevenue?: string;

  // ID of the associated bet option
  roomName?: string;

  // Timestamp when the revenue record was created
  createdAt?: Date;

  // Timestamp when the revenue record was last updated
  updatedAt?: Date;
}
